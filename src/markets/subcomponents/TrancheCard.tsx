import { BigNumber } from "bignumber.js";
import { useMemo } from "react";
import getWTFApr, { formatAllocPoint } from "../../hooks/getWtfApr";
import { useWTFPriceLP } from "../../hooks/useWtfPriceFromLP";
import { Market, Tranche } from "../../types";
import { Network } from "../../WaterfallDefi";

type Props = {
  selectedMarket: Market;
  tranche: Tranche;
  trancheIndex: number;
  coingeckoPrices: any;
};

const compareNum = (
  num1: string | number | undefined,
  num2: string | undefined,
  largerOnly = false
) => {
  if (num1 === undefined) return;
  if (num2 === undefined) return;
  const _num1 = new BigNumber(num1);
  const _num2 = new BigNumber(num2);

  if (largerOnly) return _num1.comparedTo(_num2) > 0 ? true : false;
  return _num1.comparedTo(_num2) >= 0 ? true : false;
};

function TrancheCard(props: Props) {
  const { selectedMarket, tranche, trancheIndex, coingeckoPrices } = props;
  const isSoldout = useMemo(
    () =>
      !selectedMarket.autorollImplemented
        ? compareNum(tranche.principal, tranche.target)
        : compareNum(
            new BigNumber(tranche.autoPrincipal ? tranche.autoPrincipal : "0")
              .plus(new BigNumber(tranche.principal))
              .toString(),
            tranche.target
          ),
    [tranche.principal, tranche.target, tranche.autoPrincipal]
  );

  const trancheApr = tranche.apy;
  // const wtfPrice = useWTFPrice();
  const { price: wtfPrice } = useWTFPriceLP();
  //   const { weekDistribution } = useWTF(); !!!
  // const isHide = weekDistribution.toString() !== "0" ? "visible" : "hidden";
  const isHide = selectedMarket.rewardPerBlock !== "0" ? "visible" : "hidden";

  const wtfApr = getWTFApr(
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    formatAllocPoint(
      selectedMarket.pools[trancheIndex],
      selectedMarket.totalAllocPoints
    ),
    selectedMarket.tranches[trancheIndex],
    selectedMarket.duration,
    selectedMarket.rewardPerBlock,
    wtfPrice,
    selectedMarket.assets,
    coingeckoPrices
  );

  return (
    <div className="tranche one">
      {isSoldout ? <div className="sold-out">Sold Out</div> : null}
      <div className="tranche-name">
        <div className="flex-row">
          <div className="dot" />
        </div>
        Senior
      </div>
      <div className="apr">APR 3.5%</div>
      <div className="risk-text">Low Risk; Fixed</div>
      <div className="status">
        <div className="risk-text">TVL: $1</div>
        <div className="remaining">Remaining: 1</div>
      </div>
      <div className="progress-bar"></div>
    </div>
  );
}

export default TrancheCard;
