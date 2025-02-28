import { Button, Modal, TextInput } from "@mantine/core"
import { useState } from "react"
import { createRoom } from "../lib/actions";
import { useDisclosure } from "@mantine/hooks";

export default function CreateRoom() {

    const [roomName, setRoomName] = useState("");
    const [opened, {open , close}] = useDisclosure();

    return <div className="p-10 bg-slate-300 flex items-center justify-center">
        <Modal opened={opened} onClose={close} centered withCloseButton={false}>
                <div className="flex flex-col md:flex-row justify-center items-center">
                    <TextInput variant="filled" size="sm" placeholder="Create a room" radius={"xl"} w="70%" onChange={e => setRoomName(e.target.value)}/>
                    <Button variant="fiiled" color="green" radius={"xl"} size="sm" mx={4} my={4} onClick={() => {
                        createRoom(roomName);
                        close();
                    }}>Create</Button>
                </div>
            </Modal>
            <Button variant="default" onClick={open} className="min-w-fit">
                Create Room
            </Button>
    </div>
}