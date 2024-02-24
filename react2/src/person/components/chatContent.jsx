import React, { Component, useState, createRef, useEffect } from "react";
import SendIcon from '@mui/icons-material/Send';
import "./chatContent.css";

import SockJS from 'sockjs-client';
import StompJs from 'stompjs';
import ChatItem from "./ChatItem";
import Avatar from "./avatar";
import axios from "axios";
function isValidJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}
let typingTimeout;
export default class ChatContent extends Component {
    messagesEndRef = createRef(null);


    constructor(props) {
        super(props);
        this.state = {
            chat:[],
            msg: "",
            stompClient: null,
            isTyping: false,
        };
    }

    initWebSocket(selectedUser) {
        // Reset the chat state to an empty array when a new user is selected
        this.setState({ chat: [] }, () => {
            const socket = new SockJS('http://localhost:8083/ws');
            const stompClient = StompJs.over(socket);

            stompClient.connect({}, (frame) => {
                const email = sessionStorage.getItem('email');
                const userSpecificDestination = `/topic/chat/${this.props.emailSelected}/${sessionStorage.getItem('email')}`;
                console.log(userSpecificDestination);
                stompClient.subscribe(userSpecificDestination, (message) => {
                    // const receivedMessage = JSON.parse(message.body);
                    const formattedMessage = message.body; // Get the message body

                    let receivedMessage;
                    if (isValidJson(formattedMessage)) {
                        // Message is a valid JSON
                        receivedMessage = JSON.parse(formattedMessage);
                    }
                    else{
                        receivedMessage=formattedMessage;
                    }
                    const parts = userSpecificDestination.split('/');
                    const emailSelected = parts[3];
                    console.log("mesage received: ", receivedMessage);
                    console.log("the user of the chat entered is: ", this.props.selectedUser)
                    console.log("the user of the message sent is: ", emailSelected)
                    if(this.props.emailSelected === emailSelected) {
                        console.log("vnreiuvnier  ", receivedMessage);
                        if(receivedMessage==="seen"){
                            this.fetchInitialMessages();
                        }
                        else if(receivedMessage === "typing"){
                            const isTyping = true;
                            this.setState({isTyping});
                        }
                        else if(receivedMessage === "not typing"){
                            const isTyping = false;
                            this.setState({isTyping});
                        }
                        else{
                            const formattedMessage = {
                                key: this.state.chat.length + 1,
                                color: this.props.selectedUserColor,
                                type: "other",
                                msg: receivedMessage,
                                isSeen: true,// Assuming receivedMessage has a 'msg' property
                            };
                            // Process the received message and update the chat
                            this.setState(prevState => ({
                                chat: [...prevState.chat, formattedMessage]
                            }));
                            this.scrollToBottom();
                            this.markMessageAsSeenAndNotifyBackend(receivedMessage.id);
                        }}
                });
                this.setState({ stompClient }, () => {
                    this.notifyUserEntry(); // Call notifyUserEntry once WebSocket is connected

                });
            });


        });

    }
    onStateChange = (e) => {
        const { stompClient, isTyping } = this.state;
        const { selectedUser } = this.props;
        const typing = e.target.value !== '';
        // Check if the input field is empty or not
        if (typing ) {
            clearTimeout(typingTimeout);
            // Emit a typing status message through WebSocket
            stompClient.send(`/app/chat/${sessionStorage.getItem('email')}/${this.props.emailSelected}/typing`, {}, JSON.stringify("typing"));
            typingTimeout = setTimeout(() => {
                stompClient.send(`/app/chat/${sessionStorage.getItem('email')}/${this.props.emailSelected}/typing`, {}, JSON.stringify('not typing'));
                 }, 1000);
        }
        this.setState({ msg: e.target.value });
    };
    notifyUserEntry() {
        const { stompClient } = this.state;

        stompClient.send(`/app/chat/${sessionStorage.getItem('email')}/${this.props.emailSelected}/seen`, {}, JSON.stringify('message seen at first'));

    }

    markMessageAsSeenAndNotifyBackend(messageId) {
        const { stompClient, chat } = this.state;

        // Map through the chat array to find the message with the given ID and mark it as seen
        const updatedChat = chat.map(message => {
            if (message.key === messageId && message.type === 'other' && !message.isSeen) {
                // If the message matches the ID and hasn't been seen yet, update its status to 'seen'
                return { ...message, isSeen: true };
            }
            return message;
        });

        // Update the chat state with the 'seen' message
        this.setState({ chat: updatedChat });

        // Construct an acknowledgment message for the backend
        const seenAcknowledgment = {
            type: 'message_seen',
            messageId,
            userEmail: sessionStorage.getItem('email'), // Replace with the actual user's email retrieval
        };

        // Send acknowledgment to the backend through WebSocket
        stompClient.send(`/app/chat/${sessionStorage.getItem('email')}/${this.props.emailSelected}/seen`, {}, JSON.stringify('message seen'));
    }

