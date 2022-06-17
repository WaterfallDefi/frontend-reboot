import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";
import BigNumber from "bignumber.js";

const BIG_TEN = new BigNumber(10);

type BalanceObject = {
  balance: string;
  invested: string;
};

type MCBalanceObject = {
  MCbalance: string[];
  MCinvested: string[];
};

export const useTrancheBalance = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  disable: boolean
) => {
  const [result, setResult] = useState<BalanceObject>({
    balance: "",
    invested: "",
  });

  const { account } = useWeb3React<Web3Provider>();

  const signer = getSigner();

  //   const { fastRefresh } = useRefresh();

  const trancheMasterContract = useMemo(
    () => getContract(abi, trancheMasterAddress, network, signer),
    [abi, trancheMasterAddress, network, signer]
  );

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await trancheMasterContract.balanceOf(account);

        setResult({
          balance: result.balance
            ? new BigNumber(result.balance?._hex)
                .dividedBy(BIG_TEN.pow(18))
                .toString()
            : "0",
          invested: result.invested
            ? new BigNumber(result.invested?._hex)
                .dividedBy(BIG_TEN.pow(18))
                .toString()
            : "0",
        });
      } catch (e) {
        console.error(e);
      }
    };
    if (account && !disable) fetchBalance();
  }, [account, disable, trancheMasterContract]);

  return result;
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
  const signer = getSigner();

  //TODO: refresh interval
  //   const { fastRefresh } = useRefresh();

  const trancheMasterContract = useMemo(
    () => getContract(abi, trancheMasterAddress, network, signer),
    [abi, trancheMasterAddress, network, signer]
  );

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceOf = await trancheMasterContract.balanceOf(account);

        setResult({
          MCbalance: balanceOf[0].map((b: any) => b._hex),
          MCinvested: balanceOf[1].map((b: any) =>
            new BigNumber(b._hex).dividedBy(BIG_TEN.pow(18)).toString()
          ),
        });
      } catch (e) {
        console.error(e);
      }
    };
    if (account && !disable) fetchBalance();
  }, [account, disable, trancheMasterContract]);

  return result;
};
