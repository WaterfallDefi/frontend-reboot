import ky from "ky";

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

//FOR HISTORICAL PERFORMANCE
export const fetchSingleSubgraphCycleQuery = async (subgraphURL: string) => {
  return await getSubgraphCyclesOnly(subgraphURL);
};
