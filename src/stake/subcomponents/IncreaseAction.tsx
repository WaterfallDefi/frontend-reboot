import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Network } from "../../WaterfallDefi";
import { NETWORKS, StakingConfig } from "../../types";
import dayjs, { Dayjs, ManipulateType } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import useBalance from "../../hooks/useBalance";
import {
  VeWTFAddressAVAX,
  VeWTFAddressBNB,
  WTFAddressAVAX,
  WTFAddressBNB,
} from "../../config/address";
import useIncreaseLockAmount from "../hooks/useIncreaseLockAmount";
import useExtendLockTime from "../hooks/useExtendLockTime";
import useLockAndStakeWTF from "../hooks/useLockAndStakeWTF";
import useCheckApprove from "../../hooks/useCheckApprove";
import useApprove from "../../markets/hooks/useApprove";
import useCheckLocked from "../hooks/useCheckLocked";
import BigNumber from "bignumber.js";
import { getMultiplier } from "../multiplier";
import numeral from "numeral";

type Props = {
  stakingConfig: StakingConfig;
  network: Network;
  lockingWTF: string;
  expiryTimestamp: string;
  startTimestamp: string;
  fetchLockingWTF: () => void;
  fromMasterChef: boolean;
  wtfRewardsBalance?: string;
  totalVeWTF?: string;
  rewardPerBlock?: string;
  claimReward?: (
    _lockDurationIfLockNotExists: string,
    _lockDurationIfLockExists: string
  ) => Promise<void>;
};

const BIG_TEN = new BigNumber(10);
const MAX_LOCK_TIME = 63113904; //2 years
const MIN_LOCK_TIME = 7889238; //3 months

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

