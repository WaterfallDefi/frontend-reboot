import { useEffect, useState } from "react";
import { getAPYHourly } from "../../myportfolio/hooks/useSubgraphQuery";
import { Market } from "../../types";
import { Hill } from "../svgs/Hill";
import ApproveCardDefault from "./ApproveCardDefault";
import ClaimRedeposit from "./ClaimRedeposit";
import Deposit from "./Deposit";
import PortfolioChart from "./PortfolioChart";
import TrancheStructure from "./TrancheStructure";

type Props = {
  selectedMarket: Market;
  coingeckoPrices: any;
};

const COLORS = ["#FFB0E3", "#4A63B9", "#85C872", "#F7C05F"];

const MarketDetail: React.FC<Props> = (props: Props) => {
  const { selectedMarket, coingeckoPrices } = props;

  const [selectedDepositAssetIndex, setSelectedDepositAssetIndex] = useState(0);
  const [simulDeposit, setSimulDeposit] = useState(false);

  const today = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14);

  const [APYData, setAPYData] = useState<any[]>([]);

  useEffect(() => {
    getAPYHourly(twoWeeksAgo.toISOString(), today.toISOString()).then(
      (res: any) => {
        setAPYData(res);
      }
    );
  }, []);

  const [selectDepositAssetModalVisible, setSelectDepositAssetModalVisible] =
    useState<boolean>(false);
  const [depositableAssets, setDepositableAssets] = useState<string[]>(
    selectedMarket.assets
  );

  const tokens: { addr: string; strategy: string; percent: any }[] | undefined =
    selectedMarket.tokens;

  const trancheInvest: { type: "BigNumber"; hex: string }[][] | undefined =
    selectedMarket.trancheInvests;

  return (
    <div className="market-detail-wrapper">
      <div className="information">
        <div className="block-wrapper">
          <div className="block">
            <span className="portfolio-name">{selectedMarket.portfolio}</span>
            <span className="listing-date">
              Listing date: {selectedMarket.listingDate}
            </span>
          </div>
          <div className="block">
            <span className="assets"></span>
          </div>
          <div className="block">
            <span className="tvl">$TVL: {selectedMarket.tvl}</span>
          </div>
        </div>
      </div>
      <div className="charts">
        <div className="linear-gradient" />
        <ClaimRedeposit />
        <div className="block col">
          <div className="background left-br">
            <PortfolioChart
              strategyFarms={selectedMarket.strategyFarms}
              APYData={APYData}
            />
          </div>
          <div className="background right-br">
            <div className="legend">
              {selectedMarket.strategyFarms.map((f, i) => (
                <div key={f.farmName} className="farm-key">
                  <div
                    className="key-color"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span>{f.farmName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <TrancheStructure
          tranches={selectedMarket.tranches}
          totalTranchesTarget={selectedMarket.totalTranchesTarget}
        />
      </div>
      <Deposit
        selectedMarket={selectedMarket}
        coingeckoPrices={coingeckoPrices}
        selectedDepositAssetIndex={selectedDepositAssetIndex}
      />
    </div>
  );
};

export default MarketDetail;
