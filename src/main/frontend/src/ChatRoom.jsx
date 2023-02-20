import React, {useEffect, useRef, useState} from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import Comment from "./Comment.jsx";

export default function ChatRoom() {

    const [stompClient, setStompClient] = useState(null)
    const [textArea, setTextArea] = useState('')
    const [message, setMessage] = useState([]);
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
            <main>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow">
                        <h1 className="text-2xl font-semibold text-gray-900">chat</h1>
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                        {/* Replace with your content */}
                        <div className="py-4">
                            <div className="rounded-lg border-4 border-dashed border-gray-200">
                                <div className={'container'}>{publicChats.map(
                                    (data,index) => (

                                        <div key={index}><Comment message={data} /></div>
                                    )
                                )}</div>
                            </div>
                        </div>
                        {/* /End replace */}
                    </div>
                </div>
            </main>



        </>
    )
}

