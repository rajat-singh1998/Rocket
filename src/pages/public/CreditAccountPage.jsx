import { useState } from "react";
import { ArrowLeft, Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import "./CreditAccountPage.css";

const initialForm = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  postcode: "",
  address: "",
  wasteType: "General Waste",
  notes: "",
  accepted: false
};

export default function CreditAccountPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.fullName || !form.companyName || !form.email || !form.phone) {
      setError("Please complete the required details first.");
      setMessage("");
      return;
    }

    if (!form.accepted) {
      setError("Please confirm the details before submitting the form.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("Credit account form is ready. The frontend is now collecting data correctly for webhook integration.");
  };

  return (
    <main className="credit-account-page">
      <div className="credit-account-page__shell">
        <Link to="/" className="credit-account-page__back-link">
          <ArrowLeft size={16} />
          Back to homepage
        </Link>

        <div className="credit-account-page__grid">
          <section className="credit-account-page__intro-card">
            <p className="credit-account-page__eyebrow">Credit Account</p>
            <h1 className="credit-account-page__title">Apply for a trade or business account</h1>
            <p className="credit-account-page__text">
              This page is now a real frontend form instead of a placeholder. Once the final fields and webhook details are shared, we can wire this directly into the client system.
            </p>

            <div className="credit-account-page__feature-list">
              {[
                { icon: Building2, title: "Business details", text: "Capture company and contact information clearly." },
                { icon: Mail, title: "Webhook ready", text: "Submission structure is now ready for backend integration." },
                { icon: MapPin, title: "Address capture", text: "Useful for account setup and service area checks." }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="credit-account-page__feature-card">
                    <div className="credit-account-page__feature-icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h2 className="credit-account-page__feature-title">{item.title}</h2>
                      <p className="credit-account-page__feature-text">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="credit-account-page__form-card">
            <form onSubmit={handleSubmit} className="credit-account-page__form-grid">
              <div className="credit-account-page__row credit-account-page__row--two-columns">
                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Full Name</span>
                  <div className="credit-account-page__field-input-wrap">
                    <User size={16} className="credit-account-page__field-icon" />
                    <input type="text" value={form.fullName} onChange={(event) => handleChange("fullName", event.target.value)} placeholder="Your full name" className="credit-account-page__field-input" />
                  </div>
                </label>

                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Company Name</span>
                  <div className="credit-account-page__field-input-wrap">
                    <Building2 size={16} className="credit-account-page__field-icon" />
                    <input type="text" value={form.companyName} onChange={(event) => handleChange("companyName", event.target.value)} placeholder="Company or trading name" className="credit-account-page__field-input" />
                  </div>
                </label>
              </div>

              <div className="credit-account-page__row credit-account-page__row--two-columns">
                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Email Address</span>
                  <div className="credit-account-page__field-input-wrap">
                    <Mail size={16} className="credit-account-page__field-icon" />
                    <input type="email" value={form.email} onChange={(event) => handleChange("email", event.target.value)} placeholder="name@company.com" className="credit-account-page__field-input" />
                  </div>
                </label>

                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Phone Number</span>
                  <div className="credit-account-page__field-input-wrap">
                    <Phone size={16} className="credit-account-page__field-icon" />
                    <input type="tel" value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} placeholder="0800 123 4567" className="credit-account-page__field-input" />
                  </div>
                </label>
              </div>

              <div className="credit-account-page__row credit-account-page__row--two-columns">
                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Postcode</span>
                  <input type="text" value={form.postcode} onChange={(event) => handleChange("postcode", event.target.value)} placeholder="Enter postcode" className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>

                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Waste Type</span>
                  <select value={form.wasteType} onChange={(event) => handleChange("wasteType", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone">
                    <option>General Waste</option>
                    <option>Office Clearance</option>
                    <option>Bulky Items</option>
                    <option>Mixed Load</option>
                  </select>
                </label>
              </div>

              <label className="credit-account-page__field">
                <span className="credit-account-page__field-label">Business Address</span>
                <textarea rows="3" value={form.address} onChange={(event) => handleChange("address", event.target.value)} placeholder="Company address" className="credit-account-page__field-input credit-account-page__field-input--standalone credit-account-page__textarea" />
              </label>

              <label className="credit-account-page__field">
                <span className="credit-account-page__field-label">Additional Notes</span>
                <textarea rows="4" value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} placeholder="Tell us anything useful for the account setup" className="credit-account-page__field-input credit-account-page__field-input--standalone credit-account-page__textarea" />
              </label>

              <label className="credit-account-page__checkbox-card">
                <input type="checkbox" checked={form.accepted} onChange={(event) => handleChange("accepted", event.target.checked)} className="credit-account-page__checkbox" />
                <span>I confirm that these details are correct and ready to be sent for account review.</span>
              </label>

              {error ? <p className="status-note status-note-error">{error}</p> : null}
              {message ? <p className="status-note status-note-success">{message}</p> : null}

              <button type="submit" className="solid-button credit-account-page__submit">
                Submit Credit Account Form
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