    componentDidUpdate(prevProps,prevState) {
        // Check if the selected user has changed
        if (this.props.selectedUser !== prevProps.selectedUser) {
            this.fetchInitialMessages(this.props.selectedUser);
            this.initWebSocket(this.props.selectedUser);
            const { chat } = this.state;
            const updatedChat = chat.map(message => {
                if (message.type === 'other' && !message.isSeen) {
                    return { ...message, isSeen: true };
                }
                return message;
            });

            this.setState({ chat: updatedChat });
        }
        this.scrollToBottom();
    }
    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    componentDidMount() {
        this.fetchInitialMessages(this.props.selectedUser);
        window.addEventListener("keydown", this.handleKeyPress);
        this.scrollToBottom();
        this.initWebSocket(this.props.selectedUser);

    }
    handleKeyPress = (e) => {
        if (e.keyCode === 13 && e.target.tagName.toLowerCase() === 'input') {
            e.preventDefault(); // Prevent sending message on pressing Enter key inside an input field
        }
    };
    fetchInitialMessages = (selectedUser) => {
        const authToken = sessionStorage.getItem('token'); // Get the auth token

        console.log(authToken);
        const currentUser = sessionStorage.getItem('email');
        // Perform a GET request to fetch initial messages
        // Replace 'YOUR_BACKEND_API_URL' with the actual endpoint URL
        const responseGet =  axios.get(`http://localhost:8083/message/${currentUser}/${this.props.emailSelected}`,
            {
                headers: {
                    Authorization: authToken,

                },
            }) .then((response) => {
            console.log(response.data);
            // Update the state with the initial messages from the backend
            const formattedMessages = response.data.map((receivedMessage, index) => {
                // Check if the message is sent by the current user or received by the current user
                const messageType = receivedMessage.sender === currentUser ? "" : "other";
                const colorType = receivedMessage.sender === currentUser ? "blue" : this.props.selectedUserColor;

                let messageContent = receivedMessage.message;

                // If the message is wrapped in quotes, remove them
                if (messageContent.charAt(0) === '"' && messageContent.charAt(messageContent.length - 1) === '"') {
                    messageContent = messageContent.slice(1, -1);
                }
                return {
                    key: index + 1,
                    color: colorType,
                    type: messageType,
                    msg: messageContent,
                    seen:receivedMessage.seen,
                };
            });

            this.setState({
                chat: formattedMessages,
            });
        })
            .catch((error) => {
                console.error("Error fetching initial messages:", error);
            });
    };

    // onStateChange = (e) => {
    //     this.setState({ msg: e.target.value });
    // };
    sendMessage = () => {
        const { stompClient, msg } = this.state;
        const { selectedUser } = this.props;

        if (stompClient && msg !== "") {
            const chatMessage = {
                key: this.state.chat.length + 1,
                type: "",
                msg: msg,
                color: "blue",
                seen:false,
            };
            // Send the message through WebSocket
            //stompClient.send(`/app/chat/${sessionStorage.getItem('email')}/${this.props.emailSelected}`, {}, msg);

            stompClient.send(`/app/chat/${sessionStorage.getItem('email')}/${this.props.emailSelected}`, {},JSON.stringify(msg));
            stompClient.send(`/app/chat/${sessionStorage.getItem('email')}/${this.props.emailSelected}/typing`, {}, JSON.stringify("not typing"));

            console.log("message sent: ", msg);
            // Update the chat with the sent message
            this.setState(prevState => ({
                chat: [...prevState.chat, chatMessage],
                msg: "",
            }), () => {
                this.scrollToBottom();
            });
        }
    };
    renderTypingIndicator = () => {
        const { isTyping } = this.state;

        if (isTyping) {
            return (
                <div className="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            );
        }

        return null;
    };
    render() {
        const { selectedUser, selectedUserColor } = this.props;
        return (
            <div className="main__chatcontent">
                <div className="content__header">
                    <div className="blocks">
                        <div className="current-chatting-user">
                            <Avatar color = {selectedUserColor} />
                            <p>{selectedUser}</p>
                        </div>
                    </div>

                    <div className="blocks">
                        <div className="settings">
                            <button className="btn-nobg">
                                <i className="fa fa-cog"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="content__body">
                    <div className="chat__items">
                        {this.state.chat.map((itm, index) => {
                            return (
                                <ChatItem
                                    animationDelay={index + 2}
                                    key={itm.key}
                                    user={itm.type ? itm.type : "me"}
                                    msg={itm.msg}
                                    color={itm.color}
                                    seen = {itm.seen}
                                />
                            );
                        })}
                        <div ref={this.messagesEndRef} />
                    </div>
                </div>
                <div className="content__footer">
                    {this.state.isTyping &&
                    <div className="typing-indicator-container">
                        {/*{this.renderTypingIndicator()}*/}
                        typing...
                    </div>
                    }
                    <div className="sendNewMessage">

                        <input
                            type="text"
                            placeholder="Type a message here"
                            onChange={this.onStateChange}
                            value={this.state.msg}
                        />
                        <button className="btnSendMsg" id="sendMsgBtn"  onClick={this.sendMessage}>
                            <i className="fa fa-paper-plane"></i>
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}