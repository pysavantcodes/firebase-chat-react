import React, { useEffect, useRef } from "react";
import { useState } from "react";
import MessageModal from "../components/MessageModal";
import { useAuth } from "../hooks/useAuth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const Home = () => {
  const { user, allUsers, logOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const start = useRef();
  const stop = useRef();

  const storage = getStorage();
  const [audio, setAudio] = useState({
    isRecording: false,
    blobURL: "",
    isBlocked: false,
  });

  const constraints = { audio: true };
  let chunks = [];
  let blobData = {};

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);

      // visualize(stream);

      start.current.addEventListener("click", () => {
        audio.blobURL = "";
        if (navigator.mediaDevices) {
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          console.log("recorder started");
        } else {
          console.log("Not supported");
        }
      });

      stop.current.addEventListener("click", () => {
        if (navigator.mediaDevices) {
          mediaRecorder.stop();
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
        blobData = blob;
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

  // const upload = () => {
  //   const storageRef = ref(storage, "audios/" + Date.now());
  //   const uploadTask = uploadBytesResumable(storageRef, blobData);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("Upload is " + progress + "% done");
  //       switch (snapshot.state) {
  //         case "paused":
  //           console.log("Upload is paused");
  //           break;
  //         case "running":
  //           console.log("Upload is running");
  //           break;
  //       }
  //     },
  //     (error) => {
  //       switch (error.code) {
  //         case "storage/unauthorized":
  //           break;
  //         case "storage/canceled":
  //           break;
  //         case "storage/unknown":
  //           break;
  //       }
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         console.log("File available at", downloadURL);
  //       });
  //     }
  //   );
  // };

  const filtered = allUsers
    .filter((person) => person.email !== user.email)
    .filter((user) => {
      return user.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="chatPage">
      {showModal && (
        <MessageModal
          showModal={() => setShowModal(false)}
          userInfo={userInfo}
        />
      )}
      <div className="head">
        <div className="left">
          <div className="img">
            <img src={user.photoURL} />
          </div>
          <h1>{user.displayName}</h1>
        </div>
        <button onClick={logOut}>Logout</button>
      </div>
      <div className="input">
        <i className="fa fa-search"></i>
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for people"
        />
      </div>
      <div className="user-display">
        {filtered.length > 0 ? (
          filtered.map((user) => {
            return (
              <div
                className="row"
                key={user.email}
                onClick={() => {
                  setShowModal(true);
                  setUserInfo(user);
                }}
              >
                <div className="img">
                  <img src={user.profilePhoto} />
                </div>
                <div className="text">
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: "white", opacity: 0.3 }}>
            No Chat available containing "{search}"
          </p>
        )}
      </div>
      {/* <button ref={start}>Record</button>
      <button ref={stop}>Stop</button>
      <audio src={audio.blobURL} controls="controls" />
      <button onClick={() => upload()}>Upload</button> */}
    </div>
  );
};

export default Home;
