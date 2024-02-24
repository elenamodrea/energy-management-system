import React, { Component } from "react";
import Avatar from "./avatar";

export default class ChatListItems extends Component {
    constructor(props) {
        super(props);
    }
    selectChat = (e) => {
        for (
            let index = 0;
            index < e.currentTarget.parentNode.children.length;
            index++
        ) {
            e.currentTarget.parentNode.children[index].classList.remove("active");
        }
        e.currentTarget.classList.add("active");
    };
    handleUserClick = () => {
        // Call the function provided by ChatList component when a user is clicked
        this.props.onUserClick(this.props.name,this.props.color,this.props.email);
    };
    render() {
        return (
            <div
                style={{ animationDelay: `0.${this.props.animationDelay}s` }}
                onClick={this.handleUserClick}
                className={`chatlist__item`}
            >
                <Avatar
                    color={this.props.color ? this.props.color : "#4684F1"} // Use the provided color or a default blueish color

                />

                <div className="userMeta">
                    <p>{this.props.name}</p>
                    </div>
            </div>
        );
    }
}