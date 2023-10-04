import ky from "ky";

//FOR HISTORICAL PERFORMANCE
//we are going to have to extend the first: variable in this query once we go past 333 cycles (so, just shy of one year)
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
              apr
              farmTokens
              farmTokensAmt
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

//FOR HISTORICAL PERFORMANCE
export const fetchSingleSubgraphCycleQuery = async (subgraphURL: string) => {
  return await getSubgraphCyclesOnly(subgraphURL);
};
