import { Market } from "../../types";
import BigNumber from "bignumber.js";
import Deposit from "../../markets/subcomponents/Deposit";
import React from "react";
import { ModalProps } from "../../WaterfallDefi";

type Props = {
  selectedMarket: Market;
  selectedDepositAssetIndex: number;
  balance: string;
  simulDeposit: boolean;
  coingeckoPrices: any;
  setSelectedDepositAssetIndex: React.Dispatch<React.SetStateAction<number>>;
  setSimulDeposit: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

const BIG_TEN = new BigNumber(10);

function RedepositModal(props: Props) {
  const {
    selectedMarket,
    selectedDepositAssetIndex,
    balance,
    simulDeposit,
    coingeckoPrices,
    setSelectedDepositAssetIndex,
    setSimulDeposit,
    setModal,
    setMarkets,
  } = props;

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

  const remainingDepositable = new BigNumber(maxDeposits[selectedDepositAssetIndex]).minus(
    deposited[selectedDepositAssetIndex]
  );

  const remainingDepositableSimul = maxDeposits.map((md, i) => new BigNumber(md).minus(deposited[i]));

  return (
    <div className="modal redeposit">
      <h1>Roll Deposit</h1>
      <Deposit
        isRedeposit={true}
        selectedMarket={selectedMarket}
        balance={balance}
        selectedDepositAssetIndex={selectedDepositAssetIndex}
        setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
        simulDeposit={simulDeposit}
        coingeckoPrices={coingeckoPrices}
        setSimulDeposit={setSimulDeposit}
        setModal={setModal}
        setMarkets={setMarkets}
      />
    </div>
  );
}

export default RedepositModal;
