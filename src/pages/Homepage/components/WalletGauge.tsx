import React from "react";
import GaugeComponent from "react-gauge-component";

const WalletGauge = () => {
  return (
    <article>
      <GaugeComponent
        id="gauge-chart1"
        value={50}
        type="radial"
        labels={{
          tickLabels: {
            type: "inner",
            ticks: [
              { value: 20 },
              { value: 40 },
              { value: 60 },
              { value: 80 },
              { value: 100 },
            ],
          },
        }}
        arc={{
          colorArray: ["#5BE12C", "#EA4228"],
          subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
          padding: 0.02,
          width: 0.3,
        }}
        pointer={{
          elastic: true,
          animationDelay: 0,
        }}
      />
    </article>
  );
};

export default WalletGauge;
