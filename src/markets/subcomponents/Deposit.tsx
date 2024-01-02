import React, { useState } from "react";

import BigNumber from "bignumber.js";
import dayjs from "dayjs";

import { Market, PORTFOLIO_STATUS } from "../../types";
import { APYData, ModalProps } from "../../Yego";
import ApproveCardDefault from "./ApproveCardDefault";
import ApproveCardSimul from "./ApproveCardSimul";
import TrancheCard from "./TrancheCard";

const BIG_TEN = new BigNumber(10);

type Props = {
  selectedMarket: Market;
  // coingeckoPrices: any;
  selectedDepositAssetIndex: number;
  setSelectedDepositAssetIndex: React.Dispatch<React.SetStateAction<number>>;
  simulDeposit: boolean;
  setSimulDeposit: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
  balance: string | string[];
  latestAPYs: (APYData | undefined)[];
};

// const compareNum = (num1: string | number | undefined, num2: string | undefined, largerOnly = false) => {
//   if (num1 === undefined) return false; //modified, this case will never happen
//   if (num2 === undefined) return false; // ""
//   const _num1 = new BigNumber(num1);
//   const _num2 = new BigNumber(num2);

//   if (largerOnly) return _num1.comparedTo(_num2) > 0 ? true : false;
//   return _num1.comparedTo(_num2) >= 0 ? true : false;
// };

function Deposit(props: Props) {
  const {
    selectedMarket,
    // coingeckoPrices,
    selectedDepositAssetIndex,
    setSelectedDepositAssetIndex,
    simulDeposit,
    setSimulDeposit,
    setModal,
    setMarkets,
    balance,
    latestAPYs,
  } = props;

  const [selectTrancheIdx, setSelectTrancheIdx] = useState<number | undefined>(undefined);

  const deposited: BigNumber[] = [];
  const tokens = selectedMarket.tokens;
  const trancheInvest: { type: "BigNumber"; hex: string }[][] | undefined = selectedMarket.trancheInvests;
  if (trancheInvest) {
    selectedMarket.assets.forEach((a, i) =>
      deposited.push(
        trancheInvest
          .reduce((acc: BigNumber, next) => acc.plus(new BigNumber(next[i].hex.toString())), new BigNumber(0))
          .dividedBy(BIG_TEN.pow(18))
      )
    );
  }
  const maxDeposits = tokens.map((t) =>
    new BigNumber(selectedMarket.totalTranchesTarget).multipliedBy(
      new BigNumber(t.percent.hex).dividedBy(BIG_TEN.pow(5))
    )
  );

  const returnWidth = (assetIndex: number) =>
    deposited[assetIndex]
      ? deposited[assetIndex]
          .dividedBy(tokens.length > 0 ? maxDeposits[assetIndex].toString() : new BigNumber(1))
          .multipliedBy(100)
          .toString()
      : 0;
  const widths = selectedMarket.isMulticurrency ? selectedMarket.assets.map((a, i) => returnWidth(i)) : [];

  return (
    <div className="deposit dark-deposit">
      {/* {selectedMarket.status === PORTFOLIO_STATUS.ACTIVE && selectedMarket.actualStartAt && selectedMarket.duration ? ( */}
      {/* ) : null} */}
      <div className="top-bar">
        <div className="step-bar">
          <div className="step">1</div>
          <div className="step-name">Choose Tranche</div>
          <div className="line" />
          <div className="step">2</div>
          <div className="step-name">Deposit</div>
        </div>

        {selectedMarket.isMulticurrency ? (
          <div className="select-deposit-assets">
            {selectedMarket.assets.map((asset, index) => (
              <div className="select-deposit-asset" key={asset}>
                <div className="coin" style={{ backgroundImage: `url(/coins/${asset}.png)` }} />
                <div className="step-name">
                  <span className="rem-value">
                    {deposited[index].toString()} / {maxDeposits[index].toString()}
                  </span>{" "}
                  Remaining
                </div>
                <div className="remaining-depositable-outer">
                  <div className="remaining-depositable-inner" style={{ width: widths[index] + "%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="deposit-item">
        <div className={"tranches" + (selectedMarket.trancheCount === 2 ? " two-tranches" : "")}>
          {selectedMarket.tranches.map((t, i) => {
            return (
              <TrancheCard
                key={i}
                selectedMarket={selectedMarket}
                selectedDepositAssetIndex={selectedDepositAssetIndex}
                tranche={t}
                trancheIndex={i}
                selected={selectTrancheIdx === i}
                setSelectTrancheIdx={setSelectTrancheIdx}
                latestAPY={latestAPYs[i]}
              />
            );
          })}
        </div>
        {!simulDeposit ? (
          <ApproveCardDefault
            selectedMarket={selectedMarket}
            selectedDepositAssetIndex={selectedDepositAssetIndex}
            setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
            setSimulDeposit={setSimulDeposit}
            setModal={setModal}
            setMarkets={setMarkets}
            selectTrancheIdx={selectTrancheIdx}
            enabled={selectTrancheIdx !== undefined}
            isSoldOut={false}
          />
        ) : (
          <ApproveCardSimul
            selectedMarket={selectedMarket}
            setSimulDeposit={setSimulDeposit}
            setModal={setModal}
            setMarkets={setMarkets}
            selectTrancheIdx={selectTrancheIdx}
            enabled={selectTrancheIdx !== undefined}
            isSoldOut={false}
          />
        )}
      </div>
    </div>
  );
}

export default Deposit;
