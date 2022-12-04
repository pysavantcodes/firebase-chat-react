import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { setDoc, doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

const ChatContext = React.createContext();
const ChatProvider = (props) => {
  const { user } = useAuth();
  const [allChats, setAllChats] = useState([]);

  const docRef = collection(db, "chats");

  useEffect(() => {
    onSnapshot(docRef, (snapshot) => {
      var tempList = [];
      snapshot.docs.forEach((doc) => {
        tempList.push(doc.data());
      });
      //   console.log(tempList);

      setAllChats(tempList);
    });
  }, [db]);

  const sendMessage = async (data) => {
    const docRef = doc(db, "chats", user.email);
    const docReceive = doc(db, "chats", data.info);
    const { info, message } = data;

    try {
      //   const docSnap = await getDoc(docRef);
      //   if (docSnap.exists()) {
      //     console.log(docSnap.data().sent);
      //     setSenderMessages(docSnap.data().sent);
      //   } else {
      //     console.log("It doesnt exist");
      //   }

      setDoc(
        docRef,
        {
          sent: {
            [Date.now()]: { message: message, time: Date.now(), to: info },
          },
          userEmail: user.email,
        },
        { merge: true }
      )
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });

      setDoc(
        docReceive,
        {
          received: {
            [Date.now()]: {
              message: message,
              time: Date.now(),
              from: user.email,
            },
          },
          userEmail: info,
        },
        { merge: true }
      )
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const value = { sendMessage, allChats };

  return <ChatContext.Provider value={value} {...props} />;
};

export { ChatContext, ChatProvider };
