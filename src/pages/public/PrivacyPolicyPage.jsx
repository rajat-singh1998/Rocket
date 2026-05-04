import { ShieldCheck } from "lucide-react";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import LegalContactBar from "../../components/sections/LegalContactBar";
import "./LegalDocumentPage.css";

const sections = [
  { title: "1. Information We Collect", intro: "We may collect and process the following data about you:", bullets: ["Identity data: first name, last name.", "Contact data: billing address, collection address, email address, and telephone numbers to coordinate your rubbish clearance.", "Transaction data: details about payments and the waste collection services you have purchased from us.", "Usage data: information about how you navigate and use our website."] },
  { title: "2. How We Use Your Data", intro: "We only use your personal data when the law allows us to. Principally, we use your data to:", bullets: ["Provide you with an accurate quote for waste removal services and register you as a new customer.", "Fulfil our contract to clear your rubbish, including navigating our teams to your property and managing payments and fees.", "Manage our relationship with you, including notifying you about changes to our terms or privacy policy.", "Protect our business and this website, including troubleshooting, reporting, and hosting of data.", "Deliver relevant website content and measure the effectiveness of the advertising we serve to you.", "Use data analytics to improve our website, products, services, marketing, customer relationships, and experiences."] },
  { title: "3. Disclosures Of Your Personal Data", intro: "We will never sell your personal data. However, we may share your personal data with strictly vetted third-party service providers who assist us in fulfilling our services, such as:", bullets: ["Our network of licensed waste carrier partners operating in your local area to fulfil collection contracts.", "Secure payment processing gateways and billing management services.", "IT professionals, system administration providers, hosting partners, and marketing analytics agencies.", "Professional advisers including lawyers, bankers, auditors, and insurers who provide consultancy, banking, legal, insurance, and accounting services.", "HM Revenue & Customs, regulators, and other authorities acting as processors or joint controllers based in the United Kingdom."] },
  { title: "4. Your Legal Rights", intro: "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:", bullets: ["Request access to a copy of the personal data we hold about you.", "Request correction of any incomplete or inaccurate data we hold about you.", "Request erasure of your personal data where there is no good reason for us to continue processing it.", "Object to processing where we rely on a legitimate interest.", "Request restriction of processing of your personal data in certain scenarios.", "Request data portability to you or a third party.", "Withdraw consent at any time where we rely on consent to process your personal data."] }
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <div className="page-shell legal-page__wrap">
          <header className="legal-page__header">
            <div className="legal-page__title-row"><span className="legal-page__title-icon"><ShieldCheck size={28} /></span><h1 className="legal-page__title">Privacy Policy</h1></div>
            <p className="legal-page__updated">Last Updated: May 2026</p>
            <p className="legal-page__intro">At Rocket Rubbish ("We", "Our", or "Us"), we are committed to protecting your privacy and ensuring your personal data is handled securely and in accordance with the UK General Data Protection Regulation (UK GDPR) and The Data Protection Act 2018. This privacy policy informs you about how we look after your personal data when you visit our website and tells you about your privacy rights and how the law protects you.</p>
          </header>
          {sections.map((section) => (<section key={section.title} className="legal-page__section"><h2 className="legal-page__section-title">{section.title}</h2><p className="legal-page__section-text">{section.intro}</p><ul className="legal-page__bullets">{section.bullets.map((item) => (<li key={item}>{item}</li>))}</ul></section>))}
          <section className="legal-page__section"><h2 className="legal-page__section-title">5. Contact Information</h2><p className="legal-page__section-text">If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p><div className="legal-page__contact-wrap"><LegalContactBar /></div></section>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
