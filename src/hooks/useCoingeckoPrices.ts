import ky from "ky";
import { useEffect, useState } from "react";

const getDefiLlamaStargateAPRs = async () => {
  const result = await ky
    .get("https://yields.llama.fi/chart/c24d9138-51aa-48f4-a445-7f33bf7bf5fb")
    .json()
    .then((res: any) => res);
  return result;
};

const getDefiLlamaHopAPRs = async () => {
  const result = await ky
    .get("https://yields.llama.fi/chart/9d114ae5-34df-4fa8-bdc0-62cca61f51a9")
    .json()
    .then((res: any) => res);
  return result;
};

export const useDefiLlamaAPRs = () => {
  const [stgAPRs, setStgAPRs] = useState({});
  const [hopAPRs, setHopAPRs] = useState({});

  //   const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const _stg = await getDefiLlamaStargateAPRs();
      const _hop = await getDefiLlamaHopAPRs();
      setStgAPRs({ stargate: _stg });
      setHopAPRs({ hop: _hop });
    };
    fetchBalance();
  }, []);

  return { ...stgAPRs, ...hopAPRs };
};
