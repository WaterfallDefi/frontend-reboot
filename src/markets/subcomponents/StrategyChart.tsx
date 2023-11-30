import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryVoronoiContainer } from "victory";
import { StrategyFarm, Tranche } from "../../types";
import { CoingeckoPrices } from "../Markets";
import { APYDataFull } from "../../Yego";

type Props = {
  APYdata: APYDataFull[] | undefined;
  strategyFarms: StrategyFarm[];
  coingeckoPrices: CoingeckoPrices;
  tranches: Tranche[];
  trancheCount: number;
  toggleChartTranche: number;
};

const BIG_TEN = new BigNumber(10);

const StrategyChart = (props: Props) => {
  const { APYdata, strategyFarms, coingeckoPrices, tranches, trancheCount, toggleChartTranche } = props;
  const [hoverYield, setHoverYield] = useState<string>();

  const [seniorRewardAPRs, setSeniorRewardAPRs] = useState<any[]>([]);
  const [juniorRewardAPRs, setJuniorRewardAPRs] = useState<any[]>([]);

  const [totalAPRs, setTotalAPRs] = useState<any[]>([]);

  useEffect(() => {
    if (APYdata) {
      const rewardAPRs = APYdata.map((d: APYDataFull, i) => {
        const principal = d.principal;
        const matchingTranchePrincipal = APYdata.filter((e) => e.id === "1-" + d.id.slice(2))[0].principal;

        const sum = Number(principal) + Number(matchingTranchePrincipal);

        //senior comes first
        const thicknesses = [Number(principal) / Number(sum), Number(matchingTranchePrincipal) / Number(sum)];

        //find prices of tokens
        //ONLY FINDING CURRENT PRICE FOR NOW
        const farmTokensPrices = d.farmTokens
          ? d.farmTokens.map((add: string) => {
              const targetFarm: StrategyFarm = strategyFarms.filter((f) => f.farmTokenContractAddress === add)[0];
              return coingeckoPrices[targetFarm.dataId]?.usd;
            })
          : [];

        const rewardsUSDValues = d.farmTokens
          ? d.farmTokensAmt.map(
              (amt: number, i: number) => new BigNumber(amt).dividedBy(BIG_TEN.pow(18)).toNumber() * farmTokensPrices[i]
            )
          : [];

        const totalReward = rewardsUSDValues.reduce((acc: number, next: number) => acc + next, 0);

        const rawYieldForCycle = principal > 0 ? (principal + totalReward) / principal : 1;

        const durationYearMultiplier = 31536000 / d.duration;

        const rewardAPR = (rawYieldForCycle - 1) * 100 * durationYearMultiplier;

        const seniorRewardAPR = rewardAPR * (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5);

        const juniorRewardAPR = rewardAPR - seniorRewardAPR;

        return {
          id: d.id,
          senior: {
            id: d.id,
            x: d.x,
            y: seniorRewardAPR,
          },
          junior: { id: d.id, x: d.x, y: juniorRewardAPR },
        };
      });

      setSeniorRewardAPRs(rewardAPRs.map((apr) => apr.senior));
      setJuniorRewardAPRs(rewardAPRs.map((apr) => apr.junior));

      const totalRewards = APYdata.map((d, i) => {
        const reward = rewardAPRs.filter((rew) => rew.id === d.id)[0];
        return {
          id: d.id,
          x: d.x,
          y: d.y + (d.id.slice(0, 2) === "0-" ? reward.senior.y : reward.junior.y),
        };
      });

      setTotalAPRs(totalRewards);
    }
  }, [APYdata, coingeckoPrices, strategyFarms, tranches]);

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
              style={{ data: { stroke: "#fcb500" } }}
            />
          )
        }
        {
          // junior tranche base
          APYdata && toggleChartTranche === 1 && (
            <VictoryLine
              data={APYdata.filter((tc) => tc.id.slice(0, 2) === "1-" && tc.y !== 0)}
              style={{ data: { stroke: "#0066ff" } }}
            />
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
