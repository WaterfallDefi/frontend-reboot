import { useEffect, useState } from "react";

import { VictoryAxis, VictoryChart, VictoryLine, VictoryVoronoiContainer } from "victory";
import { Tranche } from "../../types";
import { CoingeckoPrices } from "../Markets";
import { APYDataFull } from "../../Yego";

type Props = {
  APYdata: APYDataFull[] | undefined;
  coingeckoPrices: CoingeckoPrices;
  tranches: Tranche[];
  trancheCount: number;
  toggleChartTranche: number;
};

const StrategyChart = (props: Props) => {
  const { APYdata, coingeckoPrices, tranches, trancheCount, toggleChartTranche } = props;
  const [hoverYield, setHoverYield] = useState<string>();

  const [seniorRewardAPRs, setSeniorRewardAPRs] = useState<any[]>([]);
  const [juniorRewardAPRs, setJuniorRewardAPRs] = useState<any[]>([]);

  const [totalAPRs, setTotalAPRs] = useState<any[]>([]);

  // const xys = defiLlamaAPRs.stargate.data.map((rt: any) => {
  //   return { y: rt.apyReward, x: rt.timestamp };
  // });

  useEffect(() => {
    if (APYdata) {
      // const sum = Number(tranches[0]?.autoPrincipal) + Number(tranches[1]?.autoPrincipal);

      // const thicknesses = [
      //   Number(tranches[0]?.autoPrincipal) / Number(sum),
      //   Number(tranches[1]?.autoPrincipal) / Number(sum),
      // ];

      const seniorRewardAPRs = APYdata.map((d, i) => {
        const principal = d.principal;

        const matchingTranchePrincipal = APYdata.filter((e) => e.id === "1-" + d.id.slice(2))[0].principal;

        const sum = Number(principal) + Number(matchingTranchePrincipal);

        //senior comes first
        const thicknesses = [Number(principal) / Number(sum), Number(matchingTranchePrincipal) / Number(sum)];

        //warning: hardcoded
        const stargateFarmTokensAmt = d.farmTokensAmt ? d.farmTokensAmt[0] : 0;

        //warning: hardcoded
        const stargatePrice = coingeckoPrices["stargate-finance"]?.usd;

        //WARNING: HARDCODED
        //harvest means flat value received from cycle, *not yet accounting for USDC price*
        const stargateHarvest = stargateFarmTokensAmt * (stargatePrice ? stargatePrice : 1);

        const rawYieldForCycle = principal > 0 ? (principal + stargateHarvest) / principal : 1;

        const durationYearMultiplier = 31536000 / d.duration;

        //WARNING: HARDCODED ONLY FOR STARGATE
        const rewardAPR = (rawYieldForCycle - 1) * 100 * durationYearMultiplier;

        const seniorRewardAPR = rewardAPR * (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5);

        return {
          id: d.id,
          x: d.x,
          //TODO: AVERAGE THESE APRS IN PROPORTION TO HARDCODED STRATEGY BALANCE INSTEAD OF ASSUMING 50 / 50
          y: seniorRewardAPR, //PLACEHOLDER HARDCODE
        };
      });

      setSeniorRewardAPRs(seniorRewardAPRs);

      const juniorRewardAPRs = APYdata.map((d, i) => {
        const principal = d.principal;

        const matchingTranchePrincipal = APYdata.filter((e) => e.id === "0-" + d.id.slice(2))[0].principal;

        const sum = Number(principal) + Number(matchingTranchePrincipal);

        //junior goes second
        const thicknesses = [Number(matchingTranchePrincipal) / Number(sum), Number(principal) / Number(sum)];

        //warning: hardcoded
        const stargateFarmTokensAmt = d.farmTokensAmt ? d.farmTokensAmt[0] : 0;

        //warning: hardcoded
        const stargatePrice = coingeckoPrices["stargate-finance"]?.usd;

        //WARNING: HARDCODED
        //harvest means flat value received from cycle, *not yet accounting for USDC price*
        const stargateHarvest = stargateFarmTokensAmt * (stargatePrice ? stargatePrice : 1);

        const rawYieldForCycle = principal > 0 ? (principal + stargateHarvest) / principal : 1;

        const durationYearMultiplier = 31536000 / d.duration;

        //WARNING: HARDCODED ONLY FOR STARGATE
        const rewardAPR = (rawYieldForCycle - 1) * 100 * durationYearMultiplier;

        const seniorRewardAPR = rewardAPR * (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5);

        const juniorRewardAPR = rewardAPR - seniorRewardAPR;

        return {
          id: d.id,
          x: d.x,
          y: juniorRewardAPR,
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
          y: d.y + (d.id.slice(0, 2) === "0-" ? reward[0].y : juniorReward[0].y),
        };
      });

      setTotalAPRs(totalRewards);
    }
  }, [APYdata, coingeckoPrices, tranches]);

  // console.log(seniorRewardAPRs);
  // console.log(juniorRewardAPRs);

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
            <VictoryLine
              data={APYdata.filter((tc) => tc.id.slice(0, 2) === "1-" && tc.y !== 0)}
              style={{ data: { stroke: "#fcb500" } }}
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
