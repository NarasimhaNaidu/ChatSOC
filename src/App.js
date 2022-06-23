import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Routes, Route } from "react-router-dom";
// import Messages from "./Messages";
// import MessageInput from "./MessageInput";

import "./App.css";
import Home from "./Components/Home";
import Rooms from "./Components/Rooms";

function App() {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    // const newSocket = io(`http://${window.location.hostname}:5000`);
    const newSocket = io();
    newSocket.on("connect", () => {
      console.log("Connected socket..");
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket && localStorage.getItem("room_id")) {
      const reset = async () => {
        await socket.emit("create_room", {
          room_id: localStorage.getItem("room_id"),
          user_id: localStorage.getItem("user_id"),
        }, (e) => console.log(e));
      };
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <div className="App">
      {socket ? (
        <div className="">
          <Routes>
            <Route path="/" exact element={<Home socket={socket} />} />
            <Route
              path="/chat/:room_id"
              exact
              element={<Rooms socket={socket} />}
            />
          </Routes>

          {/* <Messages socket={socket} /> */}
          {/* <MessageInput socket={socket} /> */}
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
}

export default App;
