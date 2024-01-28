import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'node:http';
import {saveMessage, getRoomData} from './app/repositories/message.js';
import cors from 'cors';
import moment from 'moment';


import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import file from './app/helpers/file.js';

const app = express();
const server = createServer(app)
const port = 3060;

app.use(cors())

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
})

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/room/:roomId', (req, res) => {
    const {roomId} = req.params;
    let roomDir = path.resolve(__dirname, 'logs');

    const data = getRoomData(roomId);
    file.checkOrCreateDir(roomDir)
    const pathLoc = `${roomDir}/fetch.json`;
    const logs = file.getContentJsonFile(pathLoc)
    logs.push({
        type: 'Chat',
        room_id: roomId,
    })

    file.writeFileSync(pathLoc, JSON.stringify(logs, null, 2));
    res.json(data).status(200)
})

io.on('connection', (socket) => {
    const clientRequest = socket.client.request;
    const clientHeader  = clientRequest.headers;
    socket.on('join_room', (room) => {
        socket.join(room);
        io.to(room).emit('testing', 'you are on ' + room);
    });

    socket.on('chatMessage', (data) => {
        const { message, room } = data;

        try {
            saveMessage(message, room);
            io.to(room).emit('message', message);
        } catch(error) {
            console.log('Error save message: ', error);
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

server.listen(port, () => {
    console.log(`running on http://localhost:${port}`)
})