import express from 'express';
import connectDB from './models/database.js';
import dotenv from 'dotenv';
import  Together  from "together-ai";
import readline from 'readline';

dotenv.config();

connectDB();
const together = new Together();

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question('Ask me: ', async (ans) => {
  const response = await together.chat.completions.create({
    model: "Qwen/Qwen3-235B-A22B-Thinking-2507",
    messages: [
      {
        role: 'user',
        content: '' + ans,
      },
    ],
  });
  console.log(response.choices[0].message.content);
});




const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});



export default app;
