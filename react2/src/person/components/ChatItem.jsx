import React, { Component } from "react";
import Avatar from "./avatar";



export default class ChatItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div
                style={{ animationDelay: `0.8s` }}
                className={`chat__item ${this.props.user ? this.props.user : ""}`}
            >
                <div className="chat__item__content">
                    <div className="chat__msg">{this.props.msg}</div>
                    {this.props.user !== 'other'&&this.props.seen &&
                        <div className="chat__meta">
                         <span>Seen </span>
                    </div> }
                </div>
                <Avatar color = {this.props.color} />
            </div>
        );
    }
}