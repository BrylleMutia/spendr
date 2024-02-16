import React from "react";
import AuthImg from "../assets/credit.svg";
import AnimatedBoxBg from "./AnimatedBoxBg/AnimatedBoxBg";

type AuthContainerProps = {
  children: React.ReactNode;
};

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <AnimatedBoxBg>
      <div className="flex h-[100vh] items-center justify-center py-10">
        <div className="flex h-full grow justify-center">
          <img className="w-[50%]" src={AuthImg} alt="auth-image" />
        </div>

        <div className="mr-[5em] flex h-full max-w-[400px] items-center rounded-md bg-white px-7 shadow-lg z-50">
          {children}
        </div>
      </div>
    </AnimatedBoxBg>
  );
};

export default AuthContainer;
