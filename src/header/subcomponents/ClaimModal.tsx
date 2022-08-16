import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Stakings from "../../config/staking";
import IncreaseAction from "../../stake/subcomponents/IncreaseAction";
import { Market } from "../../types";
import { ModalProps, Network } from "../../WaterfallDefi";
import { useStakingPool } from "../../stake/hooks/useStaking";
import useTotalSupply from "../../stake/hooks/useTotalSupply";
import numeral from "numeral";
import useGetLockingWTF from "../../stake/hooks/useGetLockingWTF";
import React from "react";

type Props = {
  network: Network;
  selectedMarket: Market;
  balance: string;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  claimReward?: (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => Promise<void>;
};

function ClaimModal(props: Props) {
  const { network, selectedMarket, balance, setModal, claimReward } = props;

  const { account } = useWeb3React<Web3Provider>();

  const stakingConfig = network === Network.BNB ? Stakings[0] : Stakings[1];

  const { total: lockingWTF, expiryTimestamp, startTimestamp, fetchLockingWTF } = useGetLockingWTF(network, account);

  const { rewardPerBlock } = useStakingPool(
    network,
    stakingConfig.rewardTokenAddress || "",
    stakingConfig.earningTokenAddress || "",
    account
  );

  const VeWTFTotalSupply = useTotalSupply(network, stakingConfig.earningTokenAddress);

  const _VeWTFTotalSupply = numeral(VeWTFTotalSupply).value() || 0;

  return (
    <div className="modal claim">
      <h1>Claim</h1>
      <IncreaseAction
        network={network}
        stakingConfig={stakingConfig}
        lockingWTF={lockingWTF}
        expiryTimestamp={expiryTimestamp}
        startTimestamp={startTimestamp}
        fetchLockingWTF={fetchLockingWTF}
        fromMasterChef={true}
        wtfRewardsBalance={balance}
        claimReward={claimReward}
        rewardPerBlock={rewardPerBlock}
        totalVeWTF={_VeWTFTotalSupply.toString()}
        setModal={setModal}
      />
    </div>
  );
}

export default ClaimModal;
