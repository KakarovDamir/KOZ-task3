import mongoose, { Schema, Document } from "mongoose";

// Создайте схему для ресторана
const DemoDaySchema = new Schema({
    reviews: [
        {
            text: { type: String, required: true },  // Отзывы клиентов
        },
    ],
    restaurant_url: { type: String, required: true },  // URL ресторана
});

// Интерфейс для документа DemoDay
export interface IDemoDay extends Document {
    reviews: { text: string }[];
    restaurant_url: string;
}

// Регистрируем модель DemoDay
const DemoDay = mongoose.model<IDemoDay>("DemoDay", DemoDaySchema);

export default DemoDay;
