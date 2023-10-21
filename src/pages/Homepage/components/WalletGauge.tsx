import React from "react";
import GaugeComponent from "react-gauge-component";

type WalletGaugeProps = {
  label: string;
  value: number;
};

const WalletGauge = ({ label, value }: WalletGaugeProps) => {
  return (
    <article>
      <GaugeComponent
        id="gauge-chart1"
        value={value}
        type="radial"
        minValue={-50}
        labels={{
          valueLabel: {
            style: {
              fill: "#000",
              textShadow: "none",
              fontFamily: "",
            },
          },
          tickLabels: {
            type: "inner",
            ticks: [{ value: 0 }, { value: 50 }, { value: 100 }],
          },
        }}
        arc={{
          colorArray: ["#EA4228", "#5BE12C"],
          subArcs: [{ length: 0.33 }, { length: 0.33 }, { length: 0.33 }],
          padding: 0.02,
          width: 0.3,
        }}
        pointer={{
          elastic: true,
          animationDelay: 0,
        }}
      />
      <h3 className="text-center">{label}</h3>
    </article>
  );
};

export default WalletGauge;
