import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
// import useRefresh from "./useRefresh";
import ky from "ky";

const getPrice = async () => {
  //BSC price
  const pancake: any = await ky
    .get(
      "https://api.pancakeswap.info/api/v2/tokens/0xd73f32833b6d5d9c8070c23e599e283a3039823c"
    )
    .json()
    .then((res) => res);
  return new BigNumber(pancake?.data?.data?.price).toFixed(2);
};

const getWTFSupply = async () => {
  let res: any;
  try {
    res = await ky
      .get("https://supply.waterfalldefi.org/")
      .json()
      .then((res) => res);
  } catch (err) {
    // Error handling here
    return;
  }
  return res;
};

export const useWTFPriceLP = () => {
  const [price, setPrice] = useState("");
  const [marketCap, setMarketCap] = useState("");
  //   const { slowRefresh } = useRefresh(); figure this out later
  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getPrice();
      setPrice(price);

      const supply = await getWTFSupply();

      setMarketCap(new BigNumber(supply).times(price).toFormat(0).toString());
    };
    fetchPrice();
  }, []);

  return { price, marketCap };
};
