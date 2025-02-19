import { WebSocketServer, WebSocket } from "ws";

class WebSocketService {
    private static instance: WebSocketService;
    private wss: WebSocketServer;
    private rooms: Record<string, Set<WebSocket>> = {};

    private constructor(port: number) {
        this.wss = new WebSocketServer({ port });

        this.wss.on("connection", (ws) => {

            ws.on("error", console.error);

            console.log("Client connected");

            let currentRoom: string | null = null;

            ws.on("message", (message) => {
                const data = JSON.parse(message.toString());

                if (data.type === "join") {
                    const roomName = data.room;
                    
                    if (!this.rooms[roomName]) {
                        this.rooms[roomName] = new Set();
                    }
                    
                    this.rooms[roomName].add(ws);
                    currentRoom = roomName;
                    console.log(`Client joined room: ${roomName}`);

                } else if (data.type === "message") {
                    if (currentRoom) this.broadcast(currentRoom, ws, data.message);
                    else ws.send("Please join a room before sending a message!");
                }
            });

            ws.on("close", () => {
                if (currentRoom && this.rooms[currentRoom]) {
                    this.rooms[currentRoom].delete(ws);
                    if (this.rooms[currentRoom].size === 0) {
                        delete this.rooms[currentRoom];
                    }
                    console.log(`Client left room: ${currentRoom}`);
                }
            });
        });

        console.log(`WebSocket server running on ws://localhost:${port}`);
    }

    public static getInstance(port = 8080): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService(port);
        }
        return WebSocketService.instance;
    }

    private broadcast(room: string, sender: WebSocket, message: string) {
        if (this.rooms[room]) {
            this.rooms[room].forEach(client => {
                if (client !== sender && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ room, message }));
                }
            });
        }
    }
}

export const websocketServer = WebSocketService.getInstance();
