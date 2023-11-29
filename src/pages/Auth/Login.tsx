import React, { useState } from "react";
import { firebaseAuth } from "../../api/fireStore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { BiHide } from "react-icons/bi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleStaySignedIn = () => setStaySignedIn((prev) => !prev);

  const handleUserLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log("Singed in user: ", user);

        if (user.refreshToken) navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("An error occured: ", errorCode, errorMessage);
      })
      .finally(() => {
        setEmail("");
        setPassword("");
      });
  };

  // TODO: Design auth pages
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

        <h3 className="mb-5 text-sm">Sign in to your account</h3>
        <form method="POST" className="mb-10 flex flex-col gap-3">
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

          <div className="flex relative">
            <input
              type="password"
              id="password"
              className="rounded-md border-2 w-full border-gray-text-1 px-3 py-2 text-sm outline-none focus:border-blue-accent"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            />
            <BiHide style={{ position: "absolute", right: "4%", top: "30%", color: "#606060" }} />
            <label htmlFor="password" hidden>
              Password
            </label>
          </div>

          <div className="mb-6 flex justify-between">
            <div>
              <input
                type="checkbox"
                name="stay-signed-in"
                id="stay-signed-in"
                checked={staySignedIn}
                onChange={handleStaySignedIn}
              />
              <label
                htmlFor="stay-signed-in"
                className="ml-2 text-xs text-gray-text-2"
              >
                Stay signed in
              </label>
            </div>
            <Link
              to="/reset"
              className="pt-1 text-xs text-blue-secondary hover:text-blue-accent"
            >
              Forgot Password
            </Link>
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-secondary py-2 font-medium text-white transition-all duration-200 hover:bg-blue-accent"
            onClick={handleUserLogin}
          >
            Sign In
          </button>
        </form>

        <div className="relative mb-10">
          <hr className="bg-gray-text-2" />
          <h3 className="absolute -top-4 left-[45%] bg-white p-1 text-gray-text-2">
            OR
          </h3>
        </div>

        <div className="mb-7 flex flex-col gap-4">
          <button
            type="submit"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-gray-text-2 bg-white py-2 text-sm text-gray-text-2 transition-all duration-200 hover:border-blue-accent hover:bg-blue-accent hover:text-white"
            onClick={handleUserLogin}
          >
            <FcGoogle style={{ fontSize: "1.5em" }} />
            <span>Continue with Google</span>
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-gray-text-2 bg-white py-2 text-sm text-gray-text-2 transition-all duration-200 hover:border-blue-accent hover:bg-blue-accent hover:text-white"
            onClick={handleUserLogin}
          >
            <FaFacebook style={{ fontSize: "1.5em", color: "#4267B2" }} />
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="flex justify-between">
          <p className="text-xs text-gray-text-2">Don't have an account yet?</p>
          <Link
            to="/register"
            className="text-xs text-blue-secondary hover:text-blue-accent"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
