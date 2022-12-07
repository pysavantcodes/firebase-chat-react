import React, { useContext, useEffect } from "react";
import { signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase"
import { setDoc, doc, getDoc, getDocs, collection, onSnapshot } from "firebase/firestore"
import { db } from "../../config/firebase";


const AuthContext = React.createContext();
const AuthProvider = (props) => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const colRef = collection(db, "users");
    useEffect(() => {

        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }

        onSnapshot(colRef, (snapshot) => {
            var tempList = []
            snapshot.docs.forEach(doc => {
                tempList.push(doc.data());


            })

            setAllUsers(tempList)
        })

        //   return () => {
        //     second
        //   }
    }, [db])

    const addUser = async(user) => {
        try {

            await setDoc(doc(db, "users", user.email), {
                name: user.name,
                profilePhoto: user.profilePhoto,

                email: user.email
            });


        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const checkUserAvailability = async(id) => {
        const docRef = await doc(db, "users", id);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return true
            } else {
                return false
            }

        } catch (error) {
            console.log(error)
        }


    }
    const login = async() => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider).then((result) => {
                const user = result.user;
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user))
                toast.success("User login successful");

                checkUserAvailability(user.email).then((result) => {
                    if (result === false) {
                        addUser({ name: user.displayName, profilePhoto: user.photoURL, email: user.email })
                    }
                    return null
                })

                toast.success("User login successful");
            }).catch((error) => {

                toast.error(error.message);
            })
        } catch (error) {
            console.log(error);
        }
    };

    const logOut = async() => {
        try {
            signOut(auth).then(() => {
                setUser(null)
                toast.success("Logged out Successfully")

            })
        } catch (error) {
            console.log(error);
        }
    }


    const value = { user, login, allUsers, logOut };

    return <AuthContext.Provider value = { value } {...props }
    />;
};

export { AuthContext, AuthProvider };