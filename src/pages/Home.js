import React from "react";
import { useState } from "react";
import MessageModal from "../components/MessageModal";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user, allUsers, logOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [userInfo, setUserInfo] = useState({});
  //   useEffect(() => {
  //     getAllUsers();
  //   }, [getAllUsers]);

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
    </div>
  );
};

export default Home;
