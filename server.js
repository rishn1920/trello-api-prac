import 'dotenv/config';
import express from 'express';
import { handleBoardWebhook } from './index.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/webhook/board', (req, res) => {
    res.send('Hello, I am available');
});

app.post('/webhook/board', handleBoardWebhook);

app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.APP_URL}`);
});