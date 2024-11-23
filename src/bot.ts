import TelegramBot from 'node-telegram-bot-api';
import { OpenAIService } from './openai/openai_service';
import dotenv from "dotenv"
dotenv.config();


const BOT_TOKEN = process.env.BOT_TOKEN;
const service = new OpenAIService();
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const restaurantKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: 'Мамыр-4 микрорайон, 197' }],  
      [{ text: 'Улица Минина, 14/1' }],      
      [{ text: 'Улица Шевченко, 85а' }]      
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать! Выберите ресторан для получения анализа:', restaurantKeyboard);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  let restaurantId = '';

  switch (text) {
    case 'Мамыр-4 микрорайон, 197':
      restaurantId = '674219880a6e737c7c800b8b';
      break;
    case 'Улица Минина, 14/1':
      restaurantId = '674219a50a6e737c7c800b8d';
      break;
    case 'Улица Шевченко, 85а':
      restaurantId = '67421a1a1ad60a5071af396f';
      break;
    default:
      bot.sendMessage(chatId, 'Пожалуйста, выберите один из предложенных ресторанов.');
      return;
  }

  try {
    const { restaurantUrl, openaiAnalysis } = await service.analyzeAndSaveRestaurantData(restaurantId);
    bot.sendMessage(chatId, `**Restaurant URL:** [url](${restaurantUrl})\n**Analysis:**\n${openaiAnalysis}`, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error fetching restaurant analysis:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при получении анализа ресторана. Пожалуйста, попробуйте позже.');
  }
});

console.log('Bot is running...');