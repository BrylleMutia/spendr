import React from "react";
import type { Account } from "../../../features/accounts/accountTypes";
import currencyFormatter from "../../../utils/currencyFormatter";

type AccountProps = {
  accountDetails: Account;
};

const Account = ({ accountDetails }: AccountProps) => {
  const { name, amount } = accountDetails;

  return (
    <section className="min-w-[90px] rounded-md bg-gray-account px-2 py-1 text-white-primary" style={{ flexBasis: "calc(33.333333% - 0.4em)" }}>
      <h5 className="text-xs font-medium">{name}</h5>
      <h4 className="text-sm font-bold">{currencyFormatter.format(amount)}</h4>
    </section>
  );
};

export default Account;
