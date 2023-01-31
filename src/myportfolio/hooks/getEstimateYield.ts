import BigNumber from "bignumber.js";
import numeral from "numeral";

export const getEstimateYield = (
  principal: string,
  trancheAPY: string,
  // startAt: number,
  isActiveCycle: boolean
) => {
  if (isActiveCycle) {
    const now = Math.floor(Date.now() / 1000);
    const duration =
      now -
      // startAt;
      86400; //number of seconds in a day

    const secondsInYear = 60 * 60 * 24 * 365;
    const _yield = new BigNumber(principal)
      .times(new BigNumber(trancheAPY))
      .dividedBy(100)
      .times(duration)
      .dividedBy(secondsInYear)
      .toString();
    const num = numeral(_yield).format("0,0.[000000]");
    return num !== "NaN" ? num : "0";
  } else return "0";
};
