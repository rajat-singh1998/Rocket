import { Cookie } from "lucide-react";
import { Link } from "../../lib/router";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import LegalContactBar from "../../components/sections/LegalContactBar";

const usageItems = [
  "In booking services to retain information between pages. Without cookies enabled, you may not be able to make a booking.",
  "On login pages, where a remember-my-login feature may save you from entering your username every time you visit the site.",
  "For webchat tools, to make sure text conversations are continuous and you do not have to repeat information if your internet connection is lost.",
  "For analytics, to understand how visitors use the website and the paths they take through the site."
];

const cookieRows = [
  {
    name: "__zendesk_session",
    purpose: "Maintains the user's live chat session across pages.",
    expiry: "Session",
    type: "Functional"
  },
  {
    name: "__zendesk_mid",
    purpose: "Identifies returning live chat users to offer seamless support.",
    expiry: "1 year",
    type: "Functional"
  },
  {
    name: "PHPSESSID",
    purpose: "Preserves user session state across page requests.",
    expiry: "Session",
    type: "Essential"
  },
  {
    name: "x_stripe_mid",
    purpose: "Supports fraud prevention and payment security during transactions.",
    expiry: "1 year",
    type: "Essential"
  }
];

export default function CookiesPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <div className="page-shell legal-page__wrap">
          <header className="legal-page__header">
            <div className="legal-page__title-row">
              <span className="legal-page__title-icon">
                <Cookie size={28} />
              </span>
              <h1 className="legal-page__title">Cookies Policy</h1>
            </div>
            <p className="legal-page__updated">Last Updated: July 2026</p>
            <p className="legal-page__intro">
              Cookies are very small text files that are placed on your computer, smartphone or other device when you
              access some websites on the internet.
            </p>
          </header>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Why We Use Cookies</h2>
          <p className="legal-page__section-text">
            This website, along with many others, uses cookies. Cookies let users navigate around sites and, when
            necessary, enable us to tailor content to fit the preferences of visitors to our site. Without cookies
            enabled, we cannot guarantee that the website and your experience of it are as we intended it to be.
          </p>
          <p className="legal-page__section-text">
            None of the cookies we use collect your personal information and they cannot be used to identify you.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Types Of Cookies</h2>
          <p className="legal-page__section-text">
            The length of time for which a cookie stays on your device depends on its type. We use two different types
            of cookies on our website.
          </p>
          <ul className="legal-page__bullets">
            <li>
              Session cookies are temporary cookies which exist only while you use the website and are deleted when you
              close the browser. They help the website remember what you chose on the previous page, for example when
              booking our services.
            </li>
            <li>
              Persistent cookies stay on your device after you have visited our website. They help us identify you as a
              unique visitor, but do not contain information that could be used to identify you to another person.
            </li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">How Rocket Rubbish Removal Uses Cookies</h2>
          <ul className="legal-page__bullets">
            {usageItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Analytics Cookies</h2>
          <p className="legal-page__section-text">
            We use Google Analytics, which uses cookies to help us analyse how visitors use the site. You can find out
            more about how these cookies are used on Google's privacy information pages.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Cookie Details</h2>
          <div className="legal-page__table-wrap">
            <table className="legal-page__table">
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Expiry</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {cookieRows.map((cookie) => (
                  <tr key={cookie.name}>
                    <td>{cookie.name}</td>
                    <td>{cookie.purpose}</td>
                    <td>{cookie.expiry}</td>
                    <td>{cookie.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">How To Control And Delete Cookies</h2>
          <p className="legal-page__section-text">
            If you want to restrict or block the cookies that we set, you can do this through your browser settings.
            The help function within your browser should tell you how. Alternatively, you can visit
            www.aboutcookies.org, which contains detailed information on cookies across a wide variety of browsers.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Cookies In Emails</h2>
          <p className="legal-page__section-text">
            As well as the cookies we use on our website, we may use cookies and similar technologies in some emails.
            These help us understand whether you have opened an email and how you have interacted with it.
          </p>
          <ul className="legal-page__bullets">
            <li>
              Web beacons are tiny, invisible images placed in emails to tell us whether you have opened them, how you
              interacted with them, which device you used and similar delivery information.
            </li>
            <li>
              Link tracking may be used where emails contain hyperlinks with unique tags, so we can understand which
              links have been clicked and improve future messages.
            </li>
            <li>
              Cookies may be set when you download images in an email or click on a link.
            </li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Making Choices About Cookies</h2>
          <p className="legal-page__section-text">
            If you do not want to accept cookies from our emails, you can close the email before downloading images or
            clicking links. You can also set your browser to restrict or reject cookies. These settings will apply to
            cookies on websites and in emails.
          </p>
          <p className="legal-page__section-text">
            Please view our <Link to="/privacy-policy" className="legal-page__inline-link">Privacy Policy</Link> for further information.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__section-title">Contact Information</h2>
          <p className="legal-page__section-text">If you have any questions about this Cookies Policy, please contact us:</p>
          <div className="legal-page__contact-wrap">
            <LegalContactBar />
          </div>
        </section>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
