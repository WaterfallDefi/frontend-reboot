import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import ky from "ky";
import { MarketList } from "../../config/markets";
import { multicall } from "../../hooks/getContract";

const BIG_ZERO = new BigNumber(0);
const BIG_TEN = new BigNumber(10);

const getTotalTVL = async () => {
  let _tvl = BIG_ZERO;
  // const result: any = await ky
  //   .get(
  //     "https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=binancecoin,avalanche-2,wrapped-avax,wbnb"
  //   )
  //   .json();

  // const avaxPrice = result["wrapped-avax"]?.usd;

  // const wbnbPrice = result["wbnb"]?.usd;

  await Promise.all(
    MarketList.map(async (_mkt, __id) => {
      if (_mkt.isRetired) return;
      const _marketAddress = _mkt?.address;
      const calls = [
        {
          address: _marketAddress,
          name: "tranches",
          params: [0],
        },
        {
          address: _marketAddress,
          name: "tranches",
          params: [1],
        },
        ...(_mkt.trancheCount === 3
          ? [
              {
                address: _marketAddress,
                name: "tranches",
                params: [2],
              },
            ]
          : []),
      ];

      const [t0, t1, t2] = await multicall(_mkt?.network, _mkt?.abi, calls);
      const _tranches = [t0, t1, t2];
      _tranches.forEach((_t, _i) => {
        //changed to 6 for USDC
        const _principal = _t ? new BigNumber(_t.principal?._hex).dividedBy(BIG_TEN.pow(6)) : BIG_ZERO;
        //changed to 6 for USDC
        const _autoPrincipal = _t ? new BigNumber(_t.autoPrincipal?._hex).dividedBy(BIG_TEN.pow(6)) : BIG_ZERO;
        let rate = 1;
        // if (_mkt?.assets?.includes("WAVAX")) {
        //   rate = avaxPrice;
        // }

        // if (_mkt?.assets?.includes("WBNB")) {
        //   rate = wbnbPrice;
        // }
        // const _principalInUSD = _principal.times(rate);
        const _principalInUSD = _mkt?.autorollImplemented
          ? _principal.plus(_autoPrincipal).times(rate)
          : _principal.times(rate);

        if (!_principalInUSD.isNaN()) _tvl = _tvl.plus(_principalInUSD);
      });
    })
  );
  return _tvl;
};

const useTotalTvl = () => {
  const [totalTvl, setTotalTvl] = useState("0");

  useEffect(() => {
    const fetchBalance = async () => {
      const _totalTvl = await getTotalTVL();
      setTotalTvl(_totalTvl.toFormat(0).toString());
    };
    fetchBalance();
  }, []);

  return totalTvl;
};

export default useTotalTvl;
