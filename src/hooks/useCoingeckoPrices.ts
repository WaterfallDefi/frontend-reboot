import ky from "ky";
import { useEffect, useState } from "react";

//stargate usdc
const getDefiLlamaStargateAPRs = async () => {
  const result = await ky
    .get("https://yields.llama.fi/chart/c24d9138-51aa-48f4-a445-7f33bf7bf5fb")
    .json()
    .then((res: any) => res);
  return result;
};

//aave v3 arbitrum usdc
const getDefiLlamaAAVEAPRs = async () => {
  const result = await ky
    .get("https://yields.llama.fi/chart/7aab7b0f-01c1-4467-bc0d-77826d870f19")
    .json()
    .then((res: any) => res);
  return result;
};

export const useDefiLlamaAPRs = () => {
  const [stgAPRs, setStgAPRs] = useState({});
  const [AAVEAPRs, setAAVEAPRs] = useState({});

  //   const { slowRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const _stg = await getDefiLlamaStargateAPRs();
      const _aave = await getDefiLlamaAAVEAPRs();
      console.log(_aave);
      setStgAPRs({ stargate: _stg });
      setAAVEAPRs({ aave: _aave });
    };
    fetchBalance();
  }, []);

  return { ...stgAPRs, ...AAVEAPRs };
};
