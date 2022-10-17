import "./Dashboard.scss";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import numeral from "numeral";
import { Metamask } from "../header/svgs/Metamask";
import useTotalTvl from "./hooks/useTotalTvl";
import { fetchSubgraphCycleQuery } from "../myportfolio/hooks/useSubgraphQuery";

const BIG_TEN = new BigNumber(10);

type Props = {
  coingeckoPrices: any;
};

type DashboardSubgraphQuery = {
  trancheCycles: TrancheCycle[];
};

type TrancheCycle = {
  capital: string;
  cycle: number;
  endAt: string;
  id: string;
  principal: string;
};

function Dashboard(props: Props) {
  const { coingeckoPrices } = props;

  const { price, marketCap } = useWTFPriceLP();

  const totalTvl = useTotalTvl();

  const [subgraph, setSubgraph] = useState<{ data: DashboardSubgraphQuery; assets: string[] }[]>([]);

  useEffect(() => {
    const fetchSubgraph = async () => {
      const subgraphQuery = await fetchSubgraphCycleQuery();
      setSubgraph(subgraphQuery);
    };

    fetchSubgraph();
  }, []);

  const totalCapitalDeployed = subgraph.reduce(
    (acc: number, nextQuery: { data: DashboardSubgraphQuery; assets: string[] }) => {
      let deployedUSDvalue;

      const deployed = nextQuery.data.trancheCycles.reduce((acc: number, nextCycle: TrancheCycle) => {
        return acc + Number(new BigNumber(nextCycle.principal).dividedBy(BIG_TEN.pow(18)).toString());
      }, 0);

      if (nextQuery.assets[0] === "WAVAX") {
        deployedUSDvalue = deployed * Number(coingeckoPrices?.["wrapped-avax"]?.usd);
      } else if (nextQuery.assets[0] === "WBNB") {
        deployedUSDvalue = deployed * Number(coingeckoPrices?.wbnb?.usd);
      } else {
        deployedUSDvalue = deployed;
      }

      return acc + deployedUSDvalue;
    },
    80666000
  );

  return (
    <div className="dashboard-wrapper dark">
      <div className="dash-banner">
        <div className="content">
          <div className="block">
            <span className="title">WTF Price</span>
            <span className="value">$ {price ? numeral(price).format("0,0.[00]") : "-"}</span>
          </div>
          <div className="block">
            <span className="title">Market Cap</span>
            <span className="value">$ {marketCap ? numeral(marketCap).format("0,0") : "-"}</span>
          </div>
          <div className="block">
            <span className="title">Total Value Locked</span>
            <span className="value">$ {totalTvl}</span>
          </div>
          <div className="block">
            <span className="title">Total Capital Deployed</span>
            <span className="value">$ {numeral(totalCapitalDeployed).format("0,0")}</span>
          </div>
          <div className="block">
            <span className="title" />
            <div className="icon-group">
              <Metamask />
              <a href="https://www.coingecko.com/en/coins/waterfall-governance-token">
                <div className="coingecko" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
