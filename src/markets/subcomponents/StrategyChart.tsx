import { useState } from "react";

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

  console.log("we are here!");
  console.log(defiLlamaAPRs);

  const xys = defiLlamaAPRs.stargate.data.map((rt: any) => {
    return { y: rt.apyReward, x: rt.timestamp };
  });

  return (
    <div className="strategy-chart" onMouseLeave={() => setHoverYield(undefined)}>
      {hoverYield && (
        <span className="hoverPrice" key="hoverPrice">
          {hoverYield}
        </span>
      )}
      <div className="flex-charts">
        <div className="flex-chart">
          <VictoryChart
            key="chart"
            width={window.innerWidth > 1024 ? window.innerWidth * 0.5 : window.innerWidth}
            height={window.innerWidth > 1024 ? 210 : 185}
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
            {APYdata && (
              <VictoryLine
                data={APYdata.filter((tc) => tc.id.slice(0, 2) === "0-" && tc.y !== 0)}
                style={{ data: { stroke: "#fcb500" } }}
              />
            )}
            {APYdata && (
              <VictoryLine
                data={APYdata.filter((tc) => tc.id.slice(0, 2) === "1-" && tc.y !== 0)}
                style={{ data: { stroke: "#00a14a" } }}
              />
            )}
            {APYdata && trancheCount === 3 && (
              <VictoryLine
                data={APYdata.filter((tc) => tc.id.slice(0, 2) === "2-" && tc.y !== 0)}
                style={{ data: { stroke: "#0066ff" } }}
              />
            )}
          </VictoryChart>
        </div>
        <div className="flex-chart">
          <VictoryChart
            key="chart"
            width={window.innerWidth > 1024 ? window.innerWidth * 0.5 : window.innerWidth}
            height={window.innerWidth > 1024 ? 210 : 185}
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
            <VictoryLine data={xys} style={{ data: { stroke: "#0066ff" } }} />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};

export default StrategyChart;
