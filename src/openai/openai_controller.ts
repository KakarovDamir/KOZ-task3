// import { Request, Response } from "express";
// import OpenAIService from "./openai_service";

// const openAIService = new OpenAIService();

// export const getRestaurantAnalytics = async (req: Request, res: Response): Promise<void> => {
//   const { restaurantId } = req.params;

//   try {
//     // Perform the analysis and save it, if it hasn't been done recently
//     await openAIService.analyzeAndSaveRestaurantData(restaurantId);
    
//     // Retrieve the latest analysis result, which includes both the URL and the analysis report
//     const latestReport = await openAIService.getLatestAnalysis(restaurantId);

//     res.json({
//       restaurantUrl: latestReport.restaurantUrl,
//       openaiAnalysis: latestReport.openaiAnalysis,
//     });
//   } catch (error) {
//     console.error("Controller error:", error);
//     res.status(500).json({ message: "Error processing request" });
//   }
// };