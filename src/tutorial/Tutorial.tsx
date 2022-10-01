import "./Tutorial.scss";

import { useState } from "react";

import { Mode } from "../WaterfallDefi";
import { ArrowLine } from "./svgs/ArrowLine";

type Props = {
  mode: Mode;
};

function Tutorial(props: Props) {
  const { mode } = props;

  return (
    <div className={"tutorial-wrapper " + mode}>
      <div className="guide-wrapper">
        <div className="row">
          <div className="col">
            <div className="img-wrapper">
              <div className="deposit img" />
            </div>
            <h2>Deposit</h2>
            <p className="desc-text">Choose the tranche that suits you and get started!</p>
          </div>
          <ArrowLine />
          <div className="col">
            <div className="img-wrapper">
              <div className="wait img" />
            </div>
            <h2>Wait</h2>
            <p className="desc-text">When all the tranches are filled, it will set off the portfolio deployment.</p>
          </div>
          <ArrowLine />
          <div className="col">
            <div className="img-wrapper">
              <div className="withdraw img" />
            </div>
            <h2>Withdraw</h2>
            <p className="desc-text">When the deployment period expires, you can claim your returns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
