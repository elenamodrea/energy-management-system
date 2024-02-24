import React, {Component, useEffect, useState} from "react";
import "./chatList.css";
import ChatListItems from "./chatListItems";
import AddIcon from '@mui/icons-material/Add';
import GroupList from "./GroupList";
import axios from "axios";
import ChatContent from "./chatContent";
export default class ChatList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allChats: [],
            isUserSelectionOpen: false,
            selectedUser: null,
            selectedUserColor: null,
            selectedEmail:null,

        };
        this.generateRandomColor = this.generateRandomColor.bind(this); // Binding the method
    }
    handleUserClick = (userName, color,email) => {
        // Function to handle the user click event and set the clicked user's name and color
        this.setState({ selectedUser: userName, selectedUserColor: color , selectedEmail:email});
    };
    generateRandomColor() {
        // Function to generate a random color
        const hue = Math.floor(Math.random() * 360); // Select a random hue
        const saturation = '50%'; // You can adjust saturation as needed
        const lightness = '60%'; // You can adjust lightness as needed
        return `hsl(${hue}, ${saturation}, ${lightness})`;
    }
    async componentDidMount() {
        const isClient = sessionStorage.getItem('role') === 'CLIENT';
            try {
                const response = await axios.get(`http://localhost:8080/person`,
                    {
                        headers: {
                            Authorization: sessionStorage.getItem('token'),

                        },
                    }); // Replace 'your_backend_api_endpoint' with the actual API endpoint
                const allUsers = response.data;
                let users;// Assuming the response contains all users from the backend
                if (isClient) {
                    // Filter out only the admins from the fetched users
                    users= allUsers.filter(user => user.role === 'ADMIN');
                }
                else{
                    users = allUsers.filter(user => user.role === 'CLIENT');
                }
                // Transform adminUsers to the format compatible with ChatListItems
                const formattedAdminUsers = users.map((user, index) => ({
                    id: user.email, // Use a unique identifier for each user
                    name: user.name,
                    active: false, // Set the active status as required
                    isOnline: false, // Set the online status as required
                    color: this.generateRandomColor(), // Generate color for each admin user
                }));

                this.setState({ allChats: formattedAdminUsers });
            } catch (error) {
                console.error('Error fetching users:', error);
                // Handle error
            }

    }


    handleOpenUserSelection = () => {
        this.setState(prevState => ({ isUserSelectionOpen: !prevState.isUserSelectionOpen }));
    }


        render() {
            const isClient = sessionStorage.getItem('role') === 'CLIENT'; // Check if the user is a client
            const mainChatBodyStyle = {
                flexGrow: 1,
                backgroundColor: '#f4f3f8',
                borderRadius: '10px',
                padding: '15px 20px',
                display: 'flex',
            };
            return (
                <div style={mainChatBodyStyle} >
            <div className="main__chatlist">

                <div className="chatlist__heading">
                    <h2>Chats</h2>
                    {/*{!isClient && ( // Check if the user is not a client*/}
                    {/*    <button className="btn" onClick={this.handleOpenUserSelection}>*/}
                    {/*        <i className="fa fa-plus"></i>*/}
                    {/*        <AddIcon />*/}
                    {/*    </button>*/}
                    {/*)}*/}
                </div>

                    {false && <GroupList />}


                <div className="chatlist__items">
                    {this.state.allChats.map((item, index) => {
                        return (
                            <ChatListItems
                                name={item.name}
                                email={item.id}
                                key={item.id}
                                animationDelay={index + 1}
                                color={item.color}
                                onUserClick={this.handleUserClick}
                            />
                        );
                    })}
                </div>
            </div>
                    {this.state.selectedUser && <ChatContent selectedUser={this.state.selectedUser}  selectedUserColor={this.state.selectedUserColor} emailSelected = {this.state.selectedEmail} // Pass selected user's color
                    />}
                </div>
        );
    }
}