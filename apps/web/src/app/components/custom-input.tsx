import { useState } from "react"
import { Button, TextInput } from "@mantine/core";

export default function CustomInput({onClick, placeholder, type, joinRoom}: {
  onClick: (data: {
    type: string,
    message?: string,
    room?: string
})=> void,
  placeholder: string,
  type: string,
  joinRoom: boolean
}): JSX.Element {

  const [input, setInput] = useState("");

  return <div className="flex justify-center px-4 py-2">
        <TextInput className="border border-slate-400 rounded-full w-1/2 lg:w-1/4" onChange={(e) => {setInput(e.target.value)}} placeholder={placeholder} radius="xl" type={type} value={input} variant="filled"/>
        <Button className="min-w-fit" color="green" mx={4} onClick={() => { 
          joinRoom ? onClick({
            "type": "join", 
            "room": input
          }) : onClick({
            "type": "message",
            "message": input
          })
          setInput("");
        }} radius="xl"  type="button">Send</Button>
    </div>
}