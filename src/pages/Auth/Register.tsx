import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { firebaseAuth } from "../../api/fireStore";
import { useNavigate } from "react-router-dom";
import { User } from "../../features/users/userTypes";
import { userSignUp } from "../../features/users/usersSlice";

const Register = () => {
  const [displayName, setDIsplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDIsplayName(e.target.value);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRegisterUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log("Registered user: ", user);

        if (user) {
          // update auth display name and photo url
          updateProfile(user, { displayName: displayName, photoURL: null })

          const updatedUserInfo: User = {
            id: user.uid,
            name: displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            dateCreated: user.metadata.creationTime,
            photoURL: user.photoURL,
            accessToken: user.refreshToken,
          };

          // save user info to firestore db
          dispatch(userSignUp(updatedUserInfo));
        }

        if (user.refreshToken) navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error ocured: ", errorCode, errorMessage);
      })
      .finally(() => {
        setEmail("");
        setPassword("");
      });
  };

  // TODO: Implement password strength indicator
  return (
    <div>
      <h1>Register</h1>
      <form method="POST">
        <input
          type="text"
          id="name"
          value={displayName}
          onChange={handleNameChange}
          placeholder="Name"
        />
        <label htmlFor="name">Name</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <label htmlFor="email">Email</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <label htmlFor="password">Password</label>
        <button type="submit" onClick={handleRegisterUser}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
