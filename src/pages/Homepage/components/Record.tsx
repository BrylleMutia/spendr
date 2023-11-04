import React from "react";
import { Entry } from "../../../features/entries/entryTypes";
import currencyFormatter from "../../../utils/currencyFormatter";
import moment from "moment";

type RecordProps = {
  entryDetails: Entry;
};

const Record = ({ entryDetails }: RecordProps) => {
  const { categoryId, accountId, amount, purpose, dateCreated } = entryDetails;

  const purposeStyling = () => {
    if (purpose === "expense") {
      return (
        <h3 className="text-sm font-medium text-negative">
          -{currencyFormatter.format(amount)}
        </h3>
      );
    } else if (purpose === "income") {
      return (
        <h3 className="text-sm font-medium text-positive">
          +{currencyFormatter.format(amount)}
        </h3>
      );
    } else
      return (
        <h3 className="text-sm font-medium">
          {currencyFormatter.format(amount)}
        </h3>
      );
  };

  return (
    <div className="flex">
      <div className="mr-3 flex items-center justify-center rounded-full bg-blue-primary">
        <img
          src="https://i.ibb.co/vm4zLzZ/bank-notes-2.png"
          className="w-3/4"
          alt="record"
        />
      </div>
      <div className="flex w-full justify-between">
        <div>
          <h3 className="text-sm font-medium">{categoryId}</h3>
          <p className="text-xs text-gray-text-2">{accountId}</p>
        </div>
        <div className="text-right">
          {purposeStyling()}

          <p className="text-xs text-gray-text-2">
            {moment(dateCreated).format("MM/DD/YYYY")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Record;
