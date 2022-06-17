import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useCallback, useEffect, useState } from "react";
import { useIsBrowserTabActive } from "../../hooks/useIsBrowserTabActive";
import { Network } from "../../WaterfallDefi";
import { getContract, getSigner } from "../../hooks/getContract";
import ERC20 from "../../config/abis/WTF.json";
import BigNumber from "bignumber.js";
import numeral from "numeral";

const BIG_TEN = new BigNumber(10);

const formatBalance = (num: string | undefined, decimals = 18) => {
  if (!num) return "- -";
  return new BigNumber(num)
    .dividedBy(BIG_TEN.pow(decimals))
    .toFormat(4)
    .toString();
};

const useTotalSupply = (network: Network, address: string) => {
  const [totalSupply, setTotalSupply] = useState("0");
  const { account } = useWeb3React<Web3Provider>();

  const isBrowserTabActiveRef = useIsBrowserTabActive();

  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setRefreshCounter((prev) => prev + 1);
      }
    }, 50000);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const signer = getSigner();
    const contract = getContract(ERC20.abi, address, network, signer);
    const tokenBalance = await contract.totalSupply();
    const value = formatBalance(tokenBalance.toString());
    setTotalSupply(numeral(value).format("0,0.[0000]"));
  }, [account, address, network]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, address, refreshCounter]);

  return totalSupply;
};

export default useTotalSupply;
