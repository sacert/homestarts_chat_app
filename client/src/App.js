import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Divider from "@material-ui/core/Divider";
import "./App.css";

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [logged_in, setLoggedIn] = useState(false);
  const [channels, setChannels] = useState("");
  const [channel, setChannel] = useState("general");

  useEffect(() => {
    getMessages();
    listenMessages();
  }, [messages.length]);

  useEffect(() => {
    fetch(`${endPoint}/channels`, {})
      .then((response) => response.json())
      .then((data) => setChannels(data.channels.split(",")));
  }, [channels.length]);

  const getMessages = () => {
    fetch(`${endPoint}/messages?channel=${channel}`, {})
      .then((response) => response.json())
      .then((data) => setMessages(Object.values(data)));
  };

  const listenMessages = () => {
    socket.on("message", (msg) => {
      setMessages([...messages, msg]);
    });
  };

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const onClickSendMessage = () => {
    if (username === "") {
      alert("Please set a username");
    } else if (message !== "") {
      socket.emit("message", {
        username: username,
        message: message,
        channel: channel,
      });
      setMessage("");
    } else {
      alert("Please add a message");
    }
  };

  const onClickLogin = () => {
    if (username !== "") {
      setLoggedIn(!logged_in);
    } else {
      alert("Please enter a username");
    }
  };

  const onClickChannel = (e) => {
    setChannel(e.target.innerHTML.substring(1));
    setMessages([]);
    getMessages();
  };

  return (
    <div id="chat-app">
      <h2>Homestars Chat Api</h2>
      <div id="username">
        <p id="username-title">Username: </p>
        {logged_in ? (
          <p id="username-logged-in">{username}</p>
        ) : (
          <Input
            value={username}
            name="login"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <Button
          variant="outlined"
          id="username-login"
          onClick={() => onClickLogin()}
        >
          {logged_in ? "Logout" : "Login"}
        </Button>
      </div>
      <Divider style={{ width: "40%", margin: "10px" }} />
      <div id="channels">
        <h4>Channels</h4>
        {channels.length > 0 &&
          channels.map((channel) => (
            <Button
              fullWidth={true}
              style={{ textAlign: "left", textTransform: "none" }}
              className="channel-btn"
              onClick={(e) => onClickChannel(e)}
            >
              #{channel}
            </Button>
          ))}
      </div>
      <Divider
        orientation="vertical"
        style={{ height: "80%", float: "left", margin: "5px 20px 0px 0px" }}
      />
      {messages.length > 0 &&
        messages.map((msg) => (
          <div className="chat-bubble">
            <p className="chat-bubble-msg-username">{msg.split(":")[0]}:</p>
            <p>{msg.split(":")[1]}</p>
          </div>
        ))}
      <Input
        variant="outlined"
        value={message}
        name="message"
        onChange={(e) => onChangeMessage(e)}
      />
      <Button
        id="send-message-btn"
        variant="contained"
        onClick={() => onClickSendMessage()}
      >
        Send Message
      </Button>
    </div>
  );
};

export default App;
