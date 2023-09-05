import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers } from "./usersSlice";
import { fetchAccounts } from "../accounts/accountsSlice";

const UsersPage = () => {
  const users = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers(0));
    dispatch(fetchAccounts(0));
  }, []);

  return (
    <div>
      {users.users.map((user) => (
        <div key={user.id}>
          <h3>Name: {user.name}</h3>
          <p>ID: {user.id}</p>
          <p>Date Created: {user.dateCreated}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersPage;
