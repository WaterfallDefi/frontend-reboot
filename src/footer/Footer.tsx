import { Mode } from "../WaterfallDefi";
import "./Footer.scss";

type Props = {
  mode: Mode;
};

function Footer(props: Props) {
  const { mode } = props;

  return (
    <div className={"footer-wrapper " + mode}>
      <div className="content-wrapper">
        <div className="logo-footer"></div>
        <div className="connect">
          <div>Connect</div>
          <div>0xAngel@waterfalldefi.org</div>
        </div>
        <div className="copyright">Copyright 2022 - 2023</div>
        <div className="footer-line" />
      </div>
    </div>
  );
}

export default Footer;
