import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addEntry
} from "../features/entries/entriesSlice";

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
