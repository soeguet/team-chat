import React, {useEffect, useRef, useState} from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import Comment from "./Comment.jsx";
import env from "react-dotenv";
import Pusher from "pusher-js";

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
    const chatPanel = React.useRef(null);

    useEffect(() => {
        return () => {
            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            const pusher = new Pusher(
                import.meta.env.VITE_PUSHER_KEY, {
                cluster: import.meta.env.VITE_PUSHER_CLUSTER
            });

            const channel = pusher.subscribe('Team-Chat-AiV');
            channel.bind('my-event', function(data) {
                alert(JSON.stringify(data));
            });
        };
    }, []);



    useEffect(() => {
        scrollToBottomOfDiv()

    }, [publicChats.length]);

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

        Notification.requestPermission().then(function(permission) {
            console.log('permiss', permission)
            const notification = new Notification('HI')
        });
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

        // const objDiv = document.getElementById("chat-panel");
        // objDiv.scrollTop = objDiv.scrollHeight;
        // document.getElementById('chat-panel').scrollIntoView({ behavior: 'smooth', block: 'end' });
        scrollToBottomOfDiv();
    }

    function onEnterPress(e) {

        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            sendMessage();
        }
    }

    function scrollToBottomOfDiv() {

        chatPanel.current?.scrollIntoView({ behavior: "smooth", block:"end" })
    }


    return (

        <>
            <div className={'grid h-[90vh]'}>


                <div className="flex items-center justify-center  h-[4vh] ">
                        <h1 className="text-2xl font-semibold text-gray-900">chat</h1>
                </div>


                <div className="py-1 h-[80vh] grid overflow-auto"  >
                    <div>
                        {/* Replace with your content */}
                        <div className="py-4 grid h-full">
                            <div className="rounded-lg border-4 border-dashed border-gray-200" ref={chatPanel}>
                                <div className={'container '}  >
                                    {publicChats.map(
                                    (data,index) => (

                                        <div  key={index}><Comment message={data} /></div>
                                    )
                                )}</div>
                            </div>
                        </div>
                        {/* /End replace */}
                    </div>
                </div>

                <div className={'flex flex-row'} >

                        <div className={'basis-11/12 pr-2'} >

                            <label htmlFor="message"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            </label>

                            <textarea id="message" rows="1"
                                      className="block p-2.5 my-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="your text here.."
                                      onKeyDown={e => onEnterPress(e)}
                                      value={textArea} onChange={e => setTextArea(e.target.value)}>

                                    </textarea>

                        </div>
                        <div>
                            <button type="button"
                                    onClick={sendMessage}
                                    className="text-white bg-blue-700 hover:bg-blue-400 focus:ring-1 focus:ring-blue-200 font-medium rounded-lg text-sm px-5  my-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none dark:focus:ring-blue-200">
                                Send {publicChats.length}
                            </button>
                        </div>

                </div>
            </div>



        </>
    )
}

