import { useState } from "react"

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

  return <div className="flex ui-justify-center">
        <input className="border-2 ui-border-zinc-500 ui-my-4 p-2 ui-w-2/5 h-1/2" onChange={(e) => {setInput(e.target.value)}} placeholder={placeholder} type={type} value={input}/>
        <button className="h-1/2 ui-my-auto p-2 rounded-md bg-green-400 border-2 mx-2 ui-w-24 hover:ui-bg-green-500 ui-duration-200" onClick={() => { 
          joinRoom ? onClick({
            "type": "join", 
            "room": input
          }) : onClick({
            "type": "message",
            "message": input
          })
          setInput("");
        }} type="button">Send</button>
    </div>
}