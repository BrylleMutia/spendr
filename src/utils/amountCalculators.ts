import type { Entry, Purpose } from "../features/entries/entryTypes";
import { currentDateMonthYear, dateConvertMonthYear } from "./dateConverter";

// helper functionss
export const getTotals = (
  entriesPayload: Entry[],
  mode: "expense" | "income" | "cashflow",
  monthModifier?: number,
) =>
  /**
   * Function used to get total expense, income, and cashflow in specified month with relation to current month (month modifier)
   *
   * @param   entriesPayload    all entries from state
   * @param   mode              total to be calculated
   * @param   monthModifier     how many months back to get with relation to current month (ex. 1 would be current month - 1 month)
   *
   * @return  total
   */

  entriesPayload.reduce((sum, current) => {
    if (
      dateConvertMonthYear(current.dateCreated) ===
      currentDateMonthYear(monthModifier)
    ) {
      if (
        current.purpose === "expense" &&
        (mode === current.purpose || mode === "cashflow")
      ) {
        return sum - current.amount;
      } else if (
        current.purpose === "income" &&
        (mode === current.purpose || mode === "cashflow")
      ) {
        return sum + current.amount;
      } else {
        return sum;
      }
    } else return sum;
  }, 0);

export const aggregateAmountByPurpose = (purpose: Purpose, amount: number) => {
  if (purpose === "expense") {
    return amount * -1;
  } else if (purpose === "income" || purpose === "transfer") {
    return amount;
  } else return amount;
};
