import express from 'express';
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';
import cors from 'cors';    
import './bot'

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);
app.use(express.json());
app.use('/api/',globalRouter);

app.get('/',(request,response) =>{
  response.send("Hello World!");
})

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
