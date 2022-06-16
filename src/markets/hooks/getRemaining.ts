import { BigNumber } from "bignumber.js";
import numeral from "numeral";

const compareNum = (
  num1: string | number | undefined,
  num2: string | undefined,
  largerOnly = false
) => {
  if (num1 === undefined) return;
  if (num2 === undefined) return;
  const _num1 = new BigNumber(num1);
  const _num2 = new BigNumber(num2);

  if (largerOnly) return _num1.comparedTo(_num2) > 0 ? true : false;
  return _num1.comparedTo(_num2) >= 0 ? true : false;
};

const getRemaining = (
  target: string | undefined,
  principal: string | undefined,
  decimals = 18
) => {
  if (target === undefined) return { remaining: "", remainingExact: "" };
  if (principal === undefined) return { remaining: "", remainingExact: "" };

  const _target = new BigNumber(target);
  const _principal = new BigNumber(principal);

  const result = _target.minus(_principal);

  return {
    remaining: numeral(result.toFormat(4).toString()).format("0,0.[0000]"),
    remainingExact: result.toFormat(18).toString(),
  };
};
export const getRemainingMulticurrency = (
  target: string | undefined,
  principal: string | undefined,
  remainingDepositable: BigNumber,
  decimals = 18
) => {
  if (target === undefined)
    return { remaining: "", remainingExact: "", depositableOrInTranche: "" };
  if (principal === undefined)
    return { remaining: "", remainingExact: "", depositableOrInTranche: "" };

  const _target = new BigNumber(target);
  const _principal = new BigNumber(principal);
  const _remainingDepositable = remainingDepositable;

  const remainingInTranche = _target.minus(_principal);
  const depositableOrInTranche = compareNum(
    remainingInTranche.toString(),
    _remainingDepositable.toString()
  )
    ? "depositable"
    : "inTranche";
  const result = compareNum(
    remainingInTranche.toString(),
    _remainingDepositable.toString()
  )
    ? _remainingDepositable
    : remainingInTranche;

  return {
    remaining: numeral(result.toFormat(4).toString()).format("0,0.[0000]"),
    remainingExact: result.toFormat(decimals).toString(),
    depositableOrInTranche: depositableOrInTranche,
  };
};

export default getRemaining;
