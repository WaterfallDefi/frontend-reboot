import { useState } from "react";

import { VictoryAxis, VictoryChart, VictoryLine, VictoryVoronoiContainer } from "victory";

type Props = {
  data: any[] | undefined;
  trancheCount: number;
  // color: string;
};

// enum Timescale {
//   Day = 0,
//   Week = 1,
//   TwoWeeks = 2,
// }

const StrategyChart = (props: Props) => {
  const { data, trancheCount } = props;
  // const [chartWidth, setChartWidth] = useState<number>(window.innerWidth * 0.6);
  const [hoverYield, setHoverYield] = useState<string>();

  return (
    <div className="strategy-chart" onMouseLeave={() => setHoverYield(undefined)}>
      {hoverYield && (
        <span className="hoverPrice" key="hoverPrice">
          {hoverYield}
        </span>
      )}
      <VictoryChart
        key="chart"
        containerComponent={
          data && (
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
          tickCount={13}
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
        {data && (
          <VictoryLine
            data={data.filter((tc) => tc.id.slice(0, 2) === "0-" && tc.y !== 0)}
            style={{ data: { stroke: "#fcb500" } }}
          />
        )}
        {data && (
          <VictoryLine
            data={data.filter((tc) => tc.id.slice(0, 2) === "1-" && tc.y !== 0)}
            style={{ data: { stroke: "#00a14a" } }}
          />
        )}
        {data && trancheCount === 3 && (
          <VictoryLine
            data={data.filter((tc) => tc.id.slice(0, 2) === "2-" && tc.y !== 0)}
            style={{ data: { stroke: "#0066ff" } }}
          />
        )}
      </VictoryChart>
    </div>
  );
};

export default StrategyChart;
