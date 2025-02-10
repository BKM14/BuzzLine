/* eslint-disable/
/* eslint-disable no-console */
/* eslint-disable unicorn/filename-case */
import { useEffect, useState, useRef } from "react";

export const useWebSocket = (url: string): {
    messages: string[],
    sendMessage: (message: string) => void
} => {
    const [messages, setMessages] = useState<string[]>([]);
    const wsRef = useRef<WebSocket | null>(null);


    useEffect(() => {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
        }

        ws.onmessage = (event) => {
            const message = event.data as string;
            setMessages((prevMessages: string[]) => [...prevMessages, message]);
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

    const sendMessage = (message: string) => {
        try {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(message);
            } else {
                console.log("Socket is not open");
            }
        } catch (e) {
            console.error(`An error occured: ${e.message}`);
        }
    }

    return {messages, sendMessage};
}