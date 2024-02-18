import React from "react";
import AnimatedBoxBg from "./AnimatedBoxBg/AnimatedBoxBg";

type AuthContainerProps = {
  children: React.ReactNode;
};

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <AnimatedBoxBg>
      <div className="flex h-[100vh] items-center justify-center py-10">
        <div className="z-50 flex h-full max-w-[400px] items-center rounded-md bg-white px-7 shadow-lg">
          {children}
        </div>
      </div>
    </AnimatedBoxBg>
  );
};

export default AuthContainer;
