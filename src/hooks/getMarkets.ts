import { EthersCall, Market, PORTFOLIO_STATUS, Token, Tranche } from "../types";
import BigNumber from "bignumber.js";
import { multicall } from "./getContract";
// import { getFarmsAPY } from "services/http";
import numeral from "numeral";
import ky from "ky";

const BIG_ZERO = new BigNumber(0);
const BIG_TEN = new BigNumber(10);

const getFarmsAPY = async () => {
  let response;
  try {
    response = await ky
      .get("https://supply.waterfalldefi.org/farms")
      .json()
      .then((res: any) => {
        return res;
      });
  } catch (err) {
    // Error handling here
    return;
  }
  return response;
};

const calculateJuniorAPY = (tranches: Tranche[], totalTarget: BigNumber, juniorTarget: BigNumber, decimals = 18) => {
  const juniorTVL = juniorTarget;
  tranches.forEach((_t, _i) => {
    let _apy = new BigNumber(_t.apy);
    _apy = _apy.plus(new BigNumber(100));
    _apy = _apy.dividedBy(new BigNumber(100));
    const _target = new BigNumber(_t.target);
    totalTarget = totalTarget.minus(_apy.times(_target));
  });
  totalTarget = totalTarget.dividedBy(juniorTVL);
  const result = numeral(totalTarget.minus(new BigNumber(1)).times(new BigNumber(100)).toString()).format("0,0.[00]");
  return result;
};

