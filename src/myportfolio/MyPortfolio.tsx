import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { MarketList } from "../config/markets";
import TableRow from "../shared/TableRow";
import { Market } from "../types";
import { Mode } from "../WaterfallDefi";
import "./MyPortfolio.scss";
import { useSubgraphQuery } from "./hooks/useSubgraphQuery";

type Props = {
  mode: Mode;
  markets: Market[];
};

function MyPortfolio(props: Props) {
  const { mode, markets } = props;

  const { account } = useWeb3React<Web3Provider>();

  const [positions, setPositions] = useState();

  const subgraph = useSubgraphQuery(
    undefined, //remove single market subgraph query because... why?? refactor out later
    account,
    markets
  );

  useEffect(() => {
    subgraph.then((res) => {
      setPositions(res);
    });
  }, []);

  return (
    <div className={"my-portfolio-wrapper " + mode}>
      <div className="header-row">
        <div className="header first">
          <span>Portfolio Name</span>
        </div>
        <div className="header">
          <span>Asset</span>
        </div>
        <div className="header">
          <span>Cycle</span>
        </div>
        <div className="header">
          <span>Tranche</span>
        </div>
        <div className="header">
          <span>APR</span>
        </div>
        <div className="header">
          <span>Principal</span>
        </div>
        <div className="header">
          <span>Status</span>
        </div>
        <div className="header last">
          <span>Yield</span>
        </div>
      </div>
      {MarketList.map((m: Market) => (
        <TableRow
          data={{
            portfolio: m.portfolio,
            assets: m.assets,
            duration: "asdf",
            apr: "asdf",
            tvl: "$100,000",
            status: "Pending",
            action: "asdf",
            yield: "asdf",
          }}
          openFold={true}
        />
      ))}
    </div>
  );
}

export default MyPortfolio;
