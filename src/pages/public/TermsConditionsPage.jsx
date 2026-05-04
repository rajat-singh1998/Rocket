import { FileText } from "lucide-react";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import LegalContactBar from "../../components/sections/LegalContactBar";
import "./LegalDocumentPage.css";

const sections = [
  { title: "1. Definitions", bullets: ['"Customer", "you", "your" - any individual or business booking or enquiring about our services.', '"Services" - any rubbish removal, clearance, or related work provided by Rocket Rubbish.', '"Team" - our licensed, vetted, and insured collection staff.', '"Booking" - any confirmed service scheduled via phone, WhatsApp, email, or online.'] },
  { title: "2. Service Overview", intro: "Rocket Rubbish provides domestic, commercial, and construction waste removal across the UK. Services include, but are not limited to:", bullets: ["Household and general waste clearance", "Office and commercial waste removal", "Garden waste removal", "Bulky item collection", "Full house clearances", "Construction and renovation waste removal"] },
  { title: "3. Booking & Availability", intro: "Same-day collections are subject to availability and require booking before noon. Customers must ensure our team has safe and reasonable access to the collection site.", bullets: ["Multi-floor internal collections may require advance notice.", "Loft, basement, and restricted-access properties may affect timing or pricing.", "When booking, you must provide accurate details about the waste to be collected."] },
  { title: "4. Pricing & Payment", intro: "The price quoted during booking is the price you pay, provided the waste matches the description given.", bullets: ["Additional charges may apply if hazardous materials are present.", "Additional labour or access difficulties may affect the service cost.", "Parking fees or local restrictions may affect the final logistics.", "Payment is due upon completion unless a pre-arranged account or invoice agreement exists."] },
  { title: "5. Waste Types We Do Not Collect", intro: "We do not collect the following unless explicitly agreed beforehand:", bullets: ["Hazardous chemicals", "Asbestos", "Clinical or medical waste", "Gas bottles or pressurised containers", "Paints, solvents, or oils", "Raw food waste requiring specialist disposal"] },
  { title: "6. Cancellations & Rescheduling", bullets: ["Cancellations made more than 24 hours before the scheduled time: no charge.", "Cancellations within 24 hours: a cancellation fee may apply.", "Failure to provide access on arrival: full or partial charges may apply.", "Customers may reschedule their booking subject to availability."] },
  { title: "7. Arrival Windows & Tracking", bullets: ["We provide estimated arrival windows and live van tracking where available.", "Arrival times may vary due to traffic, weather, or operational delays.", "We are not liable for delays outside our control."] },
  { title: "8. Customer Responsibilities", intro: "You agree to:", bullets: ["Provide accurate waste descriptions.", "Ensure safe property access.", "Secure pets, valuables, and fragile items.", "Comply with all local laws and regulations.", "Indemnify us against claims arising from unsafe site conditions or customer negligence."] },
  { title: "9. Our Responsibilities", intro: "We will:", bullets: ["Handle waste safely and professionally.", "Use licensed and insured teams.", "Dispose of waste responsibly in accordance with environmental regulations.", "Strive to recycle and repurpose materials wherever possible.", "Respect your property and operate with care."] },
  { title: "10. Damage & Liability", bullets: ["Our team takes care to avoid damage; however, we are not liable for issues caused by unsafe access or undeclared waste.", "Our total liability is limited to the price paid for the service provided.", "We are not responsible for items accidentally disposed of if they were mixed into waste provided by the customer."] },
  { title: "11. Environmental Commitments", intro: "We prioritise recycling, reuse, and ethical disposal. Waste is processed through licensed recycling centres and disposal facilities.", bullets: ["Customers accept that disposal outcomes may vary based on regional availability and waste classification."] },
  { title: "12. Complaints", bullets: ["If you are dissatisfied with any part of our service, contact us within 48 hours of collection. We will investigate and work to resolve the issue promptly."] },
  { title: "13. Privacy & Data Protection", bullets: ["We collect and process customer data solely for service delivery and communication.", "We do not sell customer data to third parties.", "For full details, refer to our Privacy Policy."] },
  { title: "14. Changes To Terms", bullets: ["We may update these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms."] }
];

export default function TermsConditionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <div className="page-shell legal-page__wrap">
          <header className="legal-page__header">
            <div className="legal-page__title-row"><span className="legal-page__title-icon"><FileText size={28} /></span><h1 className="legal-page__title">Terms & Conditions</h1></div>
            <p className="legal-page__updated">Last Updated: May 2026</p>
            <p className="legal-page__intro">Welcome to Rocket Rubbish Removal. These terms and conditions outline the rules, responsibilities, and limitations that apply when using our services. By booking, contacting, or engaging with Rocket Rubbish Removal ("We", "Us", "Our"), you agree to these terms.</p>
            <p className="legal-page__intro">If you do not agree with any part of these terms, please do not use our services.</p>
          </header>
          {sections.map((section) => (<section key={section.title} className="legal-page__section"><h2 className="legal-page__section-title">{section.title}</h2>{section.intro ? <p className="legal-page__section-text">{section.intro}</p> : null}<ul className="legal-page__bullets">{section.bullets.map((item) => (<li key={item}>{item}</li>))}</ul></section>))}
          <section className="legal-page__section"><h2 className="legal-page__section-title">15. Contact Information</h2><p className="legal-page__section-text">If you have any questions about these terms, please contact us:</p><div className="legal-page__contact-wrap"><LegalContactBar /></div></section>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
