import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import BigNumber from 'bignumber.js';
import numeral from 'numeral';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import ERC20 from '../config/abis/WTF.json';
import { Network } from '../WaterfallDefi';
import {
  getContract,
  multicall,
} from './getContract';

const BIG_TEN = new BigNumber(10);

const useBalance = (network: Network, address: string) => {
  const [balance, setBalance] = useState("0");
  const [actualBalance, setActualBalance] = useState("0");
  const { account } = useWeb3React<Web3Provider>();

  // const isBrowserTabActiveRef = useIsBrowserTabActive();

  // const [refreshCounter, setRefreshCounter] = useState<number>(0);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     if (isBrowserTabActiveRef.current) {
  //       setRefreshCounter((prev) => prev + 1);
  //     }
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, [isBrowserTabActiveRef]);

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const contract = getContract(ERC20.abi, address, network);
    const tokenBalance = await contract.balanceOf(account);
    console.log("tokenBalance");
    console.log(tokenBalance);
    const value = new BigNumber(tokenBalance.toString()).dividedBy(
      BIG_TEN.pow(18)
    );
    setBalance(numeral(value.toString()).format("0,0.[0000]"));
    setActualBalance(value.toString());
  }, [account, address, network]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, address]);

  return { balance, fetchBalance, actualBalance };
};

export const useBalances = (network: Network, addresses: string[]) => {
  const [balances, setBalances] = useState<string[]>([]);
  const [actualBalances, setActualBalances] = useState<string[]>([]);
  const { account } = useWeb3React<Web3Provider>();

  // const isBrowserTabActiveRef = useIsBrowserTabActive();

  // const [refreshCounter, setRefreshCounter] = useState<number>(0);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     if (isBrowserTabActiveRef.current) {
  //       setRefreshCounter((prev) => prev + 1);
  //     }
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, [isBrowserTabActiveRef]);

  const fetchBalances = useCallback(async () => {
    if (!account) return;

    const calls = addresses.map((a) => {
      return {
        address: a,
        name: "balanceOf",
        params: [account],
      };
    });

    const [...tokenBalances] = await multicall(network, ERC20.abi, calls);

    const bignumbers = tokenBalances.map((tb: BigNumber[]) => tb[0]);

    setBalances(
      bignumbers.map((v: any) =>
        numeral(
          new BigNumber(v._hex).dividedBy(BIG_TEN.pow(18)).toString()
        ).format("0,0.[0000]")
      )
    );
    setActualBalances(
      bignumbers.map((v: any) =>
        new BigNumber(v._hex).dividedBy(BIG_TEN.pow(18)).toString()
      )
    );
  }, [account, addresses, network]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances, addresses]);

  return { balances, fetchBalances, actualBalances };
};

export default useBalance;
