import "./Footer.scss";

type Props = {};

const Footer: React.FC<Props> = ({}) => {
  return (
    <div className="footer-wrapper">
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
};

export default Footer;
