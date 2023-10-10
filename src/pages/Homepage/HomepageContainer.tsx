import { useAppSelector } from "../../app/hooks";

import Card from "../../components/Card";
import { IoMdSettings } from "react-icons/io";
import Account from "./components/Account";

const HomepageContainer = () => {
  const accounts = useAppSelector((state) => state.accounts.accounts);

  return (
    <main>
      <Card className="mx-3 my-5 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Accounts</h3>
          <IoMdSettings />
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {accounts.map((account) => (
            <Account accountDetails={account} />
          ))}
        </div>
      </Card>
    </main>
  );
};

export default HomepageContainer;
