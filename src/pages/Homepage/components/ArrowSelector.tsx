import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Card from "../../../components/Card";

type ArrowSelectorProps = {
  text: string;
  actionHandler: (modifier: number) => void;
};

const ArrowSelector = ({ text, actionHandler }: ArrowSelectorProps) => {
  return (
    <Card className="mx-3 my-5 flex items-center justify-between px-6 py-1">
      <button className="text-blue-accent" onClick={() => actionHandler(-1)}>
        <BsChevronLeft />
      </button>
      <p className="text-sm">{text}</p>
      <button className="text-blue-accent" onClick={() => actionHandler(1)}>
        <BsChevronRight />
      </button>
    </Card>
  );
};

export default ArrowSelector;
