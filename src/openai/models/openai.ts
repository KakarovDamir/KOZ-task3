import mongoose, { Schema, Document } from 'mongoose';

interface OpenaiReport extends Document {
    restaurantId: string;      // ID ресторана
    restaurantUrl: string;     // URL ресторана
    openaiAnalysis: string;    // Результат анализа от OpenAI
    createdAt: Date;           // Дата создания отчета
    updatedAt: Date;           // Дата обновления отчета
}

const OpenaiReportSchema: Schema = new Schema({
    restaurantId: { type: String, required: true },
    restaurantUrl: { type: String, required: true },
    openaiAnalysis: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


const OpenaiReport = mongoose.model<OpenaiReport>('OpenaiReport', OpenaiReportSchema);

export default OpenaiReport;
