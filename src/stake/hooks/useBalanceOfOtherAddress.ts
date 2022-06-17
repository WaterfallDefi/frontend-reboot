import { useCallback, useEffect, useState } from "react";
import { getContract, getSigner } from "../../hooks/getContract";
import ERC20 from "../../config/abis/WTF.json";
import { useIsBrowserTabActive } from "../../hooks/useIsBrowserTabActive";
import { Network } from "../../WaterfallDefi";
import BigNumber from "bignumber.js";
import numeral from "numeral";

const BIG_TEN = new BigNumber(10);

const useBalanceOfOtherAddress = (
  network: Network,
  address: string,
  account: string
) => {
  const [balance, setBalance] = useState("0");
  const [actualBalance, setActualBalance] = useState("0");

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

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const signer = getSigner();
    const contract = getContract(ERC20.abi, address, network, signer);
    const tokenBalance = await contract.balanceOf(account);
    const value = new BigNumber(tokenBalance.toString()).dividedBy(
      BIG_TEN.pow(18)
    );
    setBalance(numeral(value.toString()).format("0,0.[0000]"));
    setActualBalance(value.toString());
  }, [account, address, network]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, address, refreshCounter]);

  return { balance, actualBalance, fetchBalance };
};

export default useBalanceOfOtherAddress;
