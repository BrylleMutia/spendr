import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import "./App.css";
import HomepageContainer from "./pages/Homepage/HomepageContainer";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import PasswordReset from "./pages/Auth/PasswordReset";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./api/fireStore";
import { useAppDispatch } from "./app/hooks";
import { saveUser } from "./features/users/usersSlice";
import { User } from "./features/users/userTypes";

function App() {
  const dispatch = useAppDispatch();

  // save the user token from firebase to our global state and update it every time something happens to the user
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        const updatedUserInfo: User = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          dateCreated: user.metadata.creationTime,
          photoURL: user.photoURL,
          accessToken: user.refreshToken,
        };

        dispatch(saveUser(updatedUserInfo));
      }
    });
  }, [firebaseAuth, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomepageContainer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<PasswordReset />} />
      </Route>
    </Routes>
  );
}

export default App;
