import { BigNumber } from "bignumber.js";
import numeral from "numeral";
import React, { useMemo } from "react";
// import getWTFApr, { formatAllocPoint } from "../../hooks/getWtfApr";
// import { useWTFPriceLP } from "../../hooks/useWtfPriceFromLP";
import { Market, Tranche } from "../../types";

type Props = {
  selectedMarket: Market;
  selectedDepositAssetIndex: number;
  tranche: Tranche;
  trancheIndex: number;
  selected: boolean;
  setSelectTrancheIdx: React.Dispatch<React.SetStateAction<number | undefined>>;
  // coingeckoPrices: any;
  remaining: string;
  isActive: boolean;
};

const compareNum = (num1: string | number | undefined, num2: string | undefined, largerOnly = false) => {
  if (num1 === undefined) return;
  if (num2 === undefined) return;
  const _num1 = new BigNumber(num1);
  const _num2 = new BigNumber(num2);

  if (largerOnly) return _num1.comparedTo(_num2) > 0 ? true : false;
  return _num1.comparedTo(_num2) >= 0 ? true : false;
};

const getPercentage = (num: string | undefined, total: string | undefined) => {
  if (!num || !total) return "0";
  return new BigNumber(num).dividedBy(new BigNumber(total)).times(100).toFormat(2).toString();
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
    remaining,
    isActive,
  } = props;
  const isSoldout = useMemo(
    () =>
      isActive
        ? true
        : !selectedMarket.autorollImplemented
        ? compareNum(tranche.principal, tranche.target)
        : compareNum(
            new BigNumber(tranche.autoPrincipal ? tranche.autoPrincipal : "0")
              .plus(new BigNumber(tranche.principal))
              .toString(),
            Number(tranche.target).toString()
          ),
    [isActive, selectedMarket.autorollImplemented, tranche.principal, tranche.target, tranche.autoPrincipal]
  );

  const trancheApr = tranche.apy;
  // const wtfPrice = useWTFPrice();
  // const { price: wtfPrice } = useWTFPriceLP();
  //   const { weekDistribution } = useWTF(); !!!
  // const isHide = weekDistribution.toString() !== "0" ? "visible" : "hidden";
  // const isHide = selectedMarket.rewardPerBlock !== "0" ? "visible" : "hidden";

  // const wtfApr = getWTFApr(
  //   selectedMarket.network,
  //   formatAllocPoint(selectedMarket.pools[trancheIndex], selectedMarket.totalAllocPoints),
  //   selectedMarket.tranches[trancheIndex],
  //   selectedMarket.duration,
  //   selectedMarket.rewardPerBlock,
  //   wtfPrice,
  //   selectedMarket.assets,
  //   coingeckoPrices
  // );

  const tranchePrincipal: string = !selectedMarket.autorollImplemented
    ? tranche.principal
    : (Number(tranche.principal) + Number(tranche.autoPrincipal)).toString();

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
        APR {trancheApr}%{/* {isHide ? <span>+ {wtfApr}%</span> : null} */}
      </div>
      <div className="risk-text">{riskText}</div>
      <div className="separator" />
      <div className="status">
        <div className="risk-text">
          {"TVL: "}
          {prefix + " " + tvl + " " + suffix}
        </div>
        <div className="remaining">
          Remaining: {Number(remaining.replaceAll(",", "")) > 0 ? remaining : "0"}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
      </div>
      <div className="progress-bar">
        <div
          className={type}
          style={{
            width: getPercentage(tranchePrincipal, tranche.target) + "%",
          }}
        />
      </div>
    </div>
  );
}

export default TrancheCard;
