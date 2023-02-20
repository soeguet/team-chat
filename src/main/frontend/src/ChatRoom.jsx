import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

export default function ChatRoom() {

    let stompClient = null;

    const [message, setMessage] = useState('')

    useEffect(() => {
        return () => {
            let Sock = new SockJS('http://localhost:8080/ws');
            stompClient = over(Sock);
            stompClient.connect({},onConnected, onError);
        };
    }, []);

    const onConnected = () => {

        console.log("Connected!")

        // setUserData({...userData,"connected": true});
        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        // stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        // userJoin();
    }


    const onError = (err) => {
        console.log(err);

    }

    function sendMessage() {

        stompClient.send("/app/message", {}, JSON.stringify("Hey!"))
    }

    return(

        <>
            <h1>{message}</h1>

            <button onClick={sendMessage}>Hello</button>
        </>
    )
}