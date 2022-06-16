import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useIsBrowserTabActive } from "./useIsBrowserTabActive";
import { Network } from "../WaterfallDefi";
import { getContract, getSigner } from "./getContract";
import ERC20 from "../config/abis/WTF.json";
import BigNumber from "bignumber.js";
import numeral from "numeral";

const BIG_TEN = new BigNumber(10);

const useBalance = (network: Network, address: string) => {
  const [balance, setBalance] = useState("0");
  const [actualBalance, setActualBalance] = useState("0");
  const { account, ...p } = useWeb3React<Web3Provider>();

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
  }, [account]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, address, refreshCounter]);

  return { balance, fetchBalance, actualBalance };
};

export const useBalances = (network: Network, addresses: string[]) => {
  const [balances, setBalances] = useState<string[]>([]);
  const [actualBalances, setActualBalances] = useState<string[]>([]);
  const { account, ...p } = useWeb3React<Web3Provider>();

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

  const fetchBalances = useCallback(async () => {
    if (!account) return;
    const signer = getSigner();
    const contracts = addresses.map((a) =>
      getContract(ERC20.abi, a, network, signer)
    );
    const tokenBalances = await contracts.map((c) => c.balanceOf(account));
    const values = tokenBalances.map((tb) =>
      new BigNumber(tb.toString()).dividedBy(BIG_TEN.pow(18))
    );
    setBalances(values.map((v) => numeral(v.toString()).format("0,0.[0000]")));
    setActualBalances(values.map((v) => v.toString()));
  }, [account]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances, addresses, refreshCounter]);

  return { balances, fetchBalances, actualBalances };
};

export default useBalance;
