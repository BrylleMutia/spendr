import { Entry } from "../../../features/entries/entryTypes";
import currencyFormatter from "../../../utils/currencyFormatter";
import moment from "moment";
import { useAppSelector } from "../../../app/hooks";
import SkeletonLoader from "../../../components/SkeletonLoader";

type RecordProps = {
  entryDetails: Entry;
};

const Record = ({ entryDetails }: RecordProps) => {
  const { categoryId, accountId, amount, purpose, dateCreated } = entryDetails;
  const { accounts } = useAppSelector((state) => state.accounts);
  const { categories } = useAppSelector((state) => state.categories);
  const { isLoading } = useAppSelector((state) => state.entries);

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

  return !isLoading ? (
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
          <h3 className="text-sm font-medium">
            {categories.find((category) => category.id === categoryId)?.name}
          </h3>
          <p className="text-xs text-gray-text-2">
            {accounts.find((account) => account.id === accountId)?.name}
          </p>
        </div>
        <div className="text-right">
          {purposeStyling()}

          <p className="text-xs text-gray-text-2">
            {moment(dateCreated).format("MM/DD/YYYY")}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <SkeletonLoader hasProfileImg={false} rows={2} />
  );
};

export default Record;
