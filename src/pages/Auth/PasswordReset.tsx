import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { firebaseAuth } from "../../api/fireStore";
import { useNavigate } from "react-router-dom";
import AuthContainer from "../../components/AuthContainer";

const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    sendPasswordResetEmail(firebaseAuth, email)
      .then(() => {
        console.log("success");
        navigate("/reset-sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("An error has occured: ", errorCode, errorMessage);
      });
  };

  return (
    <AuthContainer>
      <div>
        <h1 className="mb-2 text-4xl font-extrabold text-blue-secondary">
          Spendr
        </h1>
        <p className="mb-10 text-sm text-gray-text-2">
          Smart Spending, Smart Saving: Achieve Financial Freedom Effortlessly
          with Spendr.
        </p>

        <h3 className="mb-5 text-sm">Forgot password</h3>
        <form method="POST" className="mb-5 flex flex-col gap-3">
          <input
            type="email"
            id="email"
            className="input-text-primary"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
          <label htmlFor="email" hidden>
            Email
          </label>

          <button
            type="submit"
            className="btn-primary mt-5"
            onClick={handleReset}
          >
            Reset Password
          </button>
        </form>
      </div>
    </AuthContainer>
  );
};

export default PasswordReset;
