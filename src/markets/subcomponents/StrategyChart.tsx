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
  const [totalAPRs, setTotalAPRs] = useState<any[]>([]);
  const [stargateAPRs, setStargateAPRs] = useState<any[]>([]);

  // const xys = defiLlamaAPRs.stargate.data.map((rt: any) => {
  //   return { y: rt.apyReward, x: rt.timestamp };
  // });

  useEffect(() => {
    if (APYdata) {
      const stargateAPRsOnThatDate = APYdata.map((d) =>
        defiLlamaAPRs.stargate.data.filter((a: any) => {
          const date = new Date(a.timestamp);
          return date.getDate() - d.x.getDate() === 0 && date.getMonth() - d.x.getMonth() === 0;
        })
      );
      const stargateAPRsOnly = APYdata.map((d, i) => {
        return { x: d.x, y: stargateAPRsOnThatDate[i][0].apyReward };
      });
      const usdcPlusStargateAPRs = APYdata.map((d, i) => {
        return { x: d.x, y: d.y + stargateAPRsOnThatDate[i][0].apyReward };
      });
      setStargateAPRs(stargateAPRsOnly);
      setTotalAPRs(usdcPlusStargateAPRs);
    }
  }, [APYdata, defiLlamaAPRs]);

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
        {totalAPRs.length > 0 && <VictoryLine data={totalAPRs} style={{ data: { stroke: "#0066ff" } }} />}
        {stargateAPRs.length > 0 && <VictoryLine data={stargateAPRs} style={{ data: { stroke: "#ffffff" } }} />}
        {APYdata && trancheCount === 3 && (
          <VictoryLine
            data={APYdata.filter((tc) => tc.id.slice(0, 2) === "2-" && tc.y !== 0)}
            style={{ data: { stroke: "#0066ff" } }}
          />
        )}
      </VictoryChart>
    </div>
  );
};

export default StrategyChart;
