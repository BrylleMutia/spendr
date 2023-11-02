import React from "react";

type LineBarComparisonProps = {
  header: string;
  compPercentage: number;
};

const LineBarComparison = ({
  header,
  compPercentage,
}: LineBarComparisonProps) => {
  const roundedPercentage = Math.ceil(compPercentage * 10) / 10;

  return (
    <>
      <div className="flex justify-between">
        <h3 className="mb-2 text-sm font-light">{header}</h3>
        <h3
          className={`mb-2 text-sm font-light ${
            roundedPercentage > 100 ? "text-negative" : "text-positive"
          }`}
        >
          +{`${roundedPercentage}%`}
        </h3>
      </div>
      <div className="relative mb-2 w-full">
        <div className="h-[1em] w-full rounded bg-prev-month"></div>
        <div
          className="absolute top-0 z-[2] h-[1em] max-w-[100%] rounded bg-blue-accent"
          style={{ width: `${roundedPercentage}%` }}
        ></div>
      </div>
    </>
  );
};

export default LineBarComparison;
