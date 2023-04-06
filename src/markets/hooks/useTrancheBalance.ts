import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { getContract } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

const BIG_TEN = new BigNumber(10);

type BalanceObject = {
  balance: string;
  invested: string;
};

type MCBalanceObject = {
  MCbalance: string[];
  MCinvested: string[];
};

export const useTrancheBalance = (network: Network, trancheMasterAddress: string, abi: any, disable: boolean) => {
  const [result, setResult] = useState<BalanceObject>({
    balance: "",
    invested: "",
  });

  const { account } = useWeb3React<Web3Provider>();

  //   const { fastRefresh } = useRefresh();

  const fetchBalance = useCallback(async () => {
    try {
      const trancheMasterContract = await getContract(abi, trancheMasterAddress, network);
      const result = await trancheMasterContract.balanceOf(account);

      setResult({
        //changed to 6 decimal places instead of 18 for USDC
        balance: result.balance ? new BigNumber(result.balance?._hex).dividedBy(BIG_TEN.pow(6)).toString() : "0",
        //don't need invested for now
        //changed to 6 decimal places instead of 18 for USDC
        invested: result.invested ? new BigNumber(result.invested?._hex).dividedBy(BIG_TEN.pow(6)).toString() : "0",
      });
    } catch (e) {
      console.error(e);
    }
  }, [abi, account, network, trancheMasterAddress]);

  useEffect(() => {
    if (account && !disable) fetchBalance();
  }, [account, disable, fetchBalance]);

  return { balance: result.balance, invested: result.invested, fetchBalance };
};

export const useMulticurrencyTrancheBalance = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  tokenCount: number,
  disable: boolean
) => {
  const preloadedArray: string[] = [];
  for (let index = 0; index < tokenCount; index++) {
    preloadedArray.push("");
  }
  const [result, setResult] = useState<MCBalanceObject>({
    MCbalance: preloadedArray,
    MCinvested: preloadedArray,
  });

  const { account } = useWeb3React<Web3Provider>();

  //TODO: refresh interval
  //   const { fastRefresh } = useRefresh();

  const fetchMCBalance = useCallback(async () => {
    try {
      const trancheMasterContract = await getContract(abi, trancheMasterAddress, network);
      const balanceOf = await trancheMasterContract.balanceOf(account);

      setResult({
        MCbalance: balanceOf[0].map((b: any) => b._hex),
        MCinvested: balanceOf[1].map((b: any) => new BigNumber(b._hex).dividedBy(BIG_TEN.pow(18)).toString()),
      });
    } catch (e) {
      console.error(e);
    }
  }, [abi, account, network, trancheMasterAddress]);

  useEffect(() => {
    if (account && !disable) fetchMCBalance();
  }, [account, disable, fetchMCBalance]);

  return { MCbalance: result.MCbalance, MCinvested: result.MCinvested, fetchMCBalance };
};
