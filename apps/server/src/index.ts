import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();

app.use(express.json());
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });
console.log("Starting websocket server on port 8080");
console.log("Access at: ws://127.0.0.1:8080/")

wss.on("connection", function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data: string, isBinary: boolean | undefined) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary })
            }
        })
    })

    ws.on('close', function close(code, reason) {
        console.log("Socket closed: ", reason, code.toString());
    })
})