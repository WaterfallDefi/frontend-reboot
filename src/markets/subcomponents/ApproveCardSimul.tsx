import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Market } from "../../types";
import { useCheckApproveAll } from "../../hooks/useCheckApprove";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";
import { useMultiApprove } from "../hooks/useApprove";
import useInvestDirectMCSimul from "../hooks/useInvestDirectMCSimul";
import useInvestMCSimul from "../hooks/useInvestMCSimul";
import { useBalances } from "../../hooks/useBalance";
import BigNumber from "bignumber.js";
import numeral from "numeral";

type Props = {
  selectedMarket: Market;
  setSimulDeposit: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  selectTrancheIdx: number | undefined;
  remainingSimul: {
    remaining: string;
    remainingExact: string;
    depositableOrInTranche: string;
  }[];
  enabled: boolean;
  isSoldOut: boolean;
  isRedeposit?: boolean;
};

const formatNumberSeparator = (num: string) =>
  numeral(num).format("0,0.[0000]");

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

function ApproveCardSimul(props: Props) {
  const {
    selectedMarket,
    setSimulDeposit,
    setModal,
    selectTrancheIdx,
    remainingSimul,
    enabled,
    isSoldOut,
    isRedeposit,
  } = props;
  //user inputs
  const [balanceInputSimul, setBalanceInputSimul] = useState<string[]>([]);
  //state flags
  const [approved, setApproved] = useState<boolean>();
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  //web3
  const { account } = useWeb3React<Web3Provider>();
  // const wrapAvaxContract = useWrapAVAXContract();

  const network = selectedMarket.isAvax ? Network.AVAX : Network.BNB;

  //deposit hooks
  const { onCheckApproveAll } = useCheckApproveAll(
    network,
    selectedMarket.depositAssetAddresses,
    selectedMarket.address
  );

  const { onMultiApprove } = useMultiApprove(
    network,
    selectedMarket.depositAssetAddresses,
    selectedMarket.address
  );

  const { onInvestDirectMCSimul } = useInvestDirectMCSimul(
    network,
    selectedMarket.address,
    selectedMarket.abi,
    setModal
  );
  const { onInvestMCSimul } = useInvestMCSimul(
    network,
    selectedMarket.address,
    selectedMarket.abi,
    setModal
  );

  //balance hooks
  const multicurrencyBalancesWallet = useBalances(
    network,
    selectedMarket.depositAssetAddresses
  );

  //drilled in by prop
  // const multicurrencyBalanceRes = selectedMarket.depositAssetAddresses.map(
  //   (address, i) =>
  //     useMulticurrencyTrancheBalance(address, i, selectedMarket.assets.length)
  // );

  const tokenButtonColors = useMemo(
    () =>
      selectedMarket.assets.map((a) => {
        switch (a) {
          case "BUSD":
            return "#F0B90B";
          case "WAVAX":
            return "#E84142";
          default:
            return "#1579FF";
        }
      }),
    [selectedMarket.assets]
  );

  //validation texts
  const notes = [
    "When depositing senior, you will get a guaranteed fixed rate. However, your deposit will be locked in the portfolio until this maturity date is reached.",
    "When depositing mezzanine, you will get a guaranteed fixed rate. However, your deposit will be locked in the portfolio until this maturity date is reached.",
    "When you deposit Junior, you will get a variable rate. However, depending on market changes and the total APR of your portfolio, your effective APR may be lower. Make sure you fully understand the risks.",
  ];

  //use effects
  useEffect(() => {
    const checkApproved = async () => {
      const check = await onCheckApproveAll();
      setApproved(check ? true : false);
    };
    if (account && approved === undefined) checkApproved();
  }, [account, approved, onCheckApproveAll]);

  useEffect(() => {
    if (enabled) {
      setBalanceInputSimul(selectedMarket.assets.map(() => "0"));
    }
  }, [enabled, selectedMarket.assets]);

  //handlers
  const handleApprove = async () => {
    setApproveLoading(true);
    setModal({
      state: Modal.Txn,
      txn: undefined,
      status: "PENDING",
      message: "Approving",
    });
    try {
      await onMultiApprove();
      // successNotification("Approve Success", "");
      setApproved(true);
    } catch (e) {
      console.error(e);

      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "REJECTED",
        message: "Approve Fail ",
      });
    } finally {
      setApproveLoading(false);
    }
  };

  const validateTextSimul = useMemo(() => {
    const _remainings = remainingSimul.map((r) =>
      r.remainingExact.replace(/,/g, "")
    );
    const _balanceInputs = balanceInputSimul;
    const _balances = multicurrencyBalancesWallet.balances;
    const _sum: BigNumber = balanceInputSimul.reduce(
      (acc, next) => acc.plus(new BigNumber(next)),
      new BigNumber(0)
    );
    const validateTexts = _balanceInputs.map((b, i) => {
      let toReturn = ""; //falsy
      if (compareNum(b, _balances[i], true)) {
        toReturn = "Insufficient Balance";
      }
      if (compareNum(b, _remainings[i], true)) {
        toReturn = "Maximum deposit amount = {remaining}" + _remainings[i];
      }
      if (
        remainingSimul[i].depositableOrInTranche === "inTranche" &&
        compareNum(_sum.toString(), _remainings[i], true)
      ) {
        toReturn = "Total deposit amount exceeds tranche allowance";
      }
      return toReturn;
    });
    return validateTexts;
  }, [remainingSimul, balanceInputSimul, multicurrencyBalancesWallet]);

  // const handleWrapAvax = async () => {
  //   setDepositLoading(true);
  //   const amount = balanceInput.toString();
  //   if (data.wrapAvax && Number(balance) < Number(amount)) {
  //     //^ breaking this case will never happen but just for safety
  //     await wrapAvaxContract.deposit({
  //       value: parseEther((Number(amount) - Number(balance)).toString()),
  //     });
  //     setDepositLoading(false);
  //   }
  // };

  const handleDepositSimul = async () => {
    const _invalids: boolean[] =
      validateTextSimul &&
      validateTextSimul.map((v) => (v ? v.length > 0 : false));
    if (_invalids.some((v) => v)) return;
    const _invalids2: boolean[] = balanceInputSimul.map((b) => Number(b) < 0);
    if (_invalids2.some((v) => v)) return;
    if (selectTrancheIdx === undefined) return;

    setDepositLoading(true);
    setModal({
      state: Modal.Txn,
      txn: undefined,
      status: "PENDING",
      message: balanceInputSimul
        .map(
          (b, i) =>
            "Depositing " + " " + b + " " + selectedMarket.assets[i] + ", "
        )
        .join(),
    });
    const _amount = balanceInputSimul; //feels like .toString() is unnecessary if it's already typed? - 0xA
    try {
      const success = !isRedeposit
        ? await onInvestDirectMCSimul(_amount, selectTrancheIdx.toString())
        : await onInvestMCSimul(_amount, selectTrancheIdx.toString());
      if (success) {
        // successNotification("Deposit Success", "");
      } else {
        // successNotification("Deposit Fail", "");
      }
      setDepositLoading(false);
      setBalanceInputSimul([]);
      multicurrencyBalancesWallet.fetchBalances();
    } catch (e) {
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "REJECTED",
        message: "Deposit Fail ",
      });
      console.error(e);
    } finally {
      setDepositLoading(false);
    }
  };

  const handleMaxInputSimul = (index: number) => {
    const _balance = multicurrencyBalancesWallet.balances[index].replace(
      /,/g,
      ""
    );
    const _remaining = remainingSimul[index].remaining.replace(/,/g, "");
    const balanceInputSimulCopy = [...balanceInputSimul];
    if (compareNum(_remaining, _balance)) {
      if (_balance) {
        balanceInputSimulCopy[index] = _balance;
        setBalanceInputSimul(balanceInputSimulCopy);
      }
    } else if (compareNum(_balance, _remaining, true)) {
      if (_remaining) {
        if (remainingSimul[index].depositableOrInTranche === "inTranche") {
          const _sum: BigNumber = balanceInputSimulCopy.reduce(
            (acc, next, i) =>
              i !== index ? acc.plus(new BigNumber(next)) : acc,
            new BigNumber(0)
          );
          const _remainingInTranche = new BigNumber(_remaining)
            .minus(_sum)
            .toString();
          balanceInputSimulCopy[index] = _remainingInTranche;
          setBalanceInputSimul(balanceInputSimulCopy);
        } else {
          balanceInputSimulCopy[index] = _remaining;
          setBalanceInputSimul(balanceInputSimulCopy);
        }
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    asset: string,
    index: number
  ) => {
    const { value } = e.target;
    if (value.match("^[0-9]*[.]?[0-9]*$") != null) {
      const d = value.split(".");
      if (
        d.length === 2 &&
        d[1].length > (asset === "USDC" || asset === "USDC.e" ? 6 : 18)
      ) {
        return;
      }
      const _input1 = d[0].length > 1 ? d[0].replace(/^0+/, "") : d[0];
      const _decimal = value.includes(".") ? "." : "";
      const _input2 = d[1]?.length > 0 ? d[1] : "";
      const balanceInputSimulCopy = [...balanceInputSimul];
      balanceInputSimulCopy[index] = _input1 + _decimal + _input2;
      setBalanceInputSimul(balanceInputSimulCopy);
    }
  };

  const HandleDepositButton = () => (
    <div className="button">
      <button
        style={{ height: 56 }}
        onClick={handleDepositSimul}
        disabled={
          !enabled ||
          isSoldOut ||
          balanceInputSimul.length === 0 ||
          selectedMarket.isRetired
        }
      >
        Deposit
      </button>
    </div>
  );

  return (
    <div className="approve-card">
      {selectedMarket.assets.map((asset, index) => (
        <div key={asset}>
          <div style={{ marginTop: index !== 0 ? 50 : 0 }}>
            <div className="row">
              <div>
                {isRedeposit ? "Total Roll-deposit Amount" : "Wallet Balance"}
              </div>
              <div>
                {formatNumberSeparator(
                  numeral(multicurrencyBalancesWallet.balances[index]).format(
                    "0,0.[0000]"
                  )
                )}{" "}
                {asset}
              </div>
            </div>
            <div className="row">
              <div>{"Remaining:"}</div>
              <div>
                {formatNumberSeparator(remainingSimul[index].remaining)} {asset}
              </div>
            </div>
            <div className="row">
              <div>{asset}</div>
            </div>
            <input
              style={
                !depositLoading && validateTextSimul[index]
                  ? { borderColor: "red" }
                  : {}
              }
              placeholder=""
              // value={balanceInputSimul[index]}
              onChange={(e) => {
                handleInputChange(e, asset, index);
              }}
              disabled={!enabled || isSoldOut}
            />
            <div className="max" onClick={() => handleMaxInputSimul(index)}>
              MAX
            </div>
          </div>
          <div className="validate-text">
            {!depositLoading && validateTextSimul[index]}
          </div>
        </div>
      ))}
      {selectTrancheIdx && (
        <div className="important-notes">
          <div>Important Notes</div>
          <div>{selectTrancheIdx !== undefined && notes[selectTrancheIdx]}</div>
        </div>
      )}

      {account ? (
        approved ? (
          balanceInputSimul.some(
            (b, i) =>
              !compareNum(
                new BigNumber(b.toString()).minus(new BigNumber(b)).toString(),
                "0",
                true
              )
          ) ? (
            <HandleDepositButton />
          ) : (
            <div>Not enough!</div>
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
              setModal({ state: Modal.ConnectWallet });
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

export default ApproveCardSimul;
