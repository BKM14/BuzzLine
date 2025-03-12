import { useState } from "react"
import { Button, TextInput } from "@mantine/core";

export default function MessageInput({placeholder, type, buttonOnClick, buttonLabel, roomId}: {
  placeholder: string,
  type: string,
  buttonOnClick: (...args: any[]) => void,
  buttonLabel: string,
  roomId: string
}): JSX.Element {

  const [input, setInput] = useState("");

  return <div className="flex justify-center px-4 py-2">
        <TextInput className="border border-slate-400 rounded-full w-full" onChange={(e) => {setInput(e.target.value)}} placeholder={placeholder} radius="xl" type={type} value={input} variant="filled"/>
        <Button className="min-w-fit" color="green" mx={4} radius="xl" onClick={() => {
          buttonOnClick(input, roomId);
          setInput("");
        }}  type="button">{buttonLabel}</Button>
    </div>
}