import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { ChatContext } from "../context/auth/chat";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";

const MessageModal = ({ userInfo, showModal }) => {
  const [message, setMessage] = useState("");
  const { sendMessage, allChats } = useChat();
  const { user } = useAuth();
  const inputRef = useRef();
  //   const [chats, setChats] = useState([])

  const chats = allChats.filter((chat) => {
    return chat.userEmail === user.email;
  });

  console.log(chats);
  const tempChats = [];
  const myChats = [];
  function searchObj(obj, query) {
    for (var key in obj) {
      var value = obj[key];

      if (typeof value === "object") {
        searchObj(value, query);
      }

      if (value === query) {
        tempChats.push(obj);
      }
    }
  }
  searchObj(chats[0], userInfo.email);
  tempChats.forEach((c) => {
    if (!myChats.includes(c)) {
      myChats.push(c);
    }
  });

  const sortedAsc = myChats.sort((objA, objB) => objA.time - objB.time);
  console.log(sortedAsc);

  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="head msg-head">
          <span onClick={showModal}>&#8592;</span>
          <div className="img">
            <img src={userInfo.profilePhoto} />
          </div>
          <h1>{userInfo.name}</h1>
        </div>
        <div className="message-body">
          <ul>
            {sortedAsc.map((data) => {
              return (
                <li
                  className={data.to === userInfo.email ? "sent" : "received"}
                  key={data.time}
                >
                  <p>{data.message}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="send">
          <input type="text" ref={inputRef} placeholder="Enter a message" />
          <div>
            <p
              onClick={() => {
                sendMessage({
                  message: inputRef.current.value,
                  info: userInfo.email,
                });
                inputRef.current.value = "";
              }}
            >
              &#10148;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
