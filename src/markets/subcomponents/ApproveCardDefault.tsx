import React, { useEffect, useMemo, useState } from "react";

import BigNumber from "bignumber.js";
import { parseEther } from "ethers/lib/utils";
import numeral from "numeral";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import useBalance, { useBalances } from "../../hooks/useBalance";
import useCheckApprove from "../../hooks/useCheckApprove";
import { Market } from "../../types";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";
import useApprove from "../hooks/useApprove";
import useInvest from "../hooks/useInvest";
import useInvestDirect from "../hooks/useInvestDirect";
import useWrapAVAXContract from "../hooks/useWrapAVAX";

type Props = {
  isRedeposit: boolean;
  selectedMarket: Market;
  selectedDepositAssetIndex: number;
  setSelectedDepositAssetIndex: React.Dispatch<React.SetStateAction<number>>;
  setSimulDeposit: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
  selectTrancheIdx: number | undefined;
  redepositBalance: string | string[];
  remaining: string;
  remainingExact: string;
  enabled: boolean;
  isSoldOut: boolean;
};

const compareNum = (num1: string | number | undefined, num2: string | undefined, largerOnly = false) => {
  if (num1 === undefined) return;
  if (num2 === undefined) return;
  const _num1 = new BigNumber(num1);
  const _num2 = new BigNumber(num2);

  if (largerOnly) return _num1.comparedTo(_num2) > 0 ? true : false;
  return _num1.comparedTo(_num2) >= 0 ? true : false;
};

const formatNumberSeparator = (num: string) => numeral(num).format("0,0.[0000]");

//validation texts
const notes = [
  "When depositing senior, you will get a guaranteed fixed rate. However, your deposit will be locked in the portfolio until this maturity date is reached.",
  "When depositing mezzanine, you will get a guaranteed fixed rate. However, your deposit will be locked in the portfolio until this maturity date is reached.",
  "When you deposit Junior, you will get a variable rate. However, depending on market changes and the total APR of your portfolio, your effective APR may be lower. Make sure you fully understand the risks.",
];

