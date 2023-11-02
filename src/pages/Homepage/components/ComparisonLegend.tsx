import React from "react";

const ComparisonLegend = () => {
  return (
    <>
      <ul className="flex list-outside list-[square] justify-center">
        <li className="ml-8 text-[1.5rem] text-blue-accent">
          <div className="text-sm text-black">Current</div>
        </li>
        <li className="ml-8 text-[1.5rem] text-prev-month">
          <div className="text-sm text-black">Previous</div>
        </li>
      </ul>
    </>
  );
};

export default ComparisonLegend;
