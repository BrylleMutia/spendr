import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { firebaseAuth } from "../../api/fireStore";
import { useAppDispatch } from "../../app/hooks";

const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const dispatch = useAppDispatch();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleReset = () => {
    sendPasswordResetEmail(firebaseAuth, email)
      .then(() => {
        console.log("success");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("An error has occured: ", errorCode, errorMessage);
      });
  };

  return (
    <div>
      <h1>Forgot your password?</h1>
      <form method="POST">
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <label htmlFor="email">Email</label>
        <button type="submit" onClick={handleReset}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
