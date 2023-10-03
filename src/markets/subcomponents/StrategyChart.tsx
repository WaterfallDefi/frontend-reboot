import { useEffect, useState } from "react";

import { VictoryAxis, VictoryChart, VictoryLine, VictoryVoronoiContainer } from "victory";
import { Tranche } from "../../types";

type Props = {
  APYdata: any[] | undefined;
  defiLlamaAPRs: any;
  tranches: Tranche[];
  trancheCount: number;
  toggleChartTranche: number;
  // color: string;
};

// enum Timescale {
//   Day = 0,
//   Week = 1,
//   TwoWeeks = 2,
// }

const StrategyChart = (props: Props) => {
  const { APYdata, defiLlamaAPRs, tranches, trancheCount, toggleChartTranche } = props;
  const [hoverYield, setHoverYield] = useState<string>();

  const [juniorBaseAPRs, setJuniorBaseAPRs] = useState<any[]>([]);
  const [seniorRewardAPRs, setSeniorRewardAPRs] = useState<any[]>([]);
  const [juniorRewardAPRs, setJuniorRewardAPRs] = useState<any[]>([]);

  const [totalAPRs, setTotalAPRs] = useState<any[]>([]);

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
      const aaveAPRsOnThatDate = APYdata.map((d) =>
        defiLlamaAPRs.aave.data.filter((a: any) => {
          const date = new Date(a.timestamp);
          return date.getDate() - d.x.getDate() === 0 && date.getMonth() - d.x.getMonth() === 0;
        })
      );

      const sum = Number(tranches[0]?.autoPrincipal) + Number(tranches[1]?.autoPrincipal);

      const thicknesses = [
        Number(tranches[0]?.autoPrincipal) / Number(sum),
        Number(tranches[1]?.autoPrincipal) / Number(sum),
      ];

      const juniorBaseAPR = APYdata.filter((tc) => tc.id.slice(0, 2) === "1-").map((d, i) => {
        const baseAPR = (stargateAPRsOnThatDate[i][0].apy + aaveAPRsOnThatDate[i][0].apy) / 2;

        //id order matches so can use index
        const seniorTrancheAPRs = APYdata.filter((tc: any) => tc.id.slice(0, 2) === "0-");
        return {
          id: d.id,
          x: d.x,
          //TODO: AVERAGE THESE APRS IN PROPORTION TO HARDCODED STRATEGY BALANCE INSTEAD OF ASSUMING 50 / 50
          y: (baseAPR - seniorTrancheAPRs[i].y * thicknesses[0]) / thicknesses[1],
        };
      });

      setJuniorBaseAPRs(juniorBaseAPR);

      const seniorRewardAPRs = APYdata.map((d, i) => {
        return {
          id: d.id,
          x: d.x,
          //TODO: AVERAGE THESE APRS IN PROPORTION TO HARDCODED STRATEGY BALANCE INSTEAD OF ASSUMING 50 / 50
          y:
            ((stargateAPRsOnThatDate[i][0].apyReward + aaveAPRsOnThatDate[i][0].apyReward) / 2) *
            (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5),
        };
      });

      setSeniorRewardAPRs(seniorRewardAPRs);

      const juniorRewardAPRs = APYdata.map((d, i) => {
        return {
          id: d.id,
          x: d.x,
          //TODO: AVERAGE THESE APRS IN PROPORTION TO HARDCODED STRATEGY BALANCE INSTEAD OF ASSUMING 50 / 50
          // * 1 = replace with * seniorTrancheThickness IF seniorTrancheThickness is less than 50, but just 50 if more
          y:
            (stargateAPRsOnThatDate[i][0].apyReward + aaveAPRsOnThatDate[i][0].apyReward) / 2 -
            ((stargateAPRsOnThatDate[i][0].apyReward + aaveAPRsOnThatDate[i][0].apyReward) / 2) *
              (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5),
        };
      });

      setJuniorRewardAPRs(juniorRewardAPRs);

      const totalRewards = APYdata.map((d, i) => {
        const reward = seniorRewardAPRs.filter((rew) => rew.id === d.id);
        const juniorReward = juniorRewardAPRs.filter((rew) => rew.id === d.id);
        return {
          id: d.id,
          x: d.x,
          //TODO: AVERAGE THESE APRS IN PROPORTION TO HARDCODED STRATEGY BALANCE INSTEAD OF ASSUMING 50 / 50
          y: d.y + (reward.length > 0 ? reward[0].y : juniorReward[0].y),
        };
      });

      setTotalAPRs(totalRewards);
    }
  }, [APYdata, defiLlamaAPRs, tranches]);

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

        {
          /* senior tranche base */
          APYdata && toggleChartTranche === 0 && (
            <VictoryLine
              data={APYdata.filter((tc) => tc.id.slice(0, 2) === "0-" && tc.y !== 0)}
              style={{ data: { stroke: "#fcb500" } }}
            />
          )
        }
        {
          //senior reward APRs
          APYdata && toggleChartTranche === 0 && (
            <VictoryLine data={seniorRewardAPRs} style={{ data: { stroke: "#ffffff" } }} />
          )
        }
        {
          //senior total APRs
          APYdata && toggleChartTranche === 0 && (
            <VictoryLine
              data={totalAPRs.filter((tc) => tc.id.slice(0, 2) === "0-" && tc.y !== 0)}
              style={{ data: { stroke: "#0066ff" } }}
            />
          )
        }

        {
          // junior tranche base
          APYdata && toggleChartTranche === 1 && (
            <VictoryLine data={juniorBaseAPRs} style={{ data: { stroke: "#fcb500" } }} />
          )
        }

        {
          //junior reward APRs
          APYdata && toggleChartTranche === 1 && (
            <VictoryLine data={juniorRewardAPRs} style={{ data: { stroke: "#ffffff" } }} />
          )
        }
        {
          //junior total APRs
          APYdata && toggleChartTranche === 1 && (
            <VictoryLine
              data={totalAPRs.filter((tc) => tc.id.slice(0, 2) === "1-" && tc.y !== 0)}
              style={{ data: { stroke: "#0066ff" } }}
            />
          )
        }

        {/* {APYdata && trancheCount === 3 && (
          <VictoryLine
            data={APYdata.filter((tc) => tc.id.slice(0, 2) === "2-" && tc.y !== 0)}
            style={{ data: { stroke: "#0066ff" } }}
          />
        )} */}
      </VictoryChart>
    </div>
  );
};

export default StrategyChart;
