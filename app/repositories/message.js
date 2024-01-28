import file from '../helpers/file.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from 'path';

export const saveMessage = (message, room) => {
    let roomDir = path.resolve(__dirname, '../../clients/chats');
    file.checkOrCreateDir(roomDir);

    const roomPath = `${roomDir}/${room}.json`
    const existingMessages = file.getContentJsonFile(roomPath)
    existingMessages.push(message);

    file.writeFileSync(roomPath, JSON.stringify(existingMessages, null, 2));
}

export const getRoomData = (roomId) => {
    let roomDir = path.resolve(__dirname, '../../clients/chats');
    const roomPath = `${roomDir}/${roomId}.json`
    return file.getContentJsonFile(roomPath);
}