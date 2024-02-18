import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { firebaseAuth } from "../../api/fireStore";
import { useNavigate, Link } from "react-router-dom";
import { User } from "../../features/users/userTypes";
import { saveUser, userSignUp } from "../../features/users/usersSlice";
import { BiHide, BiShow } from "react-icons/bi";
import AuthContainer from "../../components/AuthContainer";

const Register = () => {
  const [displayName, setDIsplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [error, setError] = useState(false);

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

  const handleShowPassword = () => setIsPasswordShown((prev) => !prev);

  const handleRegisterUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log("Registered user: ", user);

        if (user) {
          // update auth display name and photo url
          updateProfile(user, { displayName: displayName, photoURL: null });

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
          dispatch(saveUser(updatedUserInfo));
        }

        if (user.refreshToken) navigate("/home");
      })
      .catch((error) => {
        setError(error.message);

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error ocured: ", errorCode, errorMessage);
      })
      .finally(() => {
        setEmail("");
        setPassword("");
      });
  };

  // TODO: Low Prio - Implement password strength indicator
  return (
    <AuthContainer>
      <div>
        <h1 className="mb-2 text-4xl font-extrabold text-blue-secondary">
          Spendr
        </h1>
        <p className="mb-[7em] text-sm text-gray-text-2">
          Smart Spending, Smart Saving: Achieve Financial Freedom Effortlessly
          with Spendr.
        </p>

        <h3 className="mb-5 text-sm">Create an account</h3>
        <form method="POST" className="mb-5 flex flex-col gap-3">
          <input
            type="text"
            id="name"
            value={displayName}
            onChange={handleNameChange}
            className={`input-text-primary ${error && "border-red-400"}`}
            placeholder="Name"
          />
          <label htmlFor="name" hidden>
            Name
          </label>

          <input
            type="email"
            id="email"
            className={`input-text-primary ${error && "border-red-400"}`}
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
          <label htmlFor="email" hidden>
            Email
          </label>

          <div className="relative flex">
            <input
              type={isPasswordShown ? "text" : "password"}
              id="password"
              className={`input-password-primary ${error && "border-red-400"}`}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            />
            <span onClick={handleShowPassword}>
              {isPasswordShown ? (
                <BiHide
                  style={{
                    position: "absolute",
                    right: "4%",
                    top: "30%",
                    color: "#606060",
                  }}
                />
              ) : (
                <BiShow
                  style={{
                    position: "absolute",
                    right: "4%",
                    top: "30%",
                    color: "#606060",
                  }}
                />
              )}
            </span>
            <label htmlFor="password" hidden>
              Password
            </label>
          </div>

          {error && (
            <p className="text-xs text-red-500">Invalid name or email</p>
          )}

          <button
            type="submit"
            className="btn-primary mt-10"
            onClick={handleRegisterUser}
          >
            Register
          </button>
        </form>

        <div className="flex justify-between px-5">
          <p className="text-xs text-gray-text-2">Already have an account?</p>
          <Link to="/auth" className="btn-link-primary">
            Sign in
          </Link>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Register;
