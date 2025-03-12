import { Modal } from "@mantine/core"
import MessageInput from "./message-input"
import { useDisclosure } from "@mantine/hooks"
import { Room } from "@repo/db"

const DisplayRoom = ({room, joinRoom, sendMessage} : {
    room: Room
    joinRoom: (roomId: string) => void
    sendMessage: (room: string, message: string) => void
}) => {

    const [opened, {open, close}] = useDisclosure(false);

    return (
        <>
            <div className="px-20 bg-blue-600 font-semibold rounded-md py-3 w-1/2 text-center my-2 cursor-pointer text-white" onClick={() => {
                open();
                joinRoom(room.id);
            }}>
                {room.name}
            </div>

            <Modal opened={opened} onClose={close} centered>
                <MessageInput placeholder="Send a message" type="message" buttonLabel="Send" roomId={room.id} buttonOnClick={sendMessage}/>
            </Modal>
        </>
    )
}

export default DisplayRoom;