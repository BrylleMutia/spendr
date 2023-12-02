import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import ResetSent from "./pages/Auth/ResetSent";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // save the user token from firebase to our global state and update it every time something happens to the user
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      // console.log(user)

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
      } else navigate("/auth");
    });
  }, [firebaseAuth, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Private routes for auth check, check for access token on Layout */}
        <Route index element={<HomepageContainer />} />
      </Route>

      <Route path="/auth" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<PasswordReset />} />
      <Route path="/reset-sent" element={<ResetSent />} />
    </Routes>
  );
}

export default App;
