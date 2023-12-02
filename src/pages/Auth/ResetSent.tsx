import React from "react";

const ResetSent = () => {
  return (
    <div className="flex h-[100vh] items-center">
      <div className="mx-10">
        <h1 className="mb-2 text-4xl font-extrabold text-blue-secondary">
          Success!
        </h1>
        <p className="mb-10 text-sm text-gray-text-2">
          Instructions on how to reset your password has been sent to your
          email.
        </p>
      </div>
    </div>
  );
};

export default ResetSent;
