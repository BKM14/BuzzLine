"use client";
import CreateRoom from "./components/create-room";
import UserRooms from "./components/user-rooms";
import { useWebSocket } from "./hooks/useWebSocket";

export default function Page(): JSX.Element {

  const { messages, joinRoom, sendMessage } = useWebSocket("ws://localhost:8080");

  return (
    <div className="flex flex-col justify-between min-h-screen">
            <div className="flex flex-col items-center">
              <h1>BuzzLine</h1>
              <div>
              { messages.length > 0  ? ( messages.map((message, key) => (
                  <div key={key}>{message}</div>
                ))
              ) : (
              <div>
                Waiting for messages in the group
              </div>
              )}
              </div>
            </div>
            <div className="w-1/2 mx-auto">
                <CreateRoom />
              </div>
              <div className="w-1/2 mx-auto">
                <UserRooms joinRoom={joinRoom} sendMessage={sendMessage}/>
              </div>
    </div>
  );
}