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
  color: string;
};

enum Timescale {
  Day = 0,
  Week = 1,
  TwoWeeks = 2,
}

const StrategyChart = (props: Props) => {
  const { data, strategy, color } = props;
  // const [chartWidth, setChartWidth] = useState<number>(window.innerWidth * 0.6);
  const [hoverYield, setHoverYield] = useState<string>();

  return (
    <div className="strategy-chart">
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
              onActivated={(points) =>
                setHoverYield(
                  points[0]._y.toFixed(2) +
                    "% - " +
                    new Date(points[0]._x).toLocaleDateString()
                )
              }
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
            },
          }}
          tickFormat={(t) =>
            new Date(t).getDate() + "/" + (new Date(t).getMonth() + 1)
          }
        />
        <VictoryAxis scale="linear" dependentAxis tickCount={10} />
        {data && (
          <VictoryLine data={data} style={{ data: { stroke: color } }} />
        )}
      </VictoryChart>
    </div>
  );
};

export default StrategyChart;
