import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserById } from "../features/users/usersSlice";
import { getAllAccountsByUserId } from "../features/accounts/accountsSlice";
import { getAllCategoriesByUserId } from "../features/categories/categoriesSlice";
import {
  addEntry,
  getAllEntriesByAccountIds,
} from "../features/entries/entriesSlice";

const UsersPage = () => {
  const { user } = useAppSelector((state) => state.users);
  const { accounts } = useAppSelector((state) => state.accounts);
  const dispatch = useAppDispatch();

  const triggerAction = () => {
    dispatch(
      addEntry({
        accountId: "10004",
        amount: 90,
        categoryId: "999001",
        purpose: "expense",
      }),
    );

    // dispatch(addNewCategory({
    //   name: "Groceries",
    //   userId: "ABC123"
    // }))
  };

  useEffect(() => {
    // TODO: CONFIRM - Get current user data using user id
    // dispatch(getUserById("ABC123"));
    dispatch(getAllAccountsByUserId(user.id));
    dispatch(getAllCategoriesByUserId(user.id));

    const accountIds = accounts.map((account) => account.id);

    dispatch(getAllEntriesByAccountIds(accountIds));
  }, []);

  return (
    <div>
      <div key={user.id}>
        <h3>Name: {user.name}</h3>
        <p>ID: {user.id}</p>
        <p>Date Created: {user.dateCreated}</p>
      </div>

      <button onClick={triggerAction} style={{ background: "skyblue" }}>
        Trigger action
      </button>
    </div>
  );
};

export default UsersPage;
