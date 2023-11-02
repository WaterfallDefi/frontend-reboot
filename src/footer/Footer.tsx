import { Mode } from "../Yego";
import "./Footer.scss";
// import Discord from "./svgs/Discord";
// import FooterLine from "./svgs/FooterLine";
// import Medium from "./svgs/Medium";
// import Telegram from "./svgs/Telegram";
// import Twitter from "./svgs/Twitter";

type Props = {
  mode: Mode;
};

function Footer(props: Props) {
  const { mode } = props;

  // const CONTACTS = [
  //   { Icon: Discord, link: "https://discord.gg/gS9Gda4sez" },
  //   { Icon: Telegram, link: "https://t.me/joinchat/BYZHfIJv0eRjY2I0" },
  //   { Icon: Medium, link: "https://medium.com/@" },
  //   { Icon: Twitter, link: "https://twitter.com/" },
  // ];

  return (
    <div className={"footer-wrapper " + mode}>
      <div className="content-wrapper">
        <div className="logo-footer" />
        {/* <div className="connect">
          <div>Connect:</div>
          <div>
            {CONTACTS.map(({ Icon, link }) => (
              <a key={link} href={link} style={{ marginRight: 20, color: "#FFFFFF" }}>
                <Icon />
              </a>
            ))}
          </div>
        </div> */}
        <div className="copyright">
          Copyright 2022 - 2023 <br />
          All Rights Reserved
        </div>
      </div>
    </div>
  );
}

export default Footer;
