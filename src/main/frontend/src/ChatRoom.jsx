import React, {useEffect, useState} from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import Comment from "./Comment.jsx";

export default function ChatRoom() {

    const [stompClient, setStompClient] = useState(null)
    const [textArea, setTextArea] = useState('')
    const [message, setMessage] = useState('');
    const [publicChats, setPublicChats] = useState(["hi"]);
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    //initial connection to the server and updating stompClient
    useEffect(() => {
        return () => {
            let Sock = new SockJS('http://localhost:8080/ws');
            let stompClientInit = Stomp.over(Sock);
            stompClientInit.connect({}, () => onConnected(stompClientInit), onError);

            setStompClient(stompClientInit);
        };
    }, []);

    //Callback in function, otherwise stompClient will be null, since the connection is too fast
    const onConnected = (client) => {
        console.log(client.toString());
        setStompClient(client);
        client.subscribe('/chatroom/public', onMessageReceived);
    };

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);

        publicChats.push(payloadData.message);
        setPublicChats([...publicChats]);
    }

    const onError = (err) => {
        console.log(err);

    }

    function sendMessage() {

            const chatMessage = {
                message: textArea
            };

            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setTextArea('')

    }

    return (

        <>
            <h1>{message}</h1>

            <div>{publicChats.map(
                (data,index) => (

                    <div key={index}><Comment /></div>
                )
            )}</div>




            <div>
                <textarea value={textArea} onChange={e => setTextArea(e.target.value)}></textarea>
                <button onClick={sendMessage}>Hello</button>
            </div>

        </>
    )
}

