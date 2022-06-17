import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useMemo, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Market } from "../../types";
import useWrapAVAXContract from "../hooks/useWrapAVAX";
import useCheckApprove from "../../hooks/useCheckApprove";
import { Network } from "../../WaterfallDefi";
import useApprove from "../hooks/useApprove";
import useInvestDirect from "../hooks/useInvestDirect";
import useInvest from "../hooks/useInvest";
import useBalance, { useBalances } from "../../hooks/useBalance";
import numeral from "numeral";
import BigNumber from "bignumber.js";
import { parseEther } from "ethers/lib/utils";

type Props = {
  selectedMarket: Market;
  selectedDepositAssetIndex: number;
  setSelectedDepositAssetIndex: React.Dispatch<React.SetStateAction<number>>;
  setSimulDeposit: React.Dispatch<React.SetStateAction<boolean>>;
  setConnectWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectTrancheIdx: number | undefined;
  redepositBalance: string | string[];
  remaining: string;
  remainingExact: string;
  enabled: boolean;
  isSoldOut: boolean;
  isRedeposit?: boolean;
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

const formatNumberSeparator = (num: string) =>
  numeral(num).format("0,0.[0000]");

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
    setConnectWalletModalOpen,
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
  const { onCheckApprove } = useCheckApprove(
    network,
    depositAddress,
    selectedMarket.address
  );

  const { onApprove } = useApprove(
    network,
    !selectedMarket.isMulticurrency
      ? depositAddress
      : selectedMarket.depositAssetAddresses[selectedDepositAssetIndex],
    selectedMarket.address
  );

  const { onInvestDirect } = useInvestDirect(
    network,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.isMulticurrency ? selectedDepositAssetIndex : -1,
    selectedMarket.assets.length,
    selectedMarket.assets[0] === "USDC" || selectedMarket.assets[0] === "USDC.e"
  );
  const { onInvest } = useInvest(
    network,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.isMulticurrency ? selectedDepositAssetIndex : -1,
    selectedMarket.assets.length,
    selectedMarket.assets[0] === "USDC" || selectedMarket.assets[0] === "USDC.e"
  );

  //balance hooks
  const {
    balance: balanceWallet,
    fetchBalance,
    actualBalance: actualBalanceWallet,
  } = useBalance(network, depositAddress);

  const multicurrencyBalancesWallet = useBalances(
    network,
    selectedMarket.depositAssetAddresses
  );

  const balance =
    isRedeposit === undefined
      ? selectedMarket.isMulticurrency
        ? multicurrencyBalancesWallet.balances.map((mcb) =>
            numeral(mcb).format("0,0.[0000]")
          )
        : numeral(balanceWallet).format("0,0.[0000]")
      : redepositBalance instanceof Array
      ? redepositBalance.map((rdb) => numeral(rdb).format("0,0.[0000]"))
      : numeral(redepositBalance).format("0,0.[0000]");

  const tokenButtonColors = useMemo(
    () =>
      selectedMarket.assets.map((a) => {
        switch (a) {
          case "BUSD":
            return "#F0B90B";
          case "WAVAX":
            return "#E84142";
          case "TUSD":
            return "#1579FF";
          default:
            return "#000000";
        }
      }),
    [selectedMarket.assets]
  );

  //use effects
  useEffect(() => {
    const checkApproved = async () => {
      const check = await onCheckApprove();
      setApproved(check ? true : false);
    };
    if (account && approved === undefined) checkApproved(); //has signer
  }, [onCheckApprove, account, approved]);

  useEffect(() => {
    setBalanceInput("0");
  }, [enabled]);

  //handlers
  const handleApprove = async () => {
    setApproveLoading(true);
    // dispatch(
    //   setConfirmModal({
    //     isOpen: true,
    //     txn: undefined,
    //     status: "PENDING",
    //     pendingMessage: intl.formatMessage({ defaultMessage: "Approving " }),
    //   })
    // );
    try {
      await onApprove();
      // successNotification("Approve Success", "");
      setApproved(true);
    } catch (e) {
      console.error(e);

      // dispatch(
      //   setConfirmModal({
      //     isOpen: true,
      //     txn: undefined,
      //     status: "REJECTED",
      //     pendingMessage: intl.formatMessage({
      //       defaultMessage: "Approve Fail ",
      //     }),
      //   })
      // );
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
  }, [
    remaining,
    remainingExact,
    balanceInput,
    actualBalanceWallet,
    selectedMarket.wrapAvax,
  ]);

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
    // dispatch(
    //   setConfirmModal({
    //     isOpen: true,
    //     txn: undefined,
    //     status: "PENDING",
    //     pendingMessage:
    //       intl.formatMessage({ defaultMessage: "Depositing " }) +
    //       " " +
    //       balanceInput +
    //       " " +
    //       data.assets[selectedDepositAssetIndex],
    //   })
    // );
    const amount = balanceInput.toString();
    try {
      const success = !isRedeposit
        ? await onInvestDirect(amount, selectTrancheIdx.toString())
        : await onInvest(amount, selectTrancheIdx.toString());
      if (success) {
        // successNotification("Deposit Success", "");
      } else {
        // successNotification("Deposit Fail", "");
      }
      setDepositLoading(false);
      setBalanceInput("0");
      !selectedMarket.isMulticurrency
        ? fetchBalance()
        : multicurrencyBalancesWallet.fetchBalances();
      // if (account) dispatch(getTrancheBalance({ account }));
    } catch (e) {
      // dispatch(
      //   setConfirmModal({
      //     isOpen: true,
      //     txn: undefined,
      //     status: "REJECTED",
      //     pendingMessage: intl.formatMessage({
      //       defaultMessage: "Deposit Fail ",
      //     }),
      //   })
      // );
      // successNotification("Deposit Fail", "");
      console.error(e);
    } finally {
      setDepositLoading(false);
    }
  };

  const handleMaxInput = () => {
    const _balance =
      balance instanceof Array
        ? balance[selectedDepositAssetIndex].replace(/,/g, "")
        : balance.replace(/,/g, "");
    const _remaining = remainingExact.replace(/,/g, "");
    if (selectedMarket.wrapAvax) {
      if (_remaining) setBalanceInput(_remaining);
    } else {
      if (compareNum(_remaining, _balance)) {
        if (_balance) setBalanceInput(_balance);
      } else if (compareNum(_balance, _remaining, true)) {
        if (_remaining) setBalanceInput(_remaining);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.match("^[0-9]*[.]?[0-9]*$") != null) {
      const d = value.split(".");
      if (
        d.length === 2 &&
        d[1].length > (selectedMarket.assets[0] !== "USDC" ? 18 : 6)
      ) {
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
        disabled={
          !enabled || isSoldOut || !balanceInput || selectedMarket?.isRetired
        }
      >
        Deposit
      </button>
    </div>
  );

  return (
    <div className="approve-card">
      <div className="row">
        <div>
          {isRedeposit ? "Total Roll-deposit Amount" : "Wallet Balance"}
        </div>
        <div>
          {formatNumberSeparator(
            balance instanceof Array
              ? balance[selectedDepositAssetIndex]
              : balance
          )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
      </div>
      <div className="row">
        <div>Remaining</div>
        <div>
          {formatNumberSeparator(remaining)}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
      </div>
      {selectedMarket.wrapAvax &&
      balanceInput &&
      Number(balanceInput) > 0 &&
      Number(balanceInput.toString()) - Number(balance) > 0 ? (
        <div className="row">
          <div>AVAX Wrapped On Deposit:</div>
          <div>
            {formatNumberSeparator(
              (Number(balanceInput.toString()) - Number(balance)).toString()
            )}{" "}
            AVAX to WAVAX
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
            <button
              style={{ color: "#1579FF" }}
              onClick={() => setSimulDeposit(true)}
            >
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
      <div className="max-input" onClick={handleMaxInput}>
        MAX
      </div>
      <div className="validate-text">{!depositLoading && validateText}</div>
      {selectedMarket.wrapAvax &&
      Number(balanceInput.toString()) - Number(balance) > 0 ? (
        <div className="validate-text">
          Please make sure you have enough AVAX to wrap, or else the transaction
          will fail!
        </div>
      ) : null}
      {selectTrancheIdx && (
        <div className="important-notes">
          <div>Important Notes</div>
          <div>{selectTrancheIdx !== undefined && notes[selectTrancheIdx]}</div>
        </div>
      )}

      {account ? (
        approved ? (
          !selectedMarket.wrapAvax ? (
            !compareNum(
              new BigNumber(balanceInput.toString())
                .minus(
                  new BigNumber(
                    balance instanceof Array
                      ? balance[selectedDepositAssetIndex]
                      : balance
                  )
                )
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
            <button
              onClick={handleApprove}
              // loading={approveLoading}
              disabled={selectedMarket.isRetired}
            >
              Approve
            </button>
          </div>
        )
      ) : (
        <div className="button">
          <button
            onClick={() => {
              setConnectWalletModalOpen(true);
            }}
          >
            Connect wallet
          </button>
        </div>
      )}

      {selectTrancheIdx && enabled && (
        <div className="redemption-fee">
          {selectTrancheIdx === 0 ||
          (selectedMarket.trancheCount === 3 && selectTrancheIdx === 1)
            ? "Withdrawal Fee: All principal + yield of the current cycle * "
            : "Withdrawal Fee: All yield of the current cycle * "}
          <span>{selectedMarket.tranches[selectTrancheIdx] + "%"}</span>
        </div>
      )}
    </div>
  );
}

export default ApproveCardDefault;
