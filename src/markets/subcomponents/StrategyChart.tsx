import { useEffect, useState } from "react";

import { VictoryAxis, VictoryChart, VictoryLine, VictoryVoronoiContainer } from "victory";

type Props = {
  APYdata: any[] | undefined;
  defiLlamaAPRs: any;
  trancheCount: number;
  // color: string;
};

// enum Timescale {
//   Day = 0,
//   Week = 1,
//   TwoWeeks = 2,
// }

const StrategyChart = (props: Props) => {
  const { APYdata, defiLlamaAPRs, trancheCount } = props;
  const [hoverYield, setHoverYield] = useState<string>();

  const baseAPRs = defiLlamaAPRs.stargate.data.map((stg: any) => {
    const aave = defiLlamaAPRs.aave.data.filter((aave: any) => {
      const aaveTimestamp = new Date(aave.timestamp);
      const stgTimestamp = new Date(stg.timestamp);

      return (
        aaveTimestamp.getDate() === stgTimestamp.getDate() &&
        aaveTimestamp.getMonth() === stgTimestamp.getMonth() &&
        aaveTimestamp.getFullYear() === stgTimestamp.getFullYear()
      );
    })[0];
    return {
      x: stg.timestamp,
      y: stg.apy + (aave ? aave.apy : 0) / 2,
    };
  });

  const rewardAPRs = defiLlamaAPRs.stargate.data.map((stg: any) => {
    const aave = defiLlamaAPRs.aave.data.filter((aave: any) => {
      const aaveTimestamp = new Date(aave.timestamp);
      const stgTimestamp = new Date(stg.timestamp);

      return (
        aaveTimestamp.getDate() === stgTimestamp.getDate() &&
        aaveTimestamp.getMonth() === stgTimestamp.getMonth() &&
        aaveTimestamp.getFullYear() === stgTimestamp.getFullYear()
      );
    })[0];
    return {
      x: stg.timestamp,
      y: stg.apyReward + (aave ? aave.apyReward : 0) / 2,
    };
  });

  const totalAPRs = defiLlamaAPRs.stargate.data.map((stg: any) => {
    const aave = defiLlamaAPRs.aave.data.filter((aave: any) => {
      const aaveTimestamp = new Date(aave.timestamp);
      const stgTimestamp = new Date(stg.timestamp);

      return (
        aaveTimestamp.getDate() === stgTimestamp.getDate() &&
        aaveTimestamp.getMonth() === stgTimestamp.getMonth() &&
        aaveTimestamp.getFullYear() === stgTimestamp.getFullYear()
      );
    })[0];
    return {
      x: stg.timestamp,
      y: stg.apy + (aave ? aave.apy : 0) / 2 + (stg.apyReward + (aave ? aave.apyReward : 0) / 2),
    };
  });

  return (
    <div className="strategy-chart" onMouseLeave={() => setHoverYield(undefined)}>
      {hoverYield && (
        <span className="hoverPrice" key="hoverPrice">
          {hoverYield}
        </span>
      )}
      <VictoryChart
        key="chart"
        width={window.innerWidth > 1024 ? window.innerWidth * 0.5 : window.innerWidth}
        height={window.innerWidth > 1024 ? 420 : 369}
        containerComponent={
          APYdata && (
            <VictoryVoronoiContainer
              labels={({ datum }) => datum._y.toFixed(1) + "%:"}
              onActivated={(points) => {
                points[0] &&
                  setHoverYield(points[0]._y.toFixed(2) + "% - " + new Date(points[0]._x).toLocaleDateString());
              }}
              activateLabels={false}
            />
          )
        }
      >
        <VictoryAxis
          scale="time"
          tickCount={5}
          style={{
            tickLabels: {
              fontSize: 10,
              fill: "#FFF",
            },
          }}
          tickFormat={(t) => new Date(t).getDate() + "/" + (new Date(t).getMonth() + 1)}
        />
        <VictoryAxis
          scale="linear"
          dependentAxis
          tickCount={10}
          style={{
            tickLabels: {
              fontSize: 10,
              fill: "#FFF",
            },
          }}
        />
        <VictoryLine data={baseAPRs} style={{ data: { stroke: "#ffffff" } }} />
        <VictoryLine data={rewardAPRs} style={{ data: { stroke: "#0066ff" } }} />
        <VictoryLine data={totalAPRs} style={{ data: { stroke: "#1010ff" } }} />
      </VictoryChart>
    </div>
  );
};

export default StrategyChart;
