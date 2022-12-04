import React from "react";
import Blob from "../components/Blob";
import { useAuth } from "../hooks/useAuth";

const LoggedOut = () => {
  const { login } = useAuth();
  const handleClick = () => {
    login();
  };
  return (
    <div className="App">
      <p className="toptxt">Mini Social App 🌎</p>
      <button onClick={() => handleClick()} className="sign-in">
        Sign In with Google
      </button>
      <Blob idName="blobSvg" />
      {/* <Blob idName="blobSvgTop" /> */}
      <p className="bottomtxt">Pysavant Codes</p>
    </div>
  );
};

export default LoggedOut;
