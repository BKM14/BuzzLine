import { useEffect, useState, useRef } from "react";
import { sendMessageToRoom } from "../lib/actions";

export const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<string[]>([]);
    const wsRef = useRef<WebSocket | null>(null);


    useEffect(() => {
        const ws = new WebSocket(url);
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

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close()
            }
        };
    }, [url]);

    const sendMessage = async (data: {
        type: string,
        message?: string,
        room?: string
    }) => {
        try {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(data));
                if (data.type === "message" && data.message && data.room) await sendMessageToRoom(data.room, data.message);
            } else {
                console.log("Socket is not open");
            }
        } catch (e: unknown) {
            const error = e instanceof Error ? e.message : e
            console.error(`An error occured: ${error}`);
        }
    }
    return {messages, sendMessage};
}