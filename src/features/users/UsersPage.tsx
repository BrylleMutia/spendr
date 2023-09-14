import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers } from "./usersSlice";
import { fetchAccounts } from "../accounts/accountsSlice";
import { addEntry } from "../entries/entriesSlice";

const UsersPage = () => {
  const users = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  
  // dispatch(
  //   addEntry({
  //     categoryId: "213jjj",
  //     accountId: "1234jj",
  //     amount: 7709,
  //   }),
  // );

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
