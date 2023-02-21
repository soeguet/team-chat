import './App.css'
import ChatRoom from "./ChatRoom.jsx";


function App() {

    console.log(import.meta.env.VITE_PUSHER_APP_ID)

    return (

        <ChatRoom />
    )
}

export default App
