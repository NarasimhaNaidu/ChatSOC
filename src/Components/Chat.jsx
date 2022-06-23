import React from "react";
// import "../Stylesheets/chat.css";

function Chat(props) {
  return (
    <div className="chat-container">
      {props?.chat?.map((msg, index) => {
        return (
          <div
            key={msg?.message + msg?.user_id + index}
            style={{
              justifyContent:
                msg?.user_id === localStorage.getItem("user_id") || msg?.user?._id?.$oid === localStorage.getItem("user_id")
                  ? "right"
                  : "left",
            }}
            className="chat-member"
          >
            <div>{msg?.user_name || msg?.user?.user || ""}</div>
            {":"}
            <div className="chat-message">{msg?.message || ""}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Chat;
