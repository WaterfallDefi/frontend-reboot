import ky from "ky";
import { useEffect, useState } from "react";

const getDefiLlamaStargateAPRs = async () => {
  const result = await ky
    .get("https://yields.llama.fi/chart/c24d9138-51aa-48f4-a445-7f33bf7bf5fb")
    .json()
    .then((res: any) => res);
  return result;
};

export const useDefiLlamaAPRs = () => {
  const [prices, setPrices] = useState({});

  //   const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const _prices = await getDefiLlamaStargateAPRs();
      setPrices({ stargate: _prices });
    };
    fetchBalance();
  }, []);

  return prices;
};
