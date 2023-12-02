import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { firebaseAuth } from "../../api/fireStore";
import { useNavigate, Link } from "react-router-dom";
import { User } from "../../features/users/userTypes";
import { saveUser, userSignUp } from "../../features/users/usersSlice";
import { BiHide, BiShow } from "react-icons/bi";

const Register = () => {
  const [displayName, setDIsplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);

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
  // TODO: Error messages
  return (
    <div className="flex h-[100vh] items-center">
      <div className="mx-10">
        <h1 className="mb-2 text-4xl font-extrabold text-blue-secondary">
          Spendr
        </h1>
        <p className="mb-10 text-sm text-gray-text-2">
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
            className="rounded-md border-2 border-gray-text-1 px-3 py-2 text-sm outline-none focus:border-blue-accent"
            placeholder="Name"
          />
          <label htmlFor="name" hidden>
            Name
          </label>

          <input
            type="email"
            id="email"
            className="rounded-md border-2 border-gray-text-1 px-3 py-2 text-sm outline-none focus:border-blue-accent"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
          <label htmlFor="email" hidden>
            Email
          </label>

          <div className="relative mb-10 flex">
            <input
              type={isPasswordShown ? "text" : "password"}
              id="password"
              className="w-full rounded-md border-2 border-gray-text-1 px-3 py-2 text-sm outline-none focus:border-blue-accent"
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

          <button
            type="submit"
            className="rounded-md bg-blue-secondary py-2 font-medium text-white transition-all duration-200 hover:bg-blue-accent"
            onClick={handleRegisterUser}
          >
            Register
          </button>
        </form>

        <div className="flex justify-between px-5">
          <p className="text-xs text-gray-text-2">Already have an account?</p>
          <Link
            to="/auth"
            className="text-xs text-blue-secondary hover:text-blue-accent"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
