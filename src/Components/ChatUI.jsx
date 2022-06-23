import React from "react";

import "./chatui.css";

export function ChatUI(props) {
  return (
    <div>
      <section className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> Arawinz
          </div>
          <div className="msger-header-options">
            <span>
              <i className="fas fa-cog"></i>
            </span>
          </div>
        </header>

        <main className="msger-chat">
          {props?.chat?.map((msg, index) => {
            return (
              <>
                {/* <div className="msg left-msg"> */}
                <div
                  className={`msg ${
                    msg?.user_id === localStorage.getItem("user_id") ||
                    msg?.user?._id?.$oid === localStorage.getItem("user_id")
                      ? "right-msg"
                      : "left-msg"
                  }`}
                >
                  <div className="msg-img"></div>
                  <div className="msg-bubble">
                    <div className="msg-info">
                      <div className="msg-info-name">
                        <div>{msg?.user_name || msg?.user?.user || ""}</div>
                      </div>
                      <div className="msg-info-time">time_stamp</div>
                    </div>

                    <div className="msg-text">
                      <div className="chat-message">{msg?.message || ""}</div>
                    </div>
                  </div>
                </div>

                {/* <div className="msg right-msg">
                  <div className="msg-img"></div>
                  <div className="msg-bubble">
                    <div className="msg-info">
                      <div className="msg-info-name">hero</div>
                      <div className="msg-info-time">time_stamps</div>
                    </div>
                    <div className="chat-message">{msg?.message || ""}</div>

                    <div className="msg-text">cheppu</div>
                  </div>
                </div> */}
              </>
            );
          })}
        </main>
      </section>
    </div>
  );
}
export default ChatUI;
