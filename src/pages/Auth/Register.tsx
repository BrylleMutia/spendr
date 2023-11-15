import React, { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { registerUser } from "../../features/users/usersSlice";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRegisterUser = () => dispatch(registerUser({ email, password }));

  return (
    <div>
      <h1>Register</h1>
      <form action="POST" method="_">
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
          value={email}
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
