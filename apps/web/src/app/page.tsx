"use client";
import CustomInput from "@repo/ui/CustomInput";
import { useWebSocket } from "./hooks/useWebSocket";

export default function Page(): JSX.Element {

  const { messages, sendMessage } = useWebSocket("ws://localhost:8080");

  return (
    <div className="flex flex-col justify-between min-h-screen">
            <div className="flex flex-col items-center">
              <h1>Next.js WebSocket Client</h1>
              <div>
              { messages.length !==0  ? ( messages.map((message, key) => (
                  <div key={key}>{message}</div>
                ))
              ) : (
              <div>
                Waiting for messages in the group
              </div>
              )}
              </div>
            </div>
            <div className="bg-gray-200">
              <CustomInput onClick={sendMessage} placeholder="Send a message" type="text"/>
            </div>
    </div>
  );
}