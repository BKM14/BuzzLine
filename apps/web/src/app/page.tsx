"use client";
import CreateRoom from "./components/create-room";
import CustomInput from "./components/custom-input";
import UserRooms from "./components/user-rooms";
import { useWebSocket } from "./hooks/useWebSocket";

export default function Page(): JSX.Element {

  const { messages, sendMessage } = useWebSocket("ws://localhost:8080");

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
                <UserRooms />
              </div>
            <div className="bg-gray-200">
            <CustomInput onClick={sendMessage} placeholder="Join A Room" type="text" joinRoom={true}/>
            <CustomInput onClick={sendMessage} placeholder="Send a message" type="text" joinRoom={false}/>
            </div>
    </div>
  );
}