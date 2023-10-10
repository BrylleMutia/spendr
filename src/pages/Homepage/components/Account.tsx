import React from "react";
import type { Account } from "../../../features/accounts/accountTypes";
import formatter from "../../../utils/currencyFormatter";

type AccountProps = {
  accountDetails: Account;
};

const Account = ({ accountDetails }: AccountProps) => {
  const { name, amount } = accountDetails;

  return (
    <section className="min-w-[90px] rounded-md bg-gray-account px-2 py-1 text-white-primary">
      <h5 className="text-xs font-medium">{name}</h5>
      <h4 className="text-sm font-bold">{formatter.format(amount)}</h4>
    </section>
  );
};

export default Account;
