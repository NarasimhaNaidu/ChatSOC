import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const [data, setData] = useState({});
    const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (data?.user && data?.room) {
      let resp = await axios.post("/user-login", data);
      if (resp?.data?._id) {
        await props.socket.emit(
          "create_room",
          {
            room_id: data?.room,
            user_id: resp?.data?._id?.$oid,
          },
          (room) => {
          console.log(resp?.data?._id?.$oid?.$oid);
            localStorage.setItem("user_id", resp?.data?._id?.$oid?.$oid);
            localStorage.setItem("user_name", resp?.data?.user);
            localStorage.setItem("room_id", room?.room_id);
            console.log(room);
            navigate(`/chat/${room?.room_id}`);
          }
        );

      } else {
        alert("Please try some time later.");
      }
    }
  };
  return (
    <div>
      <h2>User details</h2>
      <form onSubmit={submitHandler}>
        <div>
          <TextField
            id="standard-basic"
            label="User Name"
            onChange={(e) => setData({ ...data, user: e.target.value })}
            variant="outlined"
            size="small"
            color={data?.user ? "success" : "warning"}
          />
          <TextField
            id="standard-basic"
            label="Room Id"
            type="number"
            onChange={(e) => setData({ ...data, room: e.target.value })}
            variant="outlined"
            size="small"
            color={data?.room ? "success" : "warning"}
          />
          <br />
          <br />
          <Button
            color={data?.user && data?.room ? "success" : "error"}
            type="submit"
            disabled={!data?.user || !data?.room}
            variant="outlined"
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Home;
