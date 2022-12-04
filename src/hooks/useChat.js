import React, { useContext } from "react";
import { ChatContext } from "../context/auth/chat";


function useChat() {
    const value = useContext(ChatContext);

    if (!value) {
        throw new Error("ChatContext's value is undefined.");
    }

    return value;
}

export { useChat };