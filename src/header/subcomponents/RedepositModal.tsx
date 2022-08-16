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
