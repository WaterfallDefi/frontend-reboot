import Stakings from "../../config/staking";
import IncreaseAction from "../../stake/subcomponents/IncreaseAction";
import { ModalProps, Network } from "../../WaterfallDefi";
import React from "react";

type Props = {
  network: Network;
  balance: string;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  claimReward?: (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => Promise<void>;
};

function ClaimModal(props: Props) {
  const { network, balance, setModal, claimReward } = props;

  const stakingConfig = network === Network.BNB ? Stakings[0] : Stakings[1];

  return (
    <div className="modal claim">
      <h1>Claim</h1>
      <p>To claim your locked WTF, stake it for at least three months and increase your yield!</p>
      <IncreaseAction
        network={network}
        stakingConfig={stakingConfig}
        expiryTimestamp={"0"}
        fromMasterChef={true}
        wtfRewardsBalance={balance}
        claimReward={claimReward}
        setModal={setModal}
      />
    </div>
  );
}

export default ClaimModal;
