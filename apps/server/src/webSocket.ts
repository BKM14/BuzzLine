import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { prisma } from "@repo/db";

dotenv.config()

class WebSocketService {
    private static instance: WebSocketService;
    private wss: WebSocketServer;
    private rooms: Record<string, Set<WebSocket>> = {};

    private constructor(port: number) {
        this.wss = new WebSocketServer({ port });

        this.wss.on("connection", (ws, req) => {

            const url = new URL(req.url || "/", `http://${req.headers.host}`)
            const token = url.searchParams.get("token");

            if (!token) {
                ws.close(1008, "Authentication required");
                return;
            }

            try {
                const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as jwt.JwtPayload;
                (ws as any).userId = payload.id;
            } catch(error) {
                console.error("Error verifying token: ", error);
                ws.close(1008, "Invalid token");
            }

            ws.on("error", console.error);

            console.log("Client connected");

            let currentRoom: string | null = null;

            ws.on("message", async (message) => {
                const data = JSON.parse(message.toString());
                const userId = (ws as any).userId;

                if (!userId) {
                    ws.send(JSON.stringify({ error: "Unauthorized" }));
                    return;
                }

                if (data.type === "join") {
                    const roomId = data.roomId;
                    
                    if (!this.rooms[roomId]) {
                        this.rooms[roomId] = new Set();
                    }
                    
                    this.rooms[roomId].add(ws);
                    currentRoom = roomId;
                    console.log(`Client joined room: ${roomId}`);

                } else if (data.type === "message") {
                    if (currentRoom) {
                        this.broadcast(currentRoom, ws, data.message);
                        await prisma.message.create({
                            data: {
                                userId: userId,
                                roomId: data.roomId,
                                content: data.message
                            }
                        })
                    } else ws.send(JSON.stringify({ error: "Please join a room before sending a message!" }));
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