function IncreaseAction(props: Props) {
  const {
    stakingConfig,
    network,
    lockingWTF,
    expiryTimestamp,
    startTimestamp,
    fetchLockingWTF,
    fromMasterChef,
    wtfRewardsBalance,
    totalVeWTF,
    rewardPerBlock,
    claimReward,
  } = props;
  const { account } = useWeb3React<Web3Provider>();

  console.log("increase", network, stakingConfig);
  const [selectedValue, setSelectedValue] = useState<{
    value: number;
    unit?: ManipulateType;
  }>();
  const [datePickerValue, setDatePickerValue] = useState<Dayjs>();
  const [balanceInput, setBalanceInput] = useState("0");
  const {
    balance: wtfBalance,
    fetchBalance,
    actualBalance: actualWtfBalance,
  } = useBalance(
    network,
    network === Network.BNB
      ? WTFAddressBNB[NETWORKS.MAINNET]
      : WTFAddressAVAX[NETWORKS.MAINNET]
  );
  const { increaseLockAmount } = useIncreaseLockAmount(network);
  const { extendLockTime } = useExtendLockTime(network);
  const [approved, setApproved] = useState(false);
  const [locked, setLocked] = useState(false);
  const [resetSelect, setResetSelect] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [lockWTFRewardsLoading, setLockWTFRewardsLoading] = useState(false);
  const [increaseLockAmountLoading, setIncreaseLockAmountLoading] =
    useState(false);
  const [extendLockTimeLoading, setExtendLockTimeLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { balance: VeWTFBalance } = useBalance(
    network,
    stakingConfig.earningTokenAddress
  );

  const { lockAndStakeWTF } = useLockAndStakeWTF(network);
  const { onCheckApprove } = useCheckApprove(
    network,
    network === Network.BNB
      ? WTFAddressBNB[NETWORKS.MAINNET]
      : WTFAddressAVAX[NETWORKS.MAINNET],
    network === Network.BNB
      ? VeWTFAddressBNB[NETWORKS.MAINNET]
      : VeWTFAddressAVAX[NETWORKS.MAINNET]
  );
  const { onCheckLocked } = useCheckLocked(network);

  const { onApprove } = useApprove(
    network,
    network === Network.BNB
      ? WTFAddressBNB[NETWORKS.MAINNET]
      : WTFAddressAVAX[NETWORKS.MAINNET],
    network === Network.BNB
      ? VeWTFAddressBNB[NETWORKS.MAINNET]
      : VeWTFAddressAVAX[NETWORKS.MAINNET]
  );

  const _wtfRewardsBalance =
    wtfRewardsBalance && wtfRewardsBalance !== "0"
      ? new BigNumber(wtfRewardsBalance).dividedBy(BIG_TEN.pow(18)).toString()
      : "0";

  useEffect(() => {
    const checkApproved = async (account: string) => {
      const approved = await onCheckApprove();
      console.log("approved", approved);
      setApproved(approved ? true : false);
    };
    if (account) checkApproved(account);
  }, [account]);
  useEffect(() => {
    if (approved) {
      const checkLocked = async () => {
        const _locked = await onCheckLocked();
        setLocked(_locked);
      };
      checkLocked();
    }
  }, [approved, account]);
  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      await onApprove();
      // successNotification("Approve Success", "");
      setApproved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setApproveLoading(false);
    }
  };

  const onIncreaseLockAmount = useCallback(async () => {
    if (validateText !== undefined && validateText.length > 0) return;
    if (Number(balanceInput) <= 0) return;
    setIncreaseLockAmountLoading(true);
    try {
      await increaseLockAmount(balanceInput);
      fetchBalance();
      setBalanceInput("0");
      fetchLockingWTF();
      // successNotification("Increase Amount Success", "");

      setSelectedValue({ value: 0, unit: "M" });
      setDatePickerValue(undefined);
      setResetSelect(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIncreaseLockAmountLoading(false);
    }
  }, [balanceInput]);
  const isExpired = useMemo(() => {
    const timeNow = Math.floor(Date.now() / 1000);
    if (expiryTimestamp === "0") return false;
    return Number(expiryTimestamp) <= timeNow;
  }, [expiryTimestamp]);
  console.log("isExpired", isExpired);
  const newExpireDate = useMemo(() => {
    if (datePickerValue) {
      return datePickerValue;
    } else if (selectedValue) {
      if (expiryTimestamp === "0")
        return dayjs().add(selectedValue.value, selectedValue.unit);
      if (expiryTimestamp !== "0")
        return dayjs
          .unix(Number(expiryTimestamp))
          .add(selectedValue.value, selectedValue.unit);
    }
  }, [selectedValue, datePickerValue, expiryTimestamp]);

  const duration = useMemo(() => {
    if (!newExpireDate) return;
    const diff =
      expiryTimestamp !== "0"
        ? newExpireDate?.unix() - Number(expiryTimestamp)
        : newExpireDate?.unix() - Math.ceil(new Date().getTime() / 1000);

    // return Math.ceil(diff / 100) * 100;
    return diff;
  }, [newExpireDate]);

  const onExtendLockTime = useCallback(async () => {
    if (!duration) return;
    setExtendLockTimeLoading(true);
    try {
      // await extendLockTime(Number(expiryTimestamp) + Number(duration));
      await extendLockTime(Number(duration));
      fetchBalance();
      // successNotification("Extend Lock Time Success", "");

      setSelectedValue({ value: 0, unit: "M" });
      setDatePickerValue(undefined);
      setResetSelect(true);
    } catch (e) {
      console.error(e);
    } finally {
      setExtendLockTimeLoading(false);
    }
  }, [duration, expiryTimestamp]);

  const onConfirmLockWTFRewards = async () => {
    if (!fromMasterChef) return;
    if (!claimReward) return;
    if (!locked && !duration) return;
    console.log("A", duration, locked);
    const _duration = duration ? duration.toString() : "0";
    setLockWTFRewardsLoading(true);
    try {
      if (!locked) await claimReward(_duration, "0");
      if (locked) {
        //if expired , need to set new duration
        await claimReward("0", _duration);
      }
      // fetchBalance();
      // successNotification("Lock Rewards Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setLockWTFRewardsLoading(false);
    }
  };

  const receivedVeWTF = useMemo(() => {
    // const secondsInYear = 3600 * 24 * 365;
    if (fromMasterChef) {
      if (!wtfRewardsBalance || wtfRewardsBalance === "0") return "-";
      const _wtfRewardsBalance = new BigNumber(wtfRewardsBalance)
        .dividedBy(BIG_TEN.pow(18))
        .toString();
      if (!locked) {
        if (!duration) return "-";
        const multiplier = getMultiplier(Number(duration || 0));

        return numeral(
          (Number(_wtfRewardsBalance) * duration * multiplier) /
            100 /
            MAX_LOCK_TIME
        ).format("0,0.[0000]");
      }
      if (locked) {
        if (!expiryTimestamp) return "-";
        let total = 0;

        //calculate lockingWTF with extended duration
        if (duration) {
          const _duration =
            Number(expiryTimestamp) - Number(startTimestamp) + duration;
          const multiplier2 = getMultiplier(Number(_duration || 0));
          const _balanceInput2 = Number(lockingWTF);

          let _receivedVeWTF =
            (_balanceInput2 * _duration * multiplier2) / 100 / MAX_LOCK_TIME;
          _receivedVeWTF -= Number(VeWTFBalance);
          total += _receivedVeWTF;
        }
        const timeNow = Math.floor(Date.now() / 1000);
        const _duration =
          !duration || duration === 0
            ? Number(expiryTimestamp) - Number(timeNow)
            : Number(expiryTimestamp) - Number(timeNow) + duration;
        const multiplier = getMultiplier(Number(_duration || 0));
        const _balanceInput = Number(_wtfRewardsBalance);
        total += (_balanceInput * _duration * multiplier) / 100 / MAX_LOCK_TIME;
        return numeral(total).format("0,0.[0000]");
      }
    }
    if (!locked) {
      if (balanceInput === "0") return "-";
      if (!duration) return "-";
      const multiplier = getMultiplier(Number(duration || 0));

      return numeral(
        (Number(balanceInput) * duration * multiplier) / 100 / MAX_LOCK_TIME
      ).format("0,0.[0000]");
    }
    if (locked) {
      if (balanceInput === "0" && !duration) return "-";
      const timeNow = Math.floor(Date.now() / 1000);
      // const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(startTimestamp) : duration;
      const _duration =
        !duration || duration === 0
          ? Number(expiryTimestamp) - Number(timeNow)
          : Number(expiryTimestamp) - Number(startTimestamp) + duration;
      const _balanceInput =
        balanceInput === "0" ? Number(lockingWTF) : Number(balanceInput);
      const multiplier = getMultiplier(Number(_duration || 0));
      console.log("_balanceInput", _balanceInput, _duration, multiplier);
      let _receivedVeWTF =
        (_balanceInput * _duration * multiplier) / 100 / MAX_LOCK_TIME;
      console.log("_receivedVeWTF", _receivedVeWTF);
      if (!(!duration || duration === 0)) {
        //extend duration
        _receivedVeWTF -= Number(VeWTFBalance);
      }
      return numeral(_receivedVeWTF).format("0,0.[0000]");
    }
  }, [
    duration,
    balanceInput,
    wtfRewardsBalance,
    expiryTimestamp,
    locked,
    startTimestamp,
  ]);
  const currentAPR = useMemo(() => {
    if (!receivedVeWTF) return "";
    if (!totalVeWTF) return "";
    if (!rewardPerBlock) return "";
    if (receivedVeWTF === "0") return "-";

    let _balanceInput = balanceInput;
    if (fromMasterChef)
      _balanceInput = new BigNumber(wtfRewardsBalance || 0)
        .dividedBy(BIG_TEN.pow(18))
        .toString();

    return (
      numeral(
        new BigNumber(receivedVeWTF.replace(/,/g, ""))
          .dividedBy(totalVeWTF)
          .times(rewardPerBlock)
          .times(20 * 60 * 24 * 365 * 100)
          .dividedBy(_balanceInput !== "0" ? _balanceInput : lockingWTF)
          .toString()
      ).format("0,0.[00]") + "%"
    );
  }, [receivedVeWTF, rewardPerBlock, totalVeWTF, lockingWTF]);
  const convertRatio = useMemo(() => {
    if (!receivedVeWTF) return;
    const _receivedVeWTF = receivedVeWTF.replace(/,/g, "");
    let _balanceInput = balanceInput;
    if (fromMasterChef)
      _balanceInput = new BigNumber(wtfRewardsBalance || 0)
        .dividedBy(BIG_TEN.pow(18))
        .toString();
    console.log("convertRatio", _balanceInput);
    if (_balanceInput !== "0") {
      console.log(
        "convert ratio",
        _balanceInput,
        Number(_receivedVeWTF) / Number(_balanceInput)
      );
      return numeral(Number(_receivedVeWTF) / Number(_balanceInput)).format(
        "0,0.[0000]"
      );
    } else {
      if (locked) {
        console.log(
          "convert ratio2",
          lockingWTF,
          Number(_receivedVeWTF) / Number(lockingWTF)
        );
        return numeral(Number(_receivedVeWTF) / Number(lockingWTF)).format(
          "0,0.[0000]"
        );
      } else {
        // return numeral(Number(receivedVeWTF) / Number(balanceInput)).format("0,0.[0000]");
      }
    }
  }, [
    duration,
    balanceInput,
    wtfRewardsBalance,
    expiryTimestamp,
    locked,
    receivedVeWTF,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.match("^[0-9]*[.]?[0-9]*$") != null) {
      const d = value.split(".");
      if (d.length === 2 && d[1].length > 18) {
        return;
      }

      const _input1 = d[0].length > 1 ? d[0].replace(/^0+/, "") : d[0];
      const _decimal = value.includes(".") ? "." : "";
      const _input2 = d[1]?.length > 0 ? d[1] : "";
      setBalanceInput(_input1 + _decimal + _input2);
    }

    if (locked) {
      //reset extend lock time
      // setSelectedValue(undefined);
      setSelectedValue({ value: 0, unit: "M" });
      setDatePickerValue(undefined);
      setResetSelect(true);
    }
  };
  const resetLockTime = () => {
    setDatePickerValue(undefined);
    setResetSelect(true);
    setSelectedValue(undefined);
  };
  const handleMaxLockTime = () => {
    console.log(
      "max",
      Number(MAX_LOCK_TIME) - (Number(expiryTimestamp) - Number(startTimestamp))
    );
    console.log(startTimestamp);
    const timeNow = Math.floor(Date.now() / 1000);
    const _startTimestamp = startTimestamp !== "0" ? startTimestamp : timeNow;
    setDatePickerValue(
      dayjs.unix(Number(_startTimestamp) + Number(MAX_LOCK_TIME))
    );
    if (locked) setBalanceInput("0");
  };
  const handleMaxInput = () => {
    const _balance = actualWtfBalance.replace(/\,/g, "");
    // const _remaining = remaining.replace(/\,/g, "");
    // const input = parseFloat(_balance);

    if (_balance) setBalanceInput(_balance);
  };
  const onConfirm = useCallback(async () => {
    if (validateText !== undefined && validateText.length > 0) return;
    if (Number(balanceInput) <= 0) return;
    if (!duration) return;
    setLoading(true);
    try {
      await lockAndStakeWTF(balanceInput, duration);
      // await lockAndStakeWTF(balanceInput, 3600 * 2);
      fetchBalance();
      setLocked(true);
      setBalanceInput("0");
      // successNotification("Lock & Stake Success", "");
      setSelectedValue({ value: 0, unit: "M" });
      setDatePickerValue(undefined);
      setResetSelect(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [newExpireDate, balanceInput]);
  const validateText = useMemo(() => {
    const _balance = actualWtfBalance.replace(/\,/g, "");
    const _balanceInput = balanceInput;
    if (compareNum(_balanceInput, _balance, true)) {
      return "Insufficient Balance";
    }
  }, [wtfBalance, balanceInput]);
  const validateTextLockTime = useMemo(() => {
    if (!duration) return;
    const timeNow = Math.floor(Date.now() / 1000);
    // const _duration = !duration || duration === 0 ? Number(expiryTimestamp) - Number(timeNow) : duration;
    const _duration = duration || 0;

    const totalLockTime =
      expiryTimestamp !== "0"
        ? Number(expiryTimestamp) - Number(startTimestamp) + _duration
        : _duration;
    console.log(
      "totalLockTime",
      totalLockTime,
      startTimestamp,
      expiryTimestamp,
      duration
    );

    const _startTimestamp = startTimestamp !== "0" ? startTimestamp : timeNow;
    const maxLockDate = dayjs
      .unix(Number(_startTimestamp) + Number(MAX_LOCK_TIME))
      .format("YYYY-MM-DD HH:mm:ss");
    if (totalLockTime > MAX_LOCK_TIME)
      return `Maximum lock expiry date = ${maxLockDate} (2 Years from your initial lock date)`;

    if (duration < MIN_LOCK_TIME) return "Minimum Lock Time = 3 Months";
    if (totalLockTime < MIN_LOCK_TIME) return "Minimum Lock Time = 3 Months";

    if (
      newExpireDate &&
      expiryTimestamp !== "0" &&
      newExpireDate?.unix() < Number(expiryTimestamp)
    )
      return "Extend Lock Time has to be greater than previous expire date.";
  }, [duration, newExpireDate, account]);
  return (
    <div className="increase">
      <div className="label">
        <p>
          WTF Balance: <span>wtfBalance</span>
        </p>
        <div className="max">MAX</div>
      </div>
      <input />
      <div className="label">
        <p>WTF Reward</p>
      </div>
      <input />
      <div className="validation">validateText</div>
      <button>Increase Lock Amount</button>
      <div className="label" style={{ margin: "15px 0 10px" }}>
        <p>Lock will expire in:</p>
        {/* {expiryTimestamp !== "0" &&
              (duration
                ? dayjs.unix(Number(expiryTimestamp) + Number(duration)).format("YYYY-MM-DD HH:mm:ss")
                : dayjs.unix(Number(expiryTimestamp)).format("YYYY-MM-DD HH:mm:ss"))}
            {expiryTimestamp === "0" && newExpireDate?.format("YYYY-MM-DD")} */}
        <div style={{ display: "flex" }}>
          <div className="max" style={{ marginRight: 10 }}>
            {/* onClick={resetLockTime}> */}
            Reset
          </div>
          <div className="max">
            {/* onClick={handleMaxLockTime}> */}
            MAX
          </div>
        </div>
      </div>
      <input type="date" className="date-picker" />
      <div className="select-time-limit">
        <div className="time-limit">
          <input type="checkbox" id="3mo" />
          <span>3 Months</span>
        </div>
        <div className="time-limit">
          <input type="checkbox" id="6mo" />
          <span>6 Months</span>
        </div>
        <div className="time-limit">
          <input type="checkbox" id="1yr" />
          <span>1 Year</span>
        </div>
        <div className="time-limit">
          <input type="checkbox" id="2yr" />
          <span>2 Years</span>
        </div>
      </div>
      <button>Extend Lock Time</button>
      <button>Lock & Stake WTF</button>
      <button>Approve WTF</button>
      <button>Connect Wallet</button>
      <div className="label">
        <p>Convert Ratio</p>
        <span>convertRatio</span>
      </div>
      <div className="label">
        <p>Received veWTF</p>
        <span>receivedVeWTF</span>
      </div>
      <div className="label">
        <p>APR</p>
        <span>APR</span>
      </div>
      <button>Confirm</button>
    </div>
  );
}
export default IncreaseAction;
