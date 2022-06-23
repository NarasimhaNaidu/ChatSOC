import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Chat from "./Chat";
import ChatUI from "./ChatUI";
import axios from "axios";

function Rooms(props) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState({ messages: [] });
  const [inc, setIncc] = useState(0);

  const appendChat = (e) => {
    let temp = chat?.messages || [];
    temp.push(e);
    setChat({ messages: temp });
    setIncc(inc + 1);
  };

  const { room_id } = useParams();
  const changeHandler = (e) => setMessage(e.target.value);
  const sendMessage = (e) => {
    e.preventDefault();
    setMessage("");
    props?.socket?.emit("message", {
      room_id: room_id,
      message: message,
      user_id: localStorage.getItem("user_id"),
      user_name: localStorage.getItem("user_name"),
    });
  };

  useEffect(() => {
    props?.socket?.on("new_message", appendChat);
    return () => props?.socket.off("new_message", appendChat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.socket]);

  const getRecentData = async (e) => {
    let recentData = await axios.get(`/getallrecentmessages?room=${room_id}`);
    if (recentData?.data) {
      recentData?.data?.messages?.map((e) => appendChat(e));
    }
  };

  useEffect(() => {
    getRecentData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Welcome {localStorage.getItem("user_name")}</h1>
      {chat?.messages?.length ? (
        <div>
          {/* <Chat chat={chat?.messages || []} /> */}
          <br/>
          <ChatUI chat={chat?.messages || []} />
        </div>
      ) : (
        ""
      )}
      <form onSubmit={sendMessage}>
        <TextField
          label="Please enter a message.."
          value={message}
          color={message ? "success" : "warning"}
          variant="standard"
          onChange={changeHandler}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  type="submit"
                  disabled={!message}
                  color="success"
                  onClick={sendMessage}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </div>
  );
}

export default Rooms;
