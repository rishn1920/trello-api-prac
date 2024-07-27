import 'dotenv/config';
import express from 'express';
import { handleBoardWebhook } from './index.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/webhook/board', handleBoardWebhook);

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://${process.env.HOSTNAME}:${process.env.PORT}/`);
});