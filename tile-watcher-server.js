import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export async function webSocketStart() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const wss = new WebSocketServer({ port: 10077 });

    const tileDir = path.join(__dirname, 'tiles');

    fs.watch(tileDir, { recursive: true }, (eventType, filename) => {
        if (filename && /\.(png|jpg|jpeg)$/i.test(filename)) {
            console.log(`File changed: ${filename}`);
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ type: 'tileUpdate', filename }));
                }
            });
        }
    });
}