export const getMarkets = async (payload: Market[]) => {
  try {
    // if (!Web3.givenProvider) return;
    const _payload: Market[] = payload;
    // JSON.parse(JSON.stringify(payload));
    // const _tt1 = Date.now();
    const farmsAPYResult = await getFarmsAPY();

    const markets = await Promise.all(
      _payload.map(async (marketData, marketId) => {
        const _marketAddress = marketData.address;
        const tokenCalls = !marketData.isMulticurrency
          ? []
          : marketData.assets.map((a: string, i: number) => ({
              address: _marketAddress,
              name: "tokens",
              params: [i],
            }));
        const trancheCalls = [];
        for (let i = 0; i < marketData.trancheCount; i++) {
          trancheCalls.push({
            address: _marketAddress,
            name: "tranches",
            params: [i],
          });
        }
        const callsBasic = [
          {
            address: _marketAddress,
            name: "active",
          },
          {
            address: _marketAddress,
            name: "duration",
          },
          {
            address: _marketAddress,
            name: "actualStartAt",
          },
          {
            address: _marketAddress,
            name: "investmentWindow",
          },
          {
            address: _marketAddress,
            name: "cycle",
          },
          ...trancheCalls,
        ];
        const calls = [...callsBasic, ...tokenCalls];

        // let farmsAPY = 0;
        // if (farmsAPYResult) {
        //   for (let i = 0; i < marketData.strategyFarms.length; i++) {
        //     const sf = marketData.strategyFarms[i];
        //     if (!sf || !sf.shares || !farmsAPYResult[sf.apiKey]) continue;
        //     farmsAPY += sf.shares * farmsAPYResult[sf.apiKey];
        //   }
        // }

        const [active, duration, actualStartAt, investmentWindow, cycle, ...tranchesAndTokens] = await multicall(
          marketData.network,
          marketData.abi,
          calls
        );

        const _tranches = tranchesAndTokens.slice(0, marketData.trancheCount);
        const _tokens = tranchesAndTokens.slice(marketData.trancheCount);

        const tokenObjs = _tokens.map((t: any) => {
          return { addr: t[0], strategy: t[1], percent: t[2] };
        });
        let totalTranchesTarget = BIG_ZERO;
        let tvl = BIG_ZERO;
        let totalTarget = BIG_ZERO;
        // let expectedAPY = new BigNumber("210000000000000000").dividedBy(BIG_TEN.pow(18));
        // let expectedAPY = new BigNumber(farmsAPY);

        // expectedAPY = expectedAPY.plus(new BigNumber(1));
        const tranches: Tranche[] = [];
        const decimals = marketData.assets[0] === "USDC" ? 6 : 18;
        _tranches.forEach((_t: any, _i: number) => {
          const _target = new BigNumber(_t.target?._hex).dividedBy(BIG_TEN.pow(decimals));
          totalTarget = totalTarget.plus(_target);
        });
        // totalTarget = totalTarget.times(expectedAPY);
        _tranches.forEach((_t: any, _i: number) => {
          const _principal = _t ? new BigNumber(_t.principal?._hex).dividedBy(BIG_TEN.pow(decimals)) : BIG_ZERO;
          const _autoPrincipal = _t ? new BigNumber(_t.autoPrincipal?._hex).dividedBy(BIG_TEN.pow(decimals)) : BIG_ZERO;

          //validPercent doesn't seem to be used right now
          const _validPercent = _t ? new BigNumber(_t.validPercent?._hex).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO;

          const _fee = _t ? new BigNumber(_t.fee?._hex).dividedBy(1000) : BIG_ZERO;
          const _target = _t ? new BigNumber(_t.target?._hex).dividedBy(BIG_TEN.pow(decimals)) : BIG_ZERO;

          //BONUS: add logic to handle falls that have all variable tranches, not just 2 or 3, although why would we ever need that

          //APY isn't calculated this way anymore
          const _apy =
            _t && _i !== _tranches.length - 1
              ? new BigNumber(_t.apy?._hex).dividedBy(BIG_TEN.pow(18 - 2))
              : calculateJuniorAPY(tranches, totalTarget, _target, 18);

          totalTranchesTarget = totalTranchesTarget.plus(_target);
          tvl = marketData.autorollImplemented ? tvl.plus(_principal).plus(_autoPrincipal) : tvl.plus(_principal);
          const __t = {
            principal: _principal.toString(),
            autoPrincipal: _autoPrincipal.toString(),
            validPercent: _validPercent.toString(),
            apy: _apy.toString(),
            fee: _fee.toString(),
            target: _target.toString(),
          };
          tranches.push(__t);
        });
        const status = active[0] ? PORTFOLIO_STATUS.ACTIVE : PORTFOLIO_STATUS.PENDING;

        const originalDuration = duration.toString();
        // const hackDuration = new BigNumber(duration).plus(86400).toString();
        marketData = {
          ...marketData,
          tranches,
          tokens: tokenObjs,
          // duration: duration.toString(),
          duration: originalDuration,
          actualStartAt: actualStartAt.toString(),
          investmentWindow: investmentWindow.toString(),
          status,
          totalTranchesTarget: totalTranchesTarget.toString(),
          tvl: tvl.toString(),
          cycle: cycle.toString(),
        };
        // const _masterchefAddress = marketData.masterChefAddress;
        // const poolCalls = [];
        // for (let i = 0; i < marketData.trancheCount; i++) {
        //   poolCalls.push({
        //     address: _masterchefAddress,
        //     name: "poolInfo",
        //     params: [i],
        //   });
        // }
        // const calls2 = [
        //   {
        //     address: _masterchefAddress,
        //     name: "rewardPerBlock",
        //   },
        //   ...poolCalls,
        // ];
        // const [_rewardPerBlock, ...poolCallsResponse] = await multicall(
        //   marketData.network,
        //   marketData.masterChefAbi,
        //   calls2
        // );

        // const rewardPerBlock = new BigNumber(_rewardPerBlock[0]._hex).dividedBy(BIG_TEN.pow(18)).toString();
        // const pools: string[] = [];
        // let totalAllocPoints = BIG_ZERO;
        // const _pools = poolCallsResponse.slice(0, marketData.trancheCount);
        // _pools.forEach((_p: any, _i: any) => {
        //   const _allocPoint = _p ? new BigNumber(_p?.allocPoint._hex) : BIG_ZERO;
        //   totalAllocPoints = totalAllocPoints.plus(_allocPoint);
        //   pools.push(_allocPoint.toString());
        // });
        // const totalAllocPoints = getTotalAllocPoints(pools);
        // marketData = {
        //   ...marketData,
        //   pools,
        //   totalAllocPoints: totalAllocPoints.toString(),
        //   rewardPerBlock,
        // };
        // if (marketData.isMulticurrency) {
        //   const trancheInvestCalls = marketData.depositAssetAddresses.map((addr: string) => {
        //     const _callMap = [];
        //     for (let i = 0; i < marketData.trancheCount; i++) {
        //       _callMap.push({
        //         address: _marketAddress,
        //         name: "trancheInvest",
        //         params: [cycle[0], i, addr],
        //       });
        //     }
        //     return _callMap;
        //   });
        // const calls3 = trancheInvestCalls.reduce((acc: EthersCall[], next: EthersCall[]) => [...acc, ...next], []);
        // const trancheInvestsRes = await multicall(marketData.network, marketData.abi, calls3);
        // const trancheInvestsResUnpacked = trancheInvestsRes.map((res: BigNumber[]) => res[0]);

        // const trancheInvests = tranches.map((t: Tranche, i: number) =>
        //   tokenObjs.map((t: Token, j: number) => trancheInvestsResUnpacked[i + tranches.length * j])
        // );
        // marketData = {
        //   ...marketData,
        //   trancheInvests: trancheInvests,
        //   // trancheCount: tranches.length, ...but why would you need to?
        // };
        // }
        return marketData;
      })
    );
    return JSON.parse(JSON.stringify(markets));
  } catch (e) {
    console.error(e);
  }
};
