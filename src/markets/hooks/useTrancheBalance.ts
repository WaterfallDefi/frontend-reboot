import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";
import BigNumber from "bignumber.js";

const BIG_TEN = new BigNumber(10);

export const useTrancheBalance = (
  network: Network,
  trancheMasterAddress: string,
  abi: any
) => {
  // const [balance, setBalance] = useState(BIG_ZERO);
  // const [invested, setInvested] = useState(BIG_ZERO);
  const [result, setResult] = useState({
    balance: "",
    MCbalance: null,
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
          MCbalance: null,
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
    if (account) fetchBalance();
  }, [account]);

  return result;
};

export const useMulticurrencyTrancheBalance = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  currencyIdx: number,
  tokenCount: number
) => {
  const preloadedArray: string[] = [];
  for (let index = 0; index < tokenCount; index++) {
    preloadedArray.push("");
  }
  const [result, setResult] = useState<{
    balance: string;
    MCbalance: string[];
    invested: string[];
  }>({
    balance: preloadedArray[0],
    MCbalance: preloadedArray,
    invested: preloadedArray,
  });
  const { account } = useWeb3React<Web3Provider>();
  const signer = getSigner();

  //TODO: refresh interval
  //   const { fastRefresh } = useRefresh();

  const trancheMasterContract = useMemo(
    () => getContract(abi, trancheMasterAddress, network, signer),
    [abi, trancheMasterAddress, network, signer]
  );
  const fetchBalance = async () => {
    try {
      const balanceOf = await trancheMasterContract.balanceOf(account);

      setResult({
        balance: balanceOf[0].map((b: any) =>
          new BigNumber(b._hex).dividedBy(BIG_TEN.pow(18)).toString()
        )[currencyIdx],
        MCbalance: balanceOf[0].map((b: any) => b._hex),
        invested: balanceOf[1].map((b: any) =>
          new BigNumber(b._hex).dividedBy(BIG_TEN.pow(18)).toString()
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (account) fetchBalance();
  }, [account]);

  return {
    balance: result.balance,
    MCbalance: result.MCbalance,
    fetchBalance: fetchBalance,
    invested: result.invested[currencyIdx],
  };
};
