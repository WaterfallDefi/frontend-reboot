import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useCallback, useMemo, useState } from "react";
import useBalance from "../../hooks/useBalance";
import { StakingConfig } from "../../types";
import useGetLockingWTF from "../hooks/useGetLockingWTF";
import { Network } from "../../WaterfallDefi";
import useUnstake from "../hooks/useUnstake";
import numeral from "numeral";

type Props = {
  stakingConfig: StakingConfig;
  network: Network;
};

function UnstakeAction(props: Props) {
  const { stakingConfig, network } = props;
  const { account } = useWeb3React<Web3Provider>();
  const { balance: VeWTFBalance } = useBalance(
    network,
    stakingConfig.earningTokenAddress
  );
  const { total: lockingWTF, expiryTimestamp } = useGetLockingWTF(
    network,
    account
  );

  const [balanceInput, setBalanceInput] = useState("0");
  const [loading, setLoading] = useState(false);
  const { unstake } = useUnstake(network);

  const isExpired = useMemo(() => {
    const timeNow = Math.floor(Date.now() / 1000);
    if (expiryTimestamp === "0") return false;
    return Number(expiryTimestamp) <= timeNow;
  }, [expiryTimestamp]);

  const handleUnlock = useCallback(async () => {
    // if (validateText !== undefined && validateText.length > 0) return;
    if (!account) return;
    // if (Number(balanceInput) <= 0) return;

    setLoading(true);
    try {
      await unstake(account);
      // fetchBalance();

      setBalanceInput("0");
      // successNotification("Unstake Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [account]);
  return (
    <div className="unstake">
      <div className="label">
        <p>
          Available unlock:
          <span>
            {VeWTFBalance ? numeral(VeWTFBalance).format("0,0.[0000]") : "-"}
          </span>
        </p>
      </div>

      <div className="label" style={{ marginTop: 24 }}>
        <p>Burning veWTF</p>
        <span>{VeWTFBalance}</span>
      </div>
      <div className="label">
        <p>Receiving WTF</p>
        <span>{lockingWTF}</span>
      </div>
      <button onClick={handleUnlock} disabled={!isExpired}>
        Unlock
      </button>
    </div>
  );
}

export default UnstakeAction;
