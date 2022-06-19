import { useState } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
} from "victory";
import { StrategyFarm } from "../../types";

type Props = {
  data: any[] | undefined;
  strategy: StrategyFarm | undefined;
};

enum Timescale {
  Day = 0,
  Week = 1,
  TwoWeeks = 2,
}

const StrategyChart = (props: Props) => {
  const { data, strategy } = props;
  // const [chartWidth, setChartWidth] = useState<number>(window.innerWidth * 0.6);
  const [hoverYield, setHoverYield] = useState<string>();

  return (
    <div className="strategy-chart">
      {hoverYield && (
        <span className="hoverPrice" key="hoverPrice">
          {hoverYield}%
        </span>
      )}
      <VictoryChart
        key="chart"
        containerComponent={
          data && (
            <VictoryVoronoiContainer
              labels={({ datum }) => (Number(datum._y) * 100).toFixed(0) + "%"}
              onActivated={(points) =>
                setHoverYield(Number(points[0]._y * 100).toFixed(2))
              }
              activateLabels={false}
            />
          )
        }
      >
        <VictoryAxis
          scale="time"
          tickCount={3}
          style={{
            tickLabels: {
              fontSize: 10,
            },
          }}
          tickFormat={(t) =>
            new Date(t).toLocaleDateString() +
            ", " +
            new Date(t).toLocaleTimeString()
          }
        />
        <VictoryAxis scale="linear" dependentAxis tickCount={10} />
        {data && <VictoryLine data={data} />}
      </VictoryChart>
    </div>
  );
};

export default StrategyChart;
