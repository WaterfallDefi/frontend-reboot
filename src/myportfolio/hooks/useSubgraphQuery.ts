import BigNumber from "bignumber.js";
import ky from "ky";
import numeral from "numeral";

import { MarketList } from "../../config/markets";
import { UserInvest } from "../../types";

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

const getSubgraphQuery = async (subgraphURL: string, account: string | null | undefined) => {
  let res;
  try {
    console.log("account");
    console.log(account);
    res = await ky
      .post(subgraphURL, {
        json: {
          // removed trancheCycles from query
          // remove target from tranches
          // remove apy from tranches
          query: `{
            tranches {
              id
              cycle
              fee
            }
            userInvestedAmountAndPrincipal(orderBy: cycleForPrincipal, orderDirection: desc ,where: {owner: "${account}"}) {
              owner
              invested
              cycleForPrincipal
              principal
            }
            userInvestPendings(orderBy: cycle, orderDirection: desc ,where: { owner: "${account}" }) {
              id
              owner
              tranche
              cycle
              principal
              capital
              investAt
              harvestAt
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

    console.log("the subgraph");
    console.log(res);
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

    const _userInvests: UserInvest[] = [];

    //no more trancheCycles, its all 24 hour now
    // const _trancheCycles: { [key: string]: TrancheCycle } = {};
    let returnData = {
      userInvests: _userInvests,
    };

    const { userInvests } = _subgraphResult;

    if (userInvests) {
      for (let i = 0; i < userInvests.length; i++) {
        const { capital, cycle, harvestAt, id, investAt, owner, principal, tranche } = userInvests[i];
        // const trancheCycleId = tranche + "-" + cycle;

        //!! no more trancheCycles

        // const _farmDuration =
        //   _trancheCycles[trancheCycleId]?.endAt > +_trancheCycles[trancheCycleId]?.startAt + +Number(_duration)
        //     ? new BigNumber(_trancheCycles[trancheCycleId]?.endAt - _trancheCycles[trancheCycleId]?.startAt)
        //     : new BigNumber(_duration);
        const interest =
          //!! need to untangle this

          // new BigNumber(capital).isZero()
          //   ? new BigNumber(principal)
          //       .times(_trancheCycles[trancheCycleId]?.rate || 0)
          //       .dividedBy(BIG_TEN.pow(18))
          //       .minus(new BigNumber(principal))
          //   :
          new BigNumber(capital).minus(new BigNumber(principal));

        //!! need to untangle this

        //we should be able to calculate this without a _farmDuration since its always 24 hours
        const earningsAPY = new BigNumber(interest)
          .dividedBy(new BigNumber(principal))
          .times(new BigNumber(365 * 86400 * 100))
          // .dividedBy(new BigNumber(_trancheCycles[trancheCycleId]?.endAt - _trancheCycles[trancheCycleId]?.startAt))
          // .dividedBy(new BigNumber(_farmDuration))

          //new line of code should be:
          //++ .dividedBy(new BigNumber("duration equivalent to one day"))
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
      // trancheCycles: _trancheCycles,
    };
    historyQueryResult[marketIdx] = returnData;
  }
  return historyQueryResult;
};

//FOR HISTORICAL PERFORMANCE
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
              aprBeforeFee
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

//shouldn't be needed anymore
// export const fetchSubgraphCycleQuery = async () => {
//   const subgraphResult: any = [];
//   for (let marketIdx = 0; marketIdx < MarketList.length; marketIdx++) {
//     const p = MarketList[marketIdx];

//     const res: any = await getSubgraphCyclesOnly(p.subgraphURL);
//     subgraphResult[marketIdx] = { data: res.data, assets: p.assets };
//   }
//   return subgraphResult;
// };

export const useHistoricalAPY = async (earlierDate: string, laterDate: string) => {
  return await getAPYHourly(earlierDate, laterDate);
};

//FOR HISTORICAL PERFORMANCE
export const fetchSingleSubgraphCycleQuery = async (subgraphURL: string) => {
  return await getSubgraphCyclesOnly(subgraphURL);
};
