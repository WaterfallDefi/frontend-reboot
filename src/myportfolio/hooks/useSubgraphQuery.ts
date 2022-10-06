import BigNumber from "bignumber.js";
import ky from "ky";
import numeral from "numeral";

import { MarketList } from "../../config/markets";
import { TrancheCycle, UserInvest } from "../../types";

const BIG_TEN = new BigNumber(10);

export const getAPYHourly = async (date: string, date2: string) => {
  let hourly;
  try {
    hourly = await ky
      .get(
        "https://supply.waterfalldefi.org/apys-hourly?from=" +
          date.replace("T", "%24").slice(0, -5) +
          "&to=" +
          date2.replace("T", "%24").slice(0, -5)
      )
      .json()
      .then((res) => res);
  } catch (err) {
    // Error handling here
    return;
  }
  return hourly;
};

const getSubgraphQuery = async (subgraphURL: string, account: string) => {
  let res;
  try {
    res = await ky
      .post(subgraphURL, {
        json: {
          query: `{
            trancheCycles(first:1000,orderBy: id, orderDirection: asc) {
              id
              cycle
              state
              principal
              capital
              rate
              startAt
              endAt
            }
            tranches {
              id
              cycle
              target
              apy
              fee
            }
            userInvests(orderBy: cycle, orderDirection: desc ,where: { owner: "${account}" }) {
              id
              owner
              tranche
              cycle
              principal
              capital
              investAt
              harvestAt
            }
          }`,
        },
      })
      .json();
  } catch (e) {
    console.error(e);
  }
  return res;
};

export const fetchSubgraphQuery = async (account: string | null | undefined, decimals = 18) => {
  if (!account) return [];

  const historyQueryResult: any = [];
  const subgraphResult: any = [];

  for (let marketIdx = 0; marketIdx < MarketList.length; marketIdx++) {
    const p = MarketList[marketIdx];

    const res: any = await getSubgraphQuery(p.subgraphURL, account);
    subgraphResult[marketIdx] = res.data;
  }
  if (subgraphResult.length === 0) return;
  for (let marketIdx = 0; marketIdx < subgraphResult.length; marketIdx++) {
    const _subgraphResult = subgraphResult[marketIdx];
    if (!_subgraphResult) continue;
    // const _market = markets[marketIdx];

    //all markets appear to have duration 0
    // const _duration = _market.duration || "0";
    const _duration = "0";

    const _userInvests: UserInvest[] = [];
    const _trancheCycles: { [key: string]: TrancheCycle } = {};
    let returnData = {
      userInvests: _userInvests,
      trancheCycles: _trancheCycles,
    };

    const { trancheCycles, userInvests } = _subgraphResult;
    if (trancheCycles) {
      for (let i = 0; i < trancheCycles.length; i++) {
        const { id } = trancheCycles[i];
        _trancheCycles[id] = trancheCycles[i];
      }
    }
    if (userInvests) {
      for (let i = 0; i < userInvests.length; i++) {
        const { capital, cycle, harvestAt, id, investAt, owner, principal, tranche } = userInvests[i];
        const trancheCycleId = tranche + "-" + cycle;
        const _farmDuration =
          _trancheCycles[trancheCycleId]?.endAt > +_trancheCycles[trancheCycleId]?.startAt + +Number(_duration)
            ? new BigNumber(_trancheCycles[trancheCycleId]?.endAt - _trancheCycles[trancheCycleId]?.startAt)
            : new BigNumber(_duration);
        const interest = new BigNumber(capital).isZero()
          ? new BigNumber(principal)
              .times(_trancheCycles[trancheCycleId]?.rate || 0)
              .dividedBy(BIG_TEN.pow(18))
              .minus(new BigNumber(principal))
          : new BigNumber(capital).minus(new BigNumber(principal));
        const earningsAPY = new BigNumber(interest)
          .dividedBy(new BigNumber(principal))
          .times(new BigNumber(365 * 86400 * 100))
          // .dividedBy(new BigNumber(_trancheCycles[trancheCycleId]?.endAt - _trancheCycles[trancheCycleId]?.startAt))
          .dividedBy(new BigNumber(_farmDuration)) //multi-farm
          .toFormat(2)
          .toString();
        const _ui: UserInvest = {
          capital: new BigNumber(capital).isZero()
            ? numeral(
                new BigNumber(interest)
                  .plus(new BigNumber(principal))
                  .dividedBy(BIG_TEN.pow(decimals))
                  .toFormat(4)
                  .toString()
              ).format("0,0.[0000]")
            : numeral(new BigNumber(capital).dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString()).format(
                "0,0.[0000]"
              ),
          cycle,
          harvestAt,
          id,
          investAt,
          owner,
          principal: numeral(new BigNumber(principal).dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString()).format(
            "0,0.[0000]"
          ),
          MCprincipal: [],
          tranche,
          interest: numeral(interest.dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString()).format("0,0.[0000]"),
          earningsAPY,
        };

        _userInvests.push(_ui);
      }
    }
    returnData = {
      userInvests: _userInvests,
      trancheCycles: _trancheCycles,
    };
    historyQueryResult[marketIdx] = returnData;
  }
  return historyQueryResult;
};

export const getSubgraphCyclesOnly = async (subgraphURL: string) => {
  let res;
  try {
    res = await ky
      .post(subgraphURL, {
        json: {
          query: `{
            trancheCycles(first:1000,orderBy: id, orderDirection: asc) {
              id
              cycle
              state
              principal
              capital
              rate
              startAt
              endAt
            }
          }`,
        },
      })
      .json();
  } catch (e) {
    console.error(e);
  }
  return res;
};

export const fetchSubgraphCycleQuery = async () => {
  const subgraphResult: any = [];
  for (let marketIdx = 0; marketIdx < MarketList.length; marketIdx++) {
    const p = MarketList[marketIdx];

    const res: any = await getSubgraphCyclesOnly(p.subgraphURL);
    subgraphResult[marketIdx] = { data: res.data, assets: p.assets };
  }
  return subgraphResult;
};

export const useHistoricalAPY = async (earlierDate: string, laterDate: string) => {
  return await getAPYHourly(earlierDate, laterDate);
};
