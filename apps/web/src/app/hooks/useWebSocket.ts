import { useEffect, useState, useRef } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<string[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const router = useRouter();

    useEffect(() => {

        const connectWebSocket = async () => {
            const session = await getSession();
            if (!session?.user.id) {
                console.error("User not authenticated");
                router.push("/api/auth/signin");
                return;
            }
            const token = session.jwt;

            const ws = new WebSocket(`${url}/?token=${token}`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected");
            }

            ws.onmessage = async (event) => {
                const data = JSON.parse(event.data) as {
                    "type": string,
                    "message": string
                };
                setMessages((prevMessages: string[]) => [...prevMessages, data.message]);
            }

            ws.onclose = () => {
                console.log("Socket Disconnected.")
                wsRef.current = null;
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        }

        connectWebSocket();

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close()
            }
        };
    }, [url]);

    const sendMessage = async (
        message: string,
        roomId: string
    ) => {
        try {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: "message",
                    message,
                    roomId,
                }));
            } else {
                console.log("Socket is not open");
            }
        } catch (e: unknown) {
            const error = e instanceof Error ? e.message : e
            console.error(`An error occured: ${error}`);
        }
    }

    const joinRoom = async (roomId: string) => {
        try {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: "join",
                    roomId: roomId
                }));
            } else {
                console.log("Socket is not open");
            }
        } catch (e: unknown) {
            const error = e instanceof Error ? e.message : e
            console.error(`An error occured: ${error}`);
        }
    }

    return {messages, sendMessage, joinRoom};
}