import 'dotenv/config';
import crypto from 'crypto';
import _ from 'lodash';

getBoards()
    .then(boards => {
        if (_.isArray(boards)) {
            let totalBoards = boards.length;
            for (let i = 0; i < totalBoards; i++) {
                let board = boards[i];
                if (!board.closed && board.name === 'Insiderpot') {
                    createWebhook(board.id)
                        .then(webhook => {
                            console.info(webhook);
                        }).catch(error => {
                            console.error(error);
                        });
                    break;
                }
            }
        }
    }).catch(error => {
        console.error(error);
    });

function authorize() {
    return fetch(`https://trello.com/1/authorize?expiration=1day&name=MyPersonalToken&scope=read&response_type=token&key=${process.env.API_KEY}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        try {
            response = response.json();
        } catch (error) {}

        return response;
    }).catch(error => {
        console.error(error);
    });
}

function getBoards() {
    return fetch(`https://api.trello.com/1/members/me/boards?key=${process.env.API_KEY}&token=${process.env.API_TOKEN}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        try {
            response = response.json();
        } catch (error) {}

        return response;
    }).catch(error => {
        console.error(error);
    });
}

function listWebhooks() {
    return fetch(`https://api.trello.com/1/tokens/${process.env.API_TOKEN}/webhooks/?key=${process.env.API_KEY}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        try {
            response = response.json();
        } catch (error) {}

        return response;
    }).catch(error => {
        console.log(error);
    });
}

function createWebhook(idModel) {
    return fetch(`https://api.trello.com/1/tokens/${process.env.API_TOKEN}/webhooks/?key=${process.env.API_KEY}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            description: 'A webhook for handling board',
            callbackURL: process.env.BOARD_WEBHOOK_CALLBACK_URL,
            idModel
        })
    }).then(response => {
        try {
            response = response.json();
        } catch (error) {}

        return response;
    }).catch(error => {
        console.log(error);
    });
}

function verifyWebhookRequest(request, callbackURL) {
    const base64Digest = content => {
        return crypto.createHmac("sha1", process.env.API_SECRET).update(content).digest('base64');
    };

    let content = JSON.stringify(request.body) + callbackURL;
    let doubleHash = base64Digest(content);
    let headerHash = request.headers['x-trello-webhook'];

    return doubleHash === headerHash;
}

export function handleBoardWebhook(req, res) {
    if (!verifyWebhookRequest(req, process.env.BOARD_WEBHOOK_CALLBACK_URL)) {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to verify webhook request'
        });
    }

    console.log(
        req.body.action.data,
        req.body.action.display,
        req.body.action.memberCreator
    );
    res.status(200).json({
        status: 'success',
        data: req
    });
}