import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { ChatContext } from "../context/auth/chat";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "react-toastify";

const MessageModal = ({ userInfo, showModal }) => {
  const [message, setMessage] = useState("");
  const { sendMessage, allChats } = useChat();
  const [recordMessage, setRecordMessage] = useState(false);
  const [recording, setRecording] = useState(false);
  const [sendBtn, setSendBtn] = useState(false);
  const [blobData, setBlobData] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuth();
  const inputRef = useRef();
  const start = useRef();
  const stop = useRef();
  const audioRef = useRef();
  const scroll = useRef();
  //   const [chats, setChats] = useState([])
  //send audio

  useEffect(() => {
    const scrollToBottomWithSmoothScroll = () => {
      scroll.current.scrollTo({
        top: scroll.current.scrollHeight,
        behavior: "smooth",
      });
    };
    scrollToBottomWithSmoothScroll();
  }, []);

  const storage = getStorage();
  const [audio, setAudio] = useState({
    isRecording: false,
    blobURL: "",
    isBlocked: false,
  });

  const constraints = { audio: true };
  let chunks = [];

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);

      // visualize(stream);

      start.current.addEventListener("click", () => {
        audio.blobURL = "";
        if (navigator.mediaDevices) {
          mediaRecorder.start();
          setRecording(true);
          setSendBtn(false);
          console.log(mediaRecorder.state);
          console.log("recorder started");
        } else {
          console.log("Not supported");
        }
      });

      stop.current.addEventListener("click", () => {
        if (navigator.mediaDevices) {
          mediaRecorder.stop();
          setRecording(false);
          setSendBtn(true);
          console.log(mediaRecorder.state);
          console.log("recorder stopped");
        } else {
          console.log("Not supported");
        }
      });

      mediaRecorder.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioURL = URL.createObjectURL(blob);
        audio.blobURL = audioURL.split("blob:")[1];
        setBlobData(blob);
        console.log("recorder stopped");

        console.log(audioURL.split("blob:")[1]);
      };

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
        console.log(chunks);
      };
    })
    .catch((err) => {
      console.error(`The following error occurred: ${err}`);
    });

  //upload to firebase
  const upload = () => {
    const storageRef = ref(storage, "audios/" + Date.now());
    console.log(blobData);
    setSendBtn(false);
    const uploadTask = uploadBytesResumable(storageRef, blobData);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          sendMessage({
            message: downloadURL,
            info: userInfo.email,
          });
          setRecordMessage(false);
        });
      }
    );
  };

  const play = () => {
    setIsPlaying(true);
    audioRef.current.play();
    setIsPlaying(false);
  };
  const pause = () => {};

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
          <ul ref={scroll}>
            {sortedAsc.map((data) => {
              return (
                <>
                  {data.message.includes(
                    "https://firebasestorage.googleapis.com/v0/b/react-chat-app-6bce5.appspot.com/o/audios"
                  ) ? (
                    <>
                      <div
                        className={
                          data.to === userInfo.email
                            ? "sent audio-chat"
                            : "received audio-chat"
                        }
                      >
                        <audio
                          className={
                            data.to === userInfo.email
                              ? "sent-audio"
                              : "received-audio"
                          }
                          src={data.message}
                          controls
                          ref={audioRef}
                        />
                        {/* <p>{data.message}</p> */}
                        {/* {isPlaying ? (
                          <i
                            class="fa fa-pause"
                            onClick={() => pause()}
                            aria-hidden="true"
                          ></i>
                        ) : (
                          <i
                            class="fa fa-play"
                            onClick={() => play()}
                            aria-hidden="true"
                          ></i>
                        )} */}
                      </div>
                    </>
                  ) : (
                    <li
                      className={
                        data.to === userInfo.email ? "sent" : "received"
                      }
                      key={data.time}
                    >
                      <p>{data.message}</p>
                    </li>
                  )}
                </>
              );
            })}
          </ul>
        </div>

        {recordMessage && (
          <div className="audio">
            <div className="top">
              <p>Record Message</p>
              <i
                className="fa fa-close"
                onClick={() => setRecordMessage(false)}
              ></i>
            </div>
            <div className="row-audio">
              <div className="btns">
                <span ref={start} className={recording && "disabled"}>
                  <i className="fa fa-microphone" aria-hidden="true"></i>
                </span>
                <span ref={stop} className={!recording && "disabled"}>
                  <i className="fa fa-microphone" aria-hidden="true"></i>
                </span>
              </div>
              <div className="anim">
                {/* <img
                src="https://thumbs.gfycat.com/AstonishingRightKingsnake-max-1mb.gif"
                alt=""
              /> */}
                <img
                  src={
                    recording
                      ? "https://thumbs.gfycat.com/AstonishingRightKingsnake-max-1mb.gif"
                      : "https://ak.picdn.net/shutterstock/videos/1061097142/thumb/1.jpg?ip=x480"
                  }
                  alt=""
                />
              </div>

              <div className={sendBtn ? "upload" : "upload disabled"}>
                <p onClick={() => upload()}>Send Audio</p>
              </div>
            </div>
          </div>
        )}
        <div className="send">
          <i
            style={{
              fontSize: "20px",
              color: "#298bff",
              cursor: "pointer",
              padding: "0 2px",
            }}
            className="fa fa-microphone"
            aria-hidden="true"
            onClick={() => setRecordMessage(!recordMessage)}
          ></i>
          <input type="text" ref={inputRef} placeholder="Enter a message" />
          <div>
            <p
              onClick={() => {
                inputRef.current.value === ""
                  ? toast.warning("Please enter field.")
                  : sendMessage({
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
