import dotenv from "dotenv";
import { OpenAI } from "openai";
import { MongoClient, ObjectId } from "mongodb";
import OpenaiReport from "./models/openai";
dotenv.config();

const gpt = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const uri = process.env.MONGODB_URL;
const mongoClient = new MongoClient(`${uri}`);
const db = mongoClient.db("DemoDay");
const reviewsCollection = db.collection("reviews");

export class OpenAIService {
  public async getRestaurantData(restaurantId: string): Promise<{ reviews: string[]; restaurantUrl: string }> {
    try {
      const restaurant = await reviewsCollection.findOne({ _id: new ObjectId(restaurantId) });
      if (!restaurant) throw new Error("Restaurant data not found");

      const reviews = restaurant.reviews?.map((review: { text: string }) => review.text) || [];
      const restaurantUrl = restaurant.restaurant_url || "";

      return { reviews, restaurantUrl };
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      throw new Error("Failed to fetch restaurant data from MongoDB");
    }
  }

  public async analyzeAndSaveRestaurantData(restaurantId: string): Promise<{ restaurantUrl: string; openaiAnalysis: string }> {
    try {
      const { reviews, restaurantUrl } = await this.getRestaurantData(restaurantId);

      if (reviews.length === 0) {
        console.log("No reviews available for analysis.");
        return { restaurantUrl, openaiAnalysis: "No reviews to analyze." };
      }

      const userPrompt = reviews.join("\n");

      const systemPrompt = `
        You are analyzing customer reviews for a restaurant. Your task is to identify what customers mention as positive and negative aspects.
        Positive aspects are things customers praise (e.g., tasty food, good service, cozy atmosphere).
        Negative aspects are issues or complaints (e.g., poor service, long waits, expensive menu).
        Identify key trends such as the frequency of positive and negative comments.
      `;

      const completion = await gpt.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const openaiAnalysis = completion.choices?.[0]?.message?.content || "Analysis not obtained.";
      await this.saveAnalysisToMongo(restaurantId, restaurantUrl, openaiAnalysis);
      return { restaurantUrl, openaiAnalysis };
    } catch (error) {
      console.error("Error during analysis:", error);
      throw error;
    }
  }

  private async saveAnalysisToMongo(restaurantId: string, restaurantUrl: string, analysis: string): Promise<void> {
    try {
      const report = new OpenaiReport({ restaurantId, restaurantUrl, openaiAnalysis: analysis });
      await report.save();
      console.log("Report successfully saved to MongoDB");
    } catch (error) {
      console.error("Error saving report to MongoDB:", error);
    }
  }
}