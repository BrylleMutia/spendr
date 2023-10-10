import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllUsers } from "../features/users/usersSlice";
import { getAllAccounts } from "../features/accounts/accountsSlice";
import {
  getAllCategories,
  addNewCategory,
} from "../features/categories/categoriesSlice";
import { addEntry } from "../features/entries/entriesSlice";

const UsersPage = () => {
  const users = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const triggerAction = () => {
    dispatch(addNewCategory({ name: "Groceries111", userId: "123144" }));
  };

  useEffect(() => {
    dispatch(getAllUsers(0));
    dispatch(getAllAccounts(0));
    dispatch(getAllCategories(0));
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

      <button onClick={triggerAction} style={{ background: "skyblue" }}>
        Trigger action
      </button>
    </div>
  );
};

export default UsersPage;
