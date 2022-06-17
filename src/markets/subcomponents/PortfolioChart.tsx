import { useEffect, useState } from "react";
import { VictoryPie } from "victory";

type StrategyFarm = {
  farmName: string;
  shares: number;
  sAddress: string;
  apiKey: string;
};

type Props = {
  strategyFarms: StrategyFarm[];
  APYData: any[];
};

const COLORS = ["#FFFFFF", "#FFB0E3", "#4A63B9", "#85C872", "#F7C05F"];

function PortfolioChart(props: Props) {
  const { strategyFarms, APYData } = props;

  const [data, setData] = useState<StrategyFarm[]>([
    { farmName: "", shares: 1, sAddress: "", apiKey: "" },
    ...strategyFarms.map((f) => {
      return { ...f, shares: 0 };
    }),
  ]);

  useEffect(() => {
    setData([
      { farmName: "", shares: 0, sAddress: "", apiKey: "" },
      ...strategyFarms,
    ]);
  }, []);

  // const strategyTuple = strategyFarms.map((s) => s.apiKey);
  // const strategyNameTuple = strategyFarms.map((s) => s.farmName);

  return (
    <div className="portfolio-chart">
      <VictoryPie
        data={data}
        labels={data.map((strat) =>
          strat.shares === 0 ? "" : (strat.shares * 100).toString() + "%"
        )}
        labelRadius={55}
        y="shares"
        colorScale={COLORS}
        animate={{
          easing: "exp",
        }}
        style={{
          labels: {
            fontSize: 20,
            fill: "#FFFFFF",
          },
        }}
      />
    </div>
  );
}

export default PortfolioChart;
