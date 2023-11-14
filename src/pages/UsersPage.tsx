import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserById } from "../features/users/usersSlice";
import { getAllAccountsByUserId } from "../features/accounts/accountsSlice";
import { getAllCategories } from "../features/categories/categoriesSlice";
import { addEntry, getAllEntries } from "../features/entries/entriesSlice";

const UsersPage = () => {
  const { user } = useAppSelector((state) => state.users);
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
    dispatch(getUserById("ABC123"));
    dispatch(getAllAccountsByUserId("ABC123"));
    dispatch(getAllCategories(0));
    dispatch(getAllEntries(0));
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
