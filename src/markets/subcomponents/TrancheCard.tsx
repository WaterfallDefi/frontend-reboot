import { BigNumber } from "bignumber.js";
import numeral from "numeral";
import React from "react";
import { Market, Tranche } from "../../types";
import { APYData } from "./MarketDetail";

type Props = {
  selectedMarket: Market;
  selectedDepositAssetIndex: number;
  tranche: Tranche;
  trancheIndex: number;
  selected: boolean;
  setSelectTrancheIdx: React.Dispatch<React.SetStateAction<number | undefined>>;
  latestAPY: APYData | undefined;
};

const formatNumberSeparator = (num: string) => {
  return numeral(num).format("0,0.[0000]");
};

const formatTVL = (num: string | undefined, decimals = 18) => {
  if (!num) return "- -";
  return new BigNumber(num).toFormat(4).toString();
};

function TrancheCard(props: Props) {
  const {
    selectedMarket,
    selectedDepositAssetIndex,
    tranche,
    trancheIndex,
    selected,
    setSelectTrancheIdx,
    // coingeckoPrices,
    latestAPY,
  } = props;
  const isSoldout = false;

  const trancheApr = tranche.apy;

  const tranchePrincipal: string = Number(tranche.autoPrincipal).toString();

  const type: string =
    selectedMarket.trancheCount === 3
      ? ["senior", "mezzanine", "junior"][trancheIndex]
      : ["fixed", "variable"][trancheIndex];

  const riskText: string =
    selectedMarket.trancheCount === 3
      ? ["Low Risk ; Fixed", "Medium Risk ; Fixed", "Multiple Leverage ; Variable"][trancheIndex]
      : ["Low Risk ; Fixed", "Multiple Leverage ; Variable"][trancheIndex];

  const prefix: string = selectedMarket.assets[0] !== "WBNB" && selectedMarket.assets[0] !== "WAVAX" ? "$" : "";

  const decimals: number = selectedMarket.assets[0] === "USDC" || selectedMarket.assets[0] === "USDC.e" ? 6 : 18;

  const tvl: string = formatNumberSeparator(formatTVL(tranchePrincipal, decimals));

  const suffix: string =
    selectedMarket.assets[0] === "WBNB" || selectedMarket.assets[0] === "WAVAX" ? selectedMarket.assets[0] : "";

  return (
    <div
      className={"tranche" + (selected ? " selected" : "") + (isSoldout ? " disabled" : "")}
      onClick={() => !selected && !isSoldout && setSelectTrancheIdx(trancheIndex)}
    >
      {isSoldout ? <div className="sold-out">Sold Out</div> : null}
      <div className="tranche-name">
        <div className="flex-row">
          <div className={"dot " + type} />
          {type.slice(0, 1).toUpperCase() + type.slice(1)}
        </div>
        <div className="checkbox" />
      </div>
      <div className={"apr " + type}>
        APR {latestAPY ? latestAPY.y : "-"}%{/* {isHide ? <span>+ {wtfApr}%</span> : null} */}
      </div>
      <div className="risk-text">{riskText}</div>
      <div className="separator" />
      <div className="status">
        <div className="risk-text">
          {"TVL: "}
          {prefix + " " + tvl + " " + suffix}
        </div>
      </div>
    </div>
  );
}

export default TrancheCard;
