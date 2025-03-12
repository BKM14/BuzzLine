import { useEffect, useState } from "react";
import { getUserRooms } from "../lib/actions";
import { Room } from "@repo/db";
import DisplayRoom from "./display-room";

export default function UserRooms({joinRoom, sendMessage}: {
  joinRoom: (room: string) => void,
  sendMessage: (roomId: string, message: string) => void
  }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      const res = await getUserRooms();
      if (res.status === 200 && res.rooms) {
        setRooms(res.rooms);
      }
      setLoading(false);
    }
    fetchRooms();
  }, []);

  return (
    <div>
        {loading ? (
            <p className="text-center">Fetching your rooms...</p>
        ) : (
            <div className="flex flex-col justify-center items-center">
            <h1>Your Rooms</h1>
            {rooms.length > 0 ? rooms.map((room: Room, index: number) => (
                <DisplayRoom room={room} joinRoom={joinRoom} key={index} sendMessage={sendMessage}/>
            )) : (
                <div>You have not joined any rooms.</div>
            )}
            </div>
        )}
</div>
  );
}
