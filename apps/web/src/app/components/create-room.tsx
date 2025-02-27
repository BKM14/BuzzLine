import { Button, TextInput } from "@mantine/core"
import { useState } from "react"
import { createRoom } from "../lib/actions";

export default function CreateRoom() {

    const [roomName, setRoomName] = useState("");

    return <div className="p-10 bg-slate-300 flex items-center justify-center">
        <TextInput variant="filled" size="sm" placeholder="Create a room" radius={"xl"} w="75%" onChange={e => setRoomName(e.target.value)}/>
        <Button variant="fiiled" color="green" radius={"xl"} size="sm" mx={8} onClick={() => createRoom(roomName)}>Create</Button>
    </div>
}