function ApproveCardDefault(props: Props) {
  const {
    selectedMarket,
    selectedDepositAssetIndex,
    setSelectedDepositAssetIndex,
    setSimulDeposit,
    setModal,
    setMarkets,
    selectTrancheIdx,
    redepositBalance,
    remaining,
    remainingExact,
    enabled,
    isSoldOut,
    isRedeposit,
  } = props;

  //user inputs
  const [balanceInput, setBalanceInput] = useState<string>("0");

  //state flags
  const [approved, setApproved] = useState<boolean | undefined>();
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  //web3
  const { account } = useWeb3React<Web3Provider>();
  const wrapAvaxContract = useWrapAVAXContract();

  const network = selectedMarket.isAvax ? Network.AVAX : Network.BNB;

  //deposit hooks
  const depositAddress = !selectedMarket.isMulticurrency
    ? selectedMarket.depositAssetAddress
    : selectedMarket.depositAssetAddresses[selectedDepositAssetIndex];
  const { onCheckApprove } = useCheckApprove(network, depositAddress, selectedMarket.address);

  const { onApprove } = useApprove(
    network,
    !selectedMarket.isMulticurrency ? depositAddress : selectedMarket.depositAssetAddresses[selectedDepositAssetIndex],
    selectedMarket.address,
    setModal
  );

  const { onInvestDirect } = useInvestDirect(
    network,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.isMulticurrency ? selectedDepositAssetIndex : -1,
    selectedMarket.assets.length,
    selectedMarket.assets[0] === "USDC" || selectedMarket.assets[0] === "USDC.e",
    setModal,
    setMarkets
  );
  const { onInvest } = useInvest(
    network,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.isMulticurrency ? selectedDepositAssetIndex : -1,
    selectedMarket.assets.length,
    selectedMarket.assets[0] === "USDC" || selectedMarket.assets[0] === "USDC.e",
    setModal,
    setMarkets
  );

  const {
    balance: balanceWallet,
    fetchBalance,
    actualBalance: actualBalanceWallet,
  } = useBalance(network, depositAddress);

  const multicurrencyBalancesWallet = useBalances(network, selectedMarket.depositAssetAddresses);

  const balance = useMemo(() => {
    return !isRedeposit
      ? selectedMarket.isMulticurrency
        ? multicurrencyBalancesWallet.balances.map((mcb) => numeral(mcb).format("0,0.[0000]"))
        : numeral(balanceWallet).format("0,0.[0000]")
      : redepositBalance instanceof Array
      ? redepositBalance.map((rdb) => numeral(rdb).format("0,0.[0000]"))
      : numeral(redepositBalance).format("0,0.[0000]");
  }, [
    isRedeposit,
    selectedMarket.isMulticurrency,
    multicurrencyBalancesWallet.balances,
    balanceWallet,
    redepositBalance,
  ]);

  const tokenButtonColors = useMemo(
    () =>
      selectedMarket.assets.map((a) => {
        switch (a) {
          case "BUSD":
            return "#F0B90B";
          case "WBNB":
            return "#F0B90B";
          case "DAI.e":
            return "#F0B90B";
          case "WAVAX":
            return "#E84142";
          case "TUSD":
            return "#1579FF";
          case "USDC":
            return "#2775CA";
          default:
            return "#FFFFFF";
        }
      }),
    [selectedMarket.assets]
  );

  useEffect(() => {
    const checkApproved = async () => {
      const check = await onCheckApprove();
      setApproved(check ? true : false);
    };
    if (account) checkApproved(); //has signer
  }, [onCheckApprove, account]);

  useEffect(() => {
    setBalanceInput("0");
  }, [enabled]);

  //handlers
  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      const receipt = await onApprove();
      if (receipt.status === 1) {
        setApproved(true);
      }
    } catch (e) {
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "REJECTED",
        message: "Approve Failed: " + JSON.stringify(e),
      });
    } finally {
      setApproveLoading(false);
    }
  };

  const validateText = useMemo(() => {
    const _remaining = remainingExact.replace(/,/g, "");
    const _balanceInput = balanceInput;
    if (compareNum(_balanceInput, actualBalanceWallet, true)) {
      if (!selectedMarket.wrapAvax) return "Insufficient Balance";
    }
    if (compareNum(_balanceInput, _remaining, true)) {
      return "Maximum deposit amount = " + remaining;
    }
  }, [remaining, remainingExact, balanceInput, actualBalanceWallet, selectedMarket.wrapAvax]);

  const handleWrapAvax = async () => {
    setDepositLoading(true);
    const amount = balanceInput.toString();
    if (selectedMarket.wrapAvax && Number(balance) < Number(amount)) {
      //^ breaking this case will never happen but just for safety
      await wrapAvaxContract.deposit({
        value: parseEther((Number(amount) - Number(balance)).toString()),
      });
      setDepositLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (validateText !== undefined && validateText.length > 0) return;
    if (Number(balanceInput) <= 0) return;
    if (selectTrancheIdx === undefined) return;

    setDepositLoading(true);

    setModal({
      state: Modal.Txn,
      txn: undefined,
      status: "PENDING",
      message: "Depositing " + balanceInput + " " + selectedMarket.assets[selectedDepositAssetIndex],
    });
    const amount = balanceInput.toString();
    try {
      !isRedeposit
        ? await onInvestDirect(amount, selectTrancheIdx.toString())
        : await onInvest(amount, selectTrancheIdx.toString());
      setDepositLoading(false);
      setBalanceInput("0");
      !selectedMarket.isMulticurrency ? fetchBalance() : multicurrencyBalancesWallet.fetchBalances();
    } catch (e: any) {
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "ERROR",
        message: "Deposit Fail " + e.toString(),
      });
      console.error(e);
    } finally {
      setDepositLoading(false);
    }
  };

  const handleMaxInput = () => {
    const _balance =
      balance instanceof Array ? balance[selectedDepositAssetIndex].replace(/,/g, "") : balance.replace(/,/g, "");
    const _remaining = remainingExact.replace(/,/g, "");

    if (selectedMarket.wrapAvax) {
      if (_remaining) setBalanceInput(_remaining);
    } else {
      if (compareNum(_remaining, _balance)) {
        if (_balance) setBalanceInput(isRedeposit ? _balance : actualBalanceWallet);
      } else if (compareNum(_balance, _remaining, true)) {
        if (_remaining) setBalanceInput(_remaining);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.match("^[0-9]*[.]?[0-9]*$") != null) {
      const d = value.split(".");
      if (d.length === 2 && d[1].length > (selectedMarket.assets[0] !== "USDC" ? 18 : 6)) {
        return;
      }
      const _input1 = d[0].length > 1 ? d[0].replace(/^0+/, "") : d[0];
      const _decimal = value.includes(".") ? "." : "";
      const _input2 = d[1]?.length > 0 ? d[1] : "";

      setBalanceInput(_input1 + _decimal + _input2);
    }
  };

  const HandleDepositButton = () => (
    <div className="button">
      <button
        style={{ height: 56 }}
        onClick={handleDeposit}
        disabled={!enabled || isSoldOut || !balanceInput || selectedMarket?.isRetired}
      >
        Deposit
      </button>
    </div>
  );

  return (
    <div className="approve-card">
      <div className="row">
        <div>{isRedeposit ? "Total Roll-deposit Amount" : "Wallet Balance"}</div>
        <div>
          {formatNumberSeparator(balance instanceof Array ? balance[selectedDepositAssetIndex] : balance)}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
      </div>
      <div className="row">
        <div>Remaining</div>
        <div>
          {formatNumberSeparator(remaining)} {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
      </div>
      {selectedMarket.wrapAvax &&
      balanceInput &&
      Number(balanceInput) > 0 &&
      Number(balanceInput.toString()) - Number(balance) > 0 ? (
        <div className="row">
          <div>AVAX Wrapped On Deposit:</div>
          <div>
            {formatNumberSeparator((Number(balanceInput.toString()) - Number(balance)).toString())} AVAX to WAVAX
          </div>
        </div>
      ) : null}
      <div className="separator" />
      <div className="row">
        {selectedMarket.isMulticurrency ? (
          <div style={{ display: "flex" }}>
            {selectedMarket.assets.map((a, i) => (
              <button
                key={a}
                style={{
                  color: tokenButtonColors[i],
                  fontWeight: 400,
                  marginRight: 15,
                }}
                disabled={selectedDepositAssetIndex === i}
                onClick={() => setSelectedDepositAssetIndex(i)}
              >
                {a}
              </button>
            ))}
            <button style={{ color: "#1579FF" }} onClick={() => setSimulDeposit(true)}>
              Multi
            </button>
          </div>
        ) : (
          <div></div>
        )}
        <div style={{ color: tokenButtonColors[selectedDepositAssetIndex] }}>
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
      </div>
      <div className="input-wrapper">
        <div className="max-input" onClick={handleMaxInput}>
          <span>MAX</span>
        </div>
        <input
          type="number"
          style={!depositLoading && validateText ? { borderColor: "red" } : {}}
          placeholder=""
          step={0.1}
          min={0}
          value={balanceInput}
          onChange={handleInputChange}
          disabled={!enabled || isSoldOut}
        />
      </div>
      <div className="validate-text">{!depositLoading && validateText}</div>
      {selectedMarket.wrapAvax && Number(balanceInput.toString()) - Number(balance) > 0 ? (
        <div className="validate-text">
          Please make sure you have enough AVAX to wrap, or else the transaction will fail!
        </div>
      ) : null}
      {selectTrancheIdx !== undefined ? (
        <div className="important-notes">
          <div>Important Notes</div>
          <div className="notes-content">{notes[selectTrancheIdx]}</div>
        </div>
      ) : (
        <div className="important-notes placeholder" />
      )}

      {account ? (
        approved ? (
          !selectedMarket.wrapAvax ? (
            !compareNum(
              new BigNumber(balanceInput.toString())
                .minus(new BigNumber(balance instanceof Array ? balance[selectedDepositAssetIndex] : balance))
                .toString(),
              "0",
              true
            ) ? (
              <HandleDepositButton />
            ) : (
              <div>Not enough!</div>
            )
          ) : (
            <div className="button">
              <button
                onClick={handleWrapAvax}
                // loading={depositLoading} //reusing this flag
                disabled={selectedMarket.isRetired}
              >
                Wrap AVAX
              </button>
            </div>
          )
        ) : (
          <div className="button">
            <button onClick={() => !approveLoading && handleApprove()} disabled={selectedMarket.isRetired}>
              {!approveLoading ? "Approve" : "Approving..."}
            </button>
          </div>
        )
      ) : (
        <div className="button">
          <button
            onClick={() => {
              setModal({ state: Modal.ConnectWallet });
            }}
          >
            Connect wallet
          </button>
        </div>
      )}

      {selectTrancheIdx && enabled ? (
        <div className="redemption-fee">
          {selectTrancheIdx === 0 || (selectedMarket.trancheCount === 3 && selectTrancheIdx === 1)
            ? "Withdrawal Fee: All principal + yield of the current cycle * "
            : "Withdrawal Fee: All yield of the current cycle * "}
          <span>{selectedMarket.tranches[selectTrancheIdx].fee + "%"}</span>
        </div>
      ) : (
        <div className="redemption-fee" />
      )}
    </div>
  );
}

export default ApproveCardDefault;
