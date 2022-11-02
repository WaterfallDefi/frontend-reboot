import React, { useEffect, useState } from "react";
import { VictoryPie } from "victory";

type StrategyFarm = {
  farmName: string;
  shares: number;
  sAddress: string;
  apiKey: string;
};

type Props = {
  strategyFarms: StrategyFarm[];
};

const COLORS = ["rgb(19,19,44)", "#FFB0E3", "#4A63B9", "#85C872", "#F7C05F"];

function PortfolioChart(props: Props) {
  const { strategyFarms } = props;

  const [data, setData] = useState<StrategyFarm[]>([
    { farmName: "", shares: 1, sAddress: "", apiKey: "" },
    ...strategyFarms.map((f) => {
      return { ...f, shares: 0 };
    }),
  ]);
  const [loaded, setLoaded] = useState<boolean>(false);

  // const [hoveredSlice, setHoveredSlice] = useState<StrategyFarm>();

  useEffect(() => {
    if (!loaded) {
      setData([{ farmName: "", shares: 0, sAddress: "", apiKey: "" }, ...strategyFarms]);
      setLoaded(true);
    }
  }, [strategyFarms, loaded]);

  return (
    <div className="portfolio-chart">
      {data.map(
        (strat, i) =>
          strat.shares !== 0 && (
            <div className="strat" key={i}>
              <span className={"color" + i}>{strat.farmName}:</span>{" "}
              <span>{strat.shares === 0 ? "" : (strat.shares * 100).toString() + "%"}</span>
            </div>
          )
      )}
      <VictoryPie
        data={data}
        width={275}
        height={275}
        labels={data.map((strat) => (strat.shares === 0 ? "" : (strat.shares * 100).toString() + "%"))}
        labelRadius={35}
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
        // events={[
        //   {
        //     target: "data",
        //     eventHandlers: {
        //       onMouseOver: (props) => {
        //         console.log(props);
        //       },
        //     },
        //   },
        // ]}
      />
    </div>
  );
}

export default PortfolioChart;
