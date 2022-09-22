import React from "react";
import { Modal, ModalProps } from "../../WaterfallDefi";

type Props = {
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
};

function TermsModal(props: Props) {
  const { setModal } = props;

  return (
    <div className="modal terms-of-service">
      <title className="modal-title">Terms Of Service</title>
      <section className="terms-of-service">
        <p>
          Welcome to Waterfall DeFi (<a href="https://waterfalldefi.org">https://waterfalldefi.org</a>), a
          website-hosted user interface (the “Interface” or “App”) provided by Waterfall DeFi Foundation (“we” or “us”).
          The Interface provides access to a decentralized protocol on the Binance Smart Chain (SBC) that allows
          suppliers and borrowers of certain digital assets to participate in tokenized risk management (the
          “Protocol”). This Terms of Service Agreement (the “Agreement”) is between you (referenced herein as “user” or
          “you”) and us. This Agreement explains the terms and conditions by which you may access and use the Interface.
          You must read this Agreement carefully. By accessing or using any services made available by us or one of our
          affiliates through the Interface or our mobile applications, or any other related services provided by us or
          our affiliates (collectively, the “Services”), you signify that you have read, understand, and agree to be
          bound by all of the terms and conditions contained in this Agreement (or these “Terms”). If you do not agree,
          you are not authorized to access or use the Services.
        </p>
        <h4>
          <br />
          Modification of this Agreement
        </h4>
        <p>
          We reserve the right, in our sole discretion, to modify this Agreement from time to time. If we make any
          modifications, we will notify you by updating the date at the top of the Agreement and by maintaining a
          current version of the Agreement at <a href="https://waterfalldefi.org">https://waterfalldefi.org</a>. All
          modifications will be effective when they are posted, and your continued use of the Interface will serve as
          confirmation of your acceptance of those modifications. If you do not agree with any modifications to this
          Agreement, you must immediately stop accessing and using the Interface. We encourage you to frequently review
          the Terms to ensure you understand the terms and conditions that apply to your access to, and use of, the
          Services.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <h4>
          <br />
          Eligibility
        </h4>
        <p>
          To access or use the Interface, you must be able to form a legally binding contract with us. Accordingly, you
          represent that you (i) are at least eighteen years old and have the full right, power, and authority to enter
          into and comply with the terms and conditions of this Agreement on behalf of yourself under applicable laws,
          (ii) are an individual, legal person or other organization with full legal capacity and authority to enter
          into these Terms, and (c) have not previously been suspended or removed from using the Interface. If you are
          entering into these Terms on behalf of a legal entity of which you are an employee or agent, you represent and
          warrant that you have all necessary rights and authority to bind such legal entity.
          <span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          By accessing and using the Services, you further represent that you are not on any trade or economic sanctions
          lists, such as the UN Security Council Sanctions List, designated as a “Specially Designated Nation by OFAC
          (Office of Foreign Assets Control of the U.S. Treasury Department) or placed on the U.S. Commerce Department’s
          “Denied Persons List”, or where your use of the Interface would be illegal or otherwise violate any applicable
          law. You further represent that your access and use of the Interface will fully comply with all applicable
          laws and regulations, and that you will not access or use the Interface to conduct, promote, or otherwise
          facilitate any illegal activity. We maintain the right to select our markets and jurisdictions to operate and
          may restrict or deny the Services in certain countries at our discretion.
          <span className="Apple-converted-space">&nbsp;</span>
        </p>
        <h4>
          <br />
          Proprietary Rights
        </h4>
        <p>
          We own all intellectual property and other rights, titles and interest in and to the Services and its
          contents, including (but not limited to) all source code, object code, data, information, price, charts,
          graphs, video and audio materials, software, text, images, trademarks, service marks, copyrights, patents, and
          designs used in the Interface. Unless expressly authorized by us, you may not copy, reproduce, modify, upload,
          post, transmit, collect, adapt, rent, license, sell, publish, distribute in any form or by any means, no
          matter manual or automated, or otherwise permit any third party to access or use the Interface or any of its
          contents. Provided that you are eligible, you are hereby granted a single, personal and limited license to
          access and use the Interface. This license is non-exclusive, non-transferable, and freely revocable by us at
          any time without notice or cause. Use of the Interface or its contents for any purpose not expressly permitted
          by this Agreement is strictly prohibited. Any such unauthorized use may violate copyright, patent, trademark,
          and any other applicable laws and could result in criminal or civil penalties. Unlike the Interface, the
          Protocol is comprised entirely of open-source software running on the public BSC blockchain and is not our
          proprietary property.
        </p>
        <h4>
          <br />
          Privacy
        </h4>
        <p>
          We care about your privacy. Although we will comply with all valid subpoena requests, we will carefully
          consider each request to ensure that it comports with the spirit and letter of the law, and we will not
          hesitate to challenge invalid, overbroad, or unconstitutional requests as appropriate. We use commercially
          reasonable safeguards to preserve the integrity and security of your personally identifiable information
          (“PII”) and aggregate data. However, we cannot guarantee that unauthorized third parties will never be able to
          obtain or use your PII or aggregate data for improper purposes. You acknowledge that you provide your PII and
          aggregate data at your own risk. By accessing and using the Interface, you understand and consent to our
          collection, use, and disclosure of your PII and aggregate data.
        </p>
        <h4>
          <br />
          Selling Restrictions
        </h4>
        <p>
          Citizens from the following countries will not be eligible to take part in our protocol: the United States,
          Balkans region, Belarus, Myanmar, Côte d'Ivoire, Cuba, Democratic Republic of the Congo, Iran, Iraq, Liberia,
          North Korea, People's Republic of China, Hong Kong, Sudan, Syrian Arab Republic, Zimbabwe, Algeria,
          Bangladesh, Bolivia, Cambodia, Ecuador, Nepal, Afghanistan, Burundi, Central African Republic, Malaysia,
          Ethiopia, Guinea, Guinea-Bissau, Lebanon, Sri Lanka, Libya, Serbia, Somalia, South Sudan, Tunisia, Trinidad
          and Tobago, Ukraine, Uganda, Venezuela, Yemen.
        </p>
        <h4>
          <br />
          Prohibited Activity
        </h4>
        <p>
          You agree not to engage in, or attempt to engage in, any of the following categories of prohibited activity in
          relation to your access and use of the Interface:
        </p>
        <ul>
          <li>
            Intellectual Property Infringement. Activity that infringes on or violates any copyright, trademark, service
            mark, patent, right of publicity, right of privacy, or other proprietary or intellectual property rights
            under the law.
          </li>
          <li>
            Violation of any Laws. Activity that violates or assists any party in violating any law, statute, ordinance,
            regulation or any rule of any self-regulatory or similar organisation of which you are or are required to be
            a member through your use of the Services.<span className="Apple-converted-space">&nbsp;</span>
          </li>
          <li>
            Engagement in any Illegal Activity. Activity includes but not limited to illegal gambling, money laundering,
            fraud, blackmail, extortion, ransoming data, the financing of terrorism, other violent activities or any
            prohibited market practices.<span className="Apple-converted-space">&nbsp;</span>
          </li>
          <li>
            Cyberattack. Activity that seeks to interfere with or compromise the integrity, security, or proper
            functioning of any computer, server, network, personal device, or other information technology system,
            including (but not limited to) the deployment of viruses and denial of service attacks.
          </li>
          <li>
            Fraud and Misrepresentation. Activity that seeks to defraud us or any other person or entity, including (but
            not limited to) providing any false, inaccurate, incomplete or misleading information in order to unlawfully
            obtain the property of another.
          </li>
          <li>
            Market Manipulation. Activity that violates any applicable law, rule, or regulation concerning the integrity
            of trading markets, including (but not limited to) the manipulative tactics commonly known as spoofing and
            wash trading.
          </li>
          <li>
            Any Other Unlawful Conduct. Activity that violates any applicable law, rule, or regulation of Hong Kong or
            another relevant jurisdiction, including (but not limited to) the restrictions and regulatory requirements
            imposed by Hong Kong law.
          </li>
        </ul>
        <h4>No Professional Advice</h4>
        <p>
          All information provided by the Interface is for informational purposes only and should not be construed as
          professional advice. You should not take, or refrain from taking, any action based on any information
          contained in the Interface. Before you make any financial, legal, or other decisions involving the Interface,
          you should seek independent professional advice from an individual who is licensed and qualified in the area
          for which such advice would be appropriate.
        </p>
        <p>
          <b>General Risk Disclosure Notice</b>
        </p>
        <p>
          Investing in digital asset carries a high degree of risk. A relatively small movement in the market can lead
          to a large move in value to you and this can work against you, as well as for you. It is possible to lose all
          the value of the digital asset.
        </p>
        <p>
          Even though the characteristics of each digital token vary, it is important that you understand the risks
          associated with trading in the relevant underlying market because fluctuations in the price of the underlying
          market will affect you and the profitability of your trades.{" "}
          <span className="Apple-converted-space">&nbsp;</span>
        </p>
        <h4>
          <br />
          No Warranties
        </h4>
        <p>
          The Interface is provided on an “AS IS” and “AS AVAILABLE” basis. To the fullest extent permitted by law, we
          disclaim any representations and warranties of any kind, whether express, implied, or statutory, including
          (but not limited to) the warranties of merchantability and fitness for a particular purpose. You acknowledge
          and agree that your use of the Interface is at your own risk. We do not represent or warrant that access to
          the Interface will be continuous, uninterrupted, timely, or secure; that the information contained in the
          Interface will be accurate, reliable, complete, or current; or that the Interface will be free from errors,
          defects, viruses, or other harmful elements. No advice, information, or statement that we make should be
          treated as creating any warranty concerning the Interface. Accordingly, nothing contained on this Interface
          shall be construed as providing consult or advice to you. We do not endorse, guarantee, or assume
          responsibility for any advertisements, offers, or statements made by third parties concerning the Interface.
        </p>
        <h4>
          <br />
          No Fiduciary Duties
        </h4>
        <p>
          This Agreement is not intended to, and does not, create or impose any fiduciary duties on us. To the fullest
          extent permitted by law, you acknowledge and agree that we owe no fiduciary duties or liabilities to you or
          any other party, and that to the extent any such duties or liabilities may exist at law or in equity, those
          duties and liabilities are hereby irrevocably disclaimed, waived, and eliminated. You further agree that the
          only duties and obligations that we owe you are those set out expressly in this Agreement.
        </p>
        <h4>
          <br />
          Compliance Obligations
        </h4>
        <p>
          The Interface is mainly operated from facilities within Hong Kong The Interface may not be available or
          appropriate for use in other jurisdictions. By accessing or using the Interface, you agree that you are solely
          and entirely responsible for compliance with all laws and regulations that may apply to you. You may not use
          the Interface if you are a citizen, resident, or member of any jurisdiction or group that is subject to
          economic sanctions by the United States, or if your use of the Interface would be illegal or otherwise violate
          any applicable law.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>AML and CTF Compliance</b>
        </p>
        <p>
          All activity in the Interface is subject to the laws, regulations, and rules of any applicable governmental or
          regulatory authority, including, without limitation, all applicable tax, anti-money laundering and
          counter-terrorist financing provisions. You agree and understand that by using the Service in any capacity,
          you shall act in compliance with and be legally bound by these Terms and all applicable laws and regulations,
          and failure to do so may result in the suspension of your ability to use the Services. For the avoidance of
          doubt, continue use of the Service is always conditioned on your continued compliance with these Terms and all
          applicable laws and regulations.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <h4>
          <br />
          Assumption of Risk
        </h4>
        <p>
          By accessing and using the Interface, you represent that you understand the inherent risks associated with
          using cryptographic and blockchain-based systems, and that you have a working knowledge of the usage and
          intricacies of digital assets such as bitcoin (BTC), ether (ETH), binance coin (BNB) and other digital tokens
          such as those following the BSC Token Standard (BEP-20). You further understand that the markets for these
          digital assets are highly volatile due to factors including (but not limited to) adoption, speculation,
          technology, security, and regulation. You acknowledge that the cost and speed of transacting with
          cryptographic and blockchain-based systems such as BSC are variable and may increase dramatically at any time.
          You further acknowledge the risk that your digital assets may lose some or all of their value while they are
          supplied to the Protocol. If you borrow digital assets from the Protocol, you will have to supply digital
          assets of your own as collateral. If your collateral declines in value such that it is no longer sufficient to
          secure the amount that you borrowed, others may interact with the Protocol to seize your collateral in a
          liquidation event. You further acknowledge that we are not responsible for any of these variables or risks, do
          not own or control the Protocol, and cannot be held liable for any resulting losses that you experience while
          accessing or using the Interface. Accordingly, you understand and agree to assume full responsibility for all
          of the risks of accessing and using the Interface and interacting with the Protocol.
        </p>
        <h4>
          <br />
          Third-Party Resources and Promotions
        </h4>
        <p>
          The Interface may contain references or links to third-party resources, including (but not limited to)
          information, materials, products, or services, that we do not own or control. In addition, third parties may
          offer promotions related to your access and use of the Interface. We do not endorse or assume any
          responsibility for any such resources or promotions. If you access any such resources or participate in any
          such promotions, you do so at your own risk, and you understand that this Agreement does not apply to your
          dealings or relationships with any third parties. You expressly relieve us of any and all liability arising
          from your use of any such resources or participation in any such promotions.
        </p>
        <h4>
          <br />
          Release of Claims
        </h4>
        <p>
          You expressly agree that you assume all risks in connection with your access and use of the Interface and your
          interaction with the Protocol. You further expressly waive and release us from any and all liability, claims,
          causes of action, or damages arising from or in any way relating to your use of the Interface and your
          interaction with the Protocol.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>Limitation of Liability</b>
        </p>
        <p>
          We are not liable to you for claims, costs, losses or damages caused by an event that is beyond our reasonable
          control (e.g. the acts or omissions of third parties, natural disasters, emergency conditions, government
          actions, equipment or communications malfunction). We are not liable for special, incidental, exemplary,
          punitive or consequential losses or damages of any kind.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          Our total liability for any claim arising out of or relating to these Terms or our Services, regardless of the
          form of the action, is limited to the amount paid, if any, by you to access or use our Services. The
          limitation set forth in this section will not limit or exclude liability for gross negligence, fraud or
          intentional misconduct of us or for any other matters in which liability cannot be excluded or limit under
          applicable law. Additionally, some jurisdictions do not allow the exclusion or limitation or incidental or
          consequential damages, so the above limitations or exclusions may not apply to you.
          <span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>Taxation</b>
        </p>
        <p>
          You undertake to pay all your taxes and duties, which can be resulted from the use of the Services and shall
          be paid according to your state of residence regulations. We are not responsible for any violation made by you
          due to your obligation to calculate and pay taxes and duties.
          <span className="Apple-converted-space">&nbsp;</span>
        </p>
        <h4>
          <br />
          Indemnity
        </h4>
        <p>
          You agree to hold harmless, release, defend, and indemnify us and our officers, directors, employees,
          contractors, agents, affiliates, and subsidiaries from and against all claims, damages, obligations, losses,
          liabilities, costs, and expenses arising from: (a) your access and use of the Interface; (b) your violation of
          any term or condition of this Agreement, the right of any third party, or any other applicable law, rule, or
          regulation; and (c) any other party’s access and use of the Interface with your assistance or using any device
          or account that you own or control.
        </p>
        <p>
          Under no circumstances shall we or any of our officers, directors, employees, contractors, agents, affiliates,
          or subsidiaries be liable to you for any indirect, punitive, incidental, special, consequential, or exemplary
          damages, including(but not limited to) damages for loss of profits, goodwill, use, data, or other intangible
          property, arising out of or relating to any access or use of the Interface, nor will we be responsible for any
          damage, loss, or injury resulting from hacking, tampering, or other unauthorized access or use of the
          Interface or the information contained within it.
        </p>
        <p>We assume no liability or responsibility for any:</p>
        <ul>
          <li>Errors, mistakes, or inaccuracies of content;</li>
          <li>
            Personal injury or property damage, of any nature whatsoever, resulting from any access or use of the
            Interface;
          </li>
          <li>
            Unauthorized access or use of any secure server or database in our control, or the use of any information or
            data stored therein;
          </li>
          <li>Interruption or cessation of function related to the Interface;</li>
          <li>Bugs, viruses, trojan horses, or the like that may be transmitted to or through the Interface;</li>
          <li>
            Errors or omissions in, or loss or damage incurred as a result of the use of, any content made available
            through the Interface;
          </li>
          <li>
            The defamatory, offensive, or illegal conduct of any third party. Under no circumstances shall we or any of
            our officers, directors, employees, contractors, agents, affiliates, or subsidiaries be liable to you for
            any claims, proceedings, liabilities, obligations, damages, losses, or costs in an amount exceeding the
            amount you paid to us in exchange for access to and use of the Interface, or $100.00, whichever is greater.
            This limitation of liability applies regardless of whether the alleged liability is based on contract, tort,
            negligence, strict liability, or any other basis, and even if we have been advised of the possibility of
            such liability. Some jurisdictions do not allow the exclusion of certain warranties or the limitation or
            exclusion of certain liabilities and damages. Accordingly, some of the disclaimers and limitations set forth
            in this Agreement may not apply to you. This limitation of liability shall apply to the fullest extent
            permitted by law.
          </li>
        </ul>
        <p>
          <b>
            Remedies for Breach of Terms<span className="Apple-converted-space">&nbsp;</span>
          </b>
        </p>
        <p>
          We reserves the right to seek all remedies available at law and inequity for violations of these Terms,
          including without limitation, the right to restrict, suspend or terminate your account or deny you access to
          the Services without notice; and we shall be entitled to disclose information (including, but not limited to,
          your user identity and personal details) when cooperating with law enforcement enquires (whether or not such
          enquiries are mandatory under applicable law) or where permitted under or otherwise comply with applicable
          law.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>Network Control</b>
        </p>
        <p>
          We do not own or control any of the underlying software through which blockchain networks are formed and
          digital asset are created and transacted. In general, the underlying software for blockchain networks tends to
          be open source such that anyone can use, copy, modify, and distribute it. By using any of the Services, you
          understand and acknowledge that we are not responsible for the operation of the underlying software and
          networks that support cryptocurrencies and that we make no guarantee of functionality, security, or
          availability of such software and networks.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>Confidentiality</b>
        </p>
        <p>
          You undertake not to disclose to any person or person any Confidential Information that you may acquire in the
          course of your use of the Services. For the purposes of these Terms, “Confidential Information” shall mean any
          written information (including information provided in electronic form) or oral information which is
          confidential or a trade secret or proprietary and which is clearly identified as confidential at the time of
          disclosure or would be assumed by a reasonable person to be confidential under the circumstances surrounding
          the disclosure. Notwithstanding the foregoing, Confidential Information shall not include information which
          is: (i) already known by you prior to receipt from us; (ii) publicly known or becomes publicly known through
          no wrongful act of you; (iii) rightfully received from a third party without you having knowledge of a breach
          of any other relevant confidentiality obligation; or (iv) independently developed by you. The obligations of
          this clause do not prevent you from disclosing Confidential Information either: (i) to a third party pursuant
          to a written authorisation from us; or (ii) to satisfy a requirement of, or demand by, a body or listing
          authority or any applicable law, provided that we are notified prior to such disclosure to the extent
          permitted by application law.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>Absence of Waiver</b>
        </p>
        <p>
          Any failure or delay by us or our affiliates to enforce any of the Terms or exercise any right under the Terms
          will not be construed as a waiver to any extent of our rights.
          <span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>Severability</b>
        </p>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such
          unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such
          provision shall be deleted without affecting the remaining provision herein.
          <span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>Assignment</b>
        </p>
        <p>
          You acknowledge and agree that you may not assign, delegate, sub-contract or otherwise transfer your rights
          and/or obligations under the Terms. We may transfer, assign, delegate, sub-contract or otherwise transfer its
          rights and/or obligations under the Terms without notifying you or obtaining your consent.
          <span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>Entire Agreement</b>
        </p>
        <p>
          These Terms, including any legal notices and disclaimers contained on this Interface, constitute the entire
          agreement between you and us in relation to your use of the Services, and supersedes all prior agreements and
          understanding with respect of the same.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <h4>&nbsp;</h4>
        <h4>Dispute Resolution</h4>
        <p>
          We will use our best efforts to resolve any potential disputes through informal, good faith negotiations. If a
          potential dispute arises, you must contact us by sending an email to
          <a href="mailto:info@waterfalldefi.org"> info@waterfalldefi.org</a>, so that we can attempt to resolve it
          without resorting to formal dispute resolution. If we aren’t able to reach an informal resolution within sixty
          days of your email, then you and we both agree to resolve the potential dispute according to the process set
          forth below.
        </p>
        <p>
          Any claim or controversy arising out of or relating to the Interface, this Agreement, or any other acts or
          omissions for which you may contend that we are liable, including (but not limited to) any claim or
          controversy as to arbitrability (“Dispute”), shall be referred to and solely, exclusively and finally resolved
          by arbitration in accordance with its commercial arbitration rules in force when notice of arbitration is
          submitted. The law of this arbitration clause shall be Hong Kong law. The arbitration proceedings shall be
          conducted in English. Arbitration hereunder may proceed notwithstanding that any party fails to participate in
          accordance with the Hong Kong International Arbitration Centre (“HKIAC”) Arbitration Rules, provided that
          proper notice of such arbitration has been given to such party, and the final award of the arbitral tribunal
          shall be binding on such party notwithstanding its failure to participate. Each party hereby irrevocably and
          unconditionally waive any objection that it may now or hereafter have to arbitration in accordance with this
          section.<span className="Apple-converted-space">&nbsp;</span>
        </p>
        <p>
          <b>
            Governing Law &amp; Jurisdiction<span className="Apple-converted-space">&nbsp;</span>
          </b>
        </p>
        <p>
          The Terms and all Disputes (whether in tort, contract or otherwise) arising out of or relating in any way to
          the Terms, the Interface or the content, the negotiation, interpretation, validity or performance of the
          terms, the rights and obligations of you and us hereunder or any transaction contemplated by the Agreement
          shall be governed by and construed in accordance with the laws of Hong Kong without regard to the rules of
          principles of conflict of laws of any other jurisdiction that would permit or require the application of the
          laws of any other jurisdiction.<span className="Apple-converted-space">&nbsp;</span>
        </p>
      </section>
      <div className="button-centerer">
        <button onClick={() => setModal({ state: Modal.None })}>I Agree</button>
      </div>
    </div>
  );
}

export default TermsModal;
