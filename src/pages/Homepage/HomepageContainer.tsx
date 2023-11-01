import { useAppSelector } from "../../app/hooks";

import Card from "../../components/Card";
import { IoMdSettings } from "react-icons/io";
import Account from "./components/Account";
import AddAccount from "./components/AddAccount";
import WalletGauge from "./components/WalletGauge";
import UsersPage from "../UsersPage";

const HomepageContainer = () => {
  const accounts = useAppSelector((state) => state.accounts.accounts);
  const totals = useAppSelector((state) => state.entries.totals);

  const cashflowCompPercentage =
    (totals.cashflowCurr / totals.cashflowPrev) * 100;

  return (
    <main>
      <Card className="mx-3 my-5 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Accounts</h3>
          <IoMdSettings />
        </div>

        <div className="mt-3 flex flex-wrap gap-[0.6em]">
          {accounts.map((account) => (
            <Account accountDetails={account} />
          ))}
          <AddAccount text="ADD ACCOUNT" />
        </div>
      </Card>

      <div className="text-center">
        <button className="text-[0.66em] font-bold text-blue-accent">
          SELECT ALL
        </button>
      </div>

      <Card className="mx-3 my-5 p-4">
        <div>
          <h3 className="text-sm font-bold">Wallet Dashboard</h3>
          <p className="text-gra text-xs">
            Current month vs. previous month statistics report
          </p>
        </div>

        {/* TODO: Structure needed data on backend */}
        <div className="mt-3 flex flex-row flex-wrap gap-[0.6em]">
          <WalletGauge label="Cash-flow %" value={cashflowCompPercentage} />
        </div>
      </Card>

      <UsersPage />
    </main>
  );
};

export default HomepageContainer;
