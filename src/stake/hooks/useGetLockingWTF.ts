import { useEffect, useState } from "react";
import useVeWTFContract from "./useVeWTFContract";
import BigNumber from "bignumber.js";
import { useIsBrowserTabActive } from "../../hooks/useIsBrowserTabActive";
import { Network } from "../../WaterfallDefi";

const BIG_TEN = new BigNumber(10);

const useGetLockingWTF = (
  network: Network,
  account: string | null | undefined
) => {
  const [total, setTotal] = useState("");
  const [startTimestamp, setStartTimestamp] = useState("");

  const [expiryTimestamp, setExpiryTimestamp] = useState("");

  const isBrowserTabActiveRef = useIsBrowserTabActive();

  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setRefreshCounter((prev) => prev + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  const contract = useVeWTFContract(network);

  const fetchLockingWTF = async () => {
    // const result = await contract.getLockedAmount(account);
    const result = await contract.getLockData(account);
    setTotal(
      new BigNumber(result.amount._hex).dividedBy(BIG_TEN.pow(18)).toString()
    );

    setStartTimestamp(new BigNumber(result.startTimestamp._hex).toString());
    setExpiryTimestamp(new BigNumber(result.expiryTimestamp._hex).toString());
  };
  useEffect(() => {
    fetchLockingWTF();
  }, [account, refreshCounter]);

  return { total, expiryTimestamp, startTimestamp, fetchLockingWTF };
};

export default useGetLockingWTF;
