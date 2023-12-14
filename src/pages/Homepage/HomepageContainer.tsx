import React from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import Card from "../../components/Card";
import { IoMdSettings } from "react-icons/io";
import Account from "./components/Account";
import AddAccount from "./components/AddAccount";
import WalletGauge from "./components/WalletGauge";
import UsersPage from "../UsersPage";
import LineBarComparison from "./components/LineBarComparison";
import ComparisonLegend from "./components/ComparisonLegend";
import ArrowSelector from "./components/ArrowSelector";
import { updateMonthInView } from "../../features/entries/entriesSlice";
import Record from "./components/Record";
import moment from "moment";
import AddEntry from "./components/AddEntry";

const HomepageContainer = () => {
  const accounts = useAppSelector((state) => state.accounts.accounts);
  const { totals, monthInView, entries } = useAppSelector(
    (state) => state.entries,
  );

  // if no records from prev month, return current total as percentage for current
  const cashflowCompPercentage =
    totals.prev.cashflow > 0
      ? (totals.current.cashflow / totals.prev.cashflow) * 100
      : totals.current.cashflow;
  const expenseCompPercentage =
    totals.prev.expense > 0
      ? (totals.current.expense / totals.prev.expense) * 100
      : totals.current.expense;
  const incomeCompPercentage =
    totals.prev.income > 0
      ? (totals.current.income / totals.prev.income) * 100
      : totals.current.income;

  const dispatch = useAppDispatch();

  const updateMonthInViewHandler = (modifier: number) =>
    dispatch(updateMonthInView(modifier));

  return (
    <main className="bg-gray-background py-5">
      <Card className="mx-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Accounts</h3>
          <IoMdSettings />
        </div>

        <div className="mt-3 flex flex-wrap gap-[0.6em]">
          {accounts.map((account) => (
            <Account key={account.id} accountDetails={account} />
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
          <p className="text-xs">
            Current month vs. previous month statistics report
          </p>
        </div>

        <div className="mt-3 flex flex-row flex-wrap justify-center gap-[0.6em]">
          <WalletGauge label="Cash-flow %" value={cashflowCompPercentage} />
        </div>

        <div className="mb-5 mt-8">
          <LineBarComparison
            header="Expense"
            compPercentage={expenseCompPercentage}
          />
          <LineBarComparison
            header="Income"
            compPercentage={incomeCompPercentage}
          />

          <div className="my-5">
            <ComparisonLegend />
          </div>
        </div>
      </Card>

      <ArrowSelector
        text={monthInView}
        actionHandler={updateMonthInViewHandler}
      />

      <Card className="mx-3 my-5 p-4">
        <h3 className="text-sm font-bold">Records Overview</h3>
        <hr className="my-3 text-gray-text-1" />

        {entries.some(
          // check if any record exists for the current month in view
          (entry) =>
            moment(entry.dateCreated).format("MMMM YYYY") === monthInView,
        ) ? (
          entries.map(
            // if records exist, map through the records for the current month in view
            (entry) =>
              moment(entry.dateCreated).format("MMMM YYYY") === monthInView && (
                <React.Fragment key={entry.id}>
                  <Record key={entry.id} entryDetails={entry} />
                  <hr className="my-2 text-gray-text-1" />
                </React.Fragment>
              ),
          )
        ) : (
          // display message if no records exist within the month
          <p className="text-sm">No records available.</p>
        )}
      </Card>

      <AddEntry />

      <UsersPage />
    </main>
  );
};

export default HomepageContainer;
