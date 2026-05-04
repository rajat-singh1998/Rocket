import { Mail, MapPin, Phone } from "lucide-react";
import { useRef, useState } from "react";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import BottomQuoteSection from "../../components/homepage/BottomQuoteSection";
import {
  bookingLinks,
  bottomQuoteSection,
  clearingOptions,
  loadOptions,
  quoteFormContent
} from "../../data/homeContent";
import "./ContactPage.css";

const contactCards = [
  { title: "Phone Support", detail: "Speak directly with our friendly team", value: "0800 123 4567", icon: Phone },
  { title: "Email", detail: "For detailed enquiries", value: "hello@rocketrubbish.co.uk", icon: Mail },
  { title: "Location", detail: "Visit us by appointment", value: "London, UK", icon: MapPin }
];

const heroActions = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];
const contactHero = {
  title: "Contact Rocket Rubbish",
  text: "Fast, friendly, and eco-conscious rubbish removal. Ready when you are. Need to book a collection, request a quote, or ask a question? Our team is here to help with quick responses and nationwide coverage.",
  image: "/images/rocket/contact_page.png"
};
const initialQuoteForm = { clearing: clearingOptions[0].title, load: loadOptions[1].title, postcode: "", timing: "ASAP" };

export default function ContactPage() {
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm);
  const [quoteError, setQuoteError] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const uploadRef = useRef(null);
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");

  const handleQuoteSubmit = (event) => {
    event.preventDefault();
    if (!quoteForm.postcode.trim()) {
      setQuoteError("Please enter your postcode first.");
      setQuoteMessage("");
      return;
    }
    setQuoteError("");
    setQuoteMessage(`Quote ready for ${quoteForm.clearing.toLowerCase()} in ${quoteForm.postcode.toUpperCase()}.`);
  };

  return (
    <>
      <SiteHeader />
      <main className="contact-page">
        <section className="contact-page__hero" style={{ backgroundImage: `url(${contactHero.image})` }}>
          <div className="page-shell contact-page__hero-inner">
            <div className="contact-page__hero-copy">
              <h1 className="contact-page__hero-title">{contactHero.title}</h1>
              <p className="contact-page__hero-text">{contactHero.text}</p>
              <ActionButtonsRow items={heroActions} bookingLinks={bookingLinks} className="contact-page__hero-actions" />
            </div>
          </div>
        </section>
        <section className="contact-page__breadcrumb-wrap"><div className="page-shell"><p className="contact-page__breadcrumb">Home &nbsp;&gt;&nbsp; Contact Us</p></div></section>
        <section className="contact-page__details"><div className="page-shell"><div className="contact-page__head"><h2 className="contact-page__title">Get In Touch</h2><p className="contact-page__subtitle">Whether you're clearing a home, office, or construction site, our support team makes it easy to get the help you need.</p></div><div className="contact-page__cards">{contactCards.map((item) => { const Icon = item.icon; return (<article key={item.title} className="contact-page__card"><span className="contact-page__card-icon"><Icon size={18} /></span><h3 className="contact-page__card-title">{item.title}</h3><p className="contact-page__card-detail">{item.detail}</p><p className="contact-page__card-value">{item.value}</p></article>); })}</div></div></section>
        <section className="contact-page__map-section"><div className="page-shell"><h2 className="contact-page__map-title">Rocket Rubbish Near Me</h2><div className="contact-page__map-box"><iframe src="https://www.openstreetmap.org/export/embed.html?bbox=-0.563%2C51.261%2C0.280%2C51.686&layer=mapnik&marker=51.5072%2C-0.1276" title="Rocket Rubbish map" className="contact-page__map-iframe" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="contact-page__map-card"><strong>Rocket Rubbish</strong><span>Head Office - London</span><small>4.8 ? (1024)</small></div></div></div></section>
        <BottomQuoteSection section={bottomQuoteSection} bookingLinks={bookingLinks} quoteFormContent={quoteFormContent} clearingOptions={clearingOptions} loadOptions={loadOptions} quoteForm={quoteForm} setQuoteForm={setQuoteForm} quoteError={quoteError} quoteMessage={quoteMessage} handleQuoteSubmit={handleQuoteSubmit} uploadRef={uploadRef} uploadedPhotoName={uploadedPhotoName} handlePhotoChange={(event) => { const file = event.target.files?.[0]; setUploadedPhotoName(file ? file.name : ""); }} />
        <section className="contact-page__lift-cta">
          <div className="page-shell contact-page__lift-cta-inner">
            <div className="contact-page__lift-cta-copy">
              <h2 className="contact-page__lift-cta-title">Need That Rubbish Gone?<br />We're Ready For Lift-Off.</h2>
              <p className="contact-page__lift-cta-text">Don't let the rubbish pile up. Contact Rocket Rubbish today for reliable, same-day, or next-day service.</p>
              <ActionButtonsRow items={heroActions} bookingLinks={bookingLinks} className="contact-page__lift-cta-actions" />
            </div>
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}
