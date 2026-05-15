import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "./CreditAccountPage.css";

const serviceOptions = [
  "Rubbish Removal",
  "Skip Hire"
];

const initialForm = {
  firstName: "",
  lastName: "",
  landlineNumber: "",
  mobileNumber: "",
  email: "",
  companyName: "",
  companyPosition: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  postcode: "",
  companyRegistrationNumber: "",
  monthlySpend: "",
  accountsContactEmail: "",
  servicesInterestedIn: [],
  acceptedTerms: false
};

export default function CreditAccountPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleServiceToggle(option) {
    setForm((current) => ({
      ...current,
      servicesInterestedIn: current.servicesInterestedIn.includes(option)
        ? current.servicesInterestedIn.filter((item) => item !== option)
        : [...current.servicesInterestedIn, option]
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const requiredFields = [
      form.firstName,
      form.lastName,
      form.landlineNumber,
      form.mobileNumber,
      form.email,
      form.companyName,
      form.companyPosition,
      form.addressLine1,
      form.city,
      form.county,
      form.postcode,
      form.companyRegistrationNumber,
      form.monthlySpend,
      form.accountsContactEmail
    ];

    if (requiredFields.some((value) => !String(value || "").trim())) {
      setError("Please complete all required fields first.");
      setMessage("");
      return;
    }

    if (form.servicesInterestedIn.length === 0) {
      setError("Please select at least one service you are interested in.");
      setMessage("");
      return;
    }

    if (!form.acceptedTerms) {
      setError("Please accept the Waste Management and Plant Hire terms and conditions.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("Credit account form is ready. Next we can connect this form to the client portal and email workflow.");
  }

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
            <h1 className="credit-account-page__title">Register for a Rocket Rubbish Removal Account</h1>
          
          </section>

          <section className="credit-account-page__form-card">
            <form onSubmit={handleSubmit} className="credit-account-page__form-grid">
              <div className="credit-account-page__row credit-account-page__row--two-columns">
                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">First Name *</span>
                  <input type="text" value={form.firstName} onChange={(event) => handleChange("firstName", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>

                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Last Name *</span>
                  <input type="text" value={form.lastName} onChange={(event) => handleChange("lastName", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>
              </div>

              <div className="credit-account-page__row credit-account-page__row--two-columns">
                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Landline Number *</span>
                  <input type="tel" value={form.landlineNumber} onChange={(event) => handleChange("landlineNumber", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>

                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Mobile Number *</span>
                  <input type="tel" value={form.mobileNumber} onChange={(event) => handleChange("mobileNumber", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>
              </div>

              <label className="credit-account-page__field">
                <span className="credit-account-page__field-label">Email *</span>
                <input type="email" value={form.email} onChange={(event) => handleChange("email", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
              </label>

              <div className="credit-account-page__row credit-account-page__row--two-columns">
                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Full company name *</span>
                  <input type="text" value={form.companyName} onChange={(event) => handleChange("companyName", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>

                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Your position in company *</span>
                  <input type="text" value={form.companyPosition} onChange={(event) => handleChange("companyPosition", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>
              </div>

              <label className="credit-account-page__field">
                <span className="credit-account-page__field-label">Address *</span>
                <input type="text" value={form.addressLine1} onChange={(event) => handleChange("addressLine1", event.target.value)} placeholder="Street Address" className="credit-account-page__field-input credit-account-page__field-input--standalone" />
              </label>

              <label className="credit-account-page__field">
                <span className="credit-account-page__field-label">Street Address Line 2</span>
                <input type="text" value={form.addressLine2} onChange={(event) => handleChange("addressLine2", event.target.value)} placeholder="Street Address Line 2" className="credit-account-page__field-input credit-account-page__field-input--standalone" />
              </label>

              <div className="credit-account-page__row credit-account-page__row--two-columns">
                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">City *</span>
                  <input type="text" value={form.city} onChange={(event) => handleChange("city", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>

                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">County *</span>
                  <input type="text" value={form.county} onChange={(event) => handleChange("county", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>
              </div>

              <label className="credit-account-page__field credit-account-page__field--compact">
                <span className="credit-account-page__field-label">Post code *</span>
                <input type="text" value={form.postcode} onChange={(event) => handleChange("postcode", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
              </label>

              <div className="credit-account-page__row credit-account-page__row--two-columns">
                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">Company Registration Number *</span>
                  <input type="text" value={form.companyRegistrationNumber} onChange={(event) => handleChange("companyRegistrationNumber", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>

                <label className="credit-account-page__field">
                  <span className="credit-account-page__field-label">What is your monthly spend likely to be? *</span>
                  <input type="text" value={form.monthlySpend} onChange={(event) => handleChange("monthlySpend", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
                </label>
              </div>

              <label className="credit-account-page__field">
                <span className="credit-account-page__field-label">Accounts Contact Email *</span>
                <input type="email" value={form.accountsContactEmail} onChange={(event) => handleChange("accountsContactEmail", event.target.value)} className="credit-account-page__field-input credit-account-page__field-input--standalone" />
              </label>

              <fieldset className="credit-account-page__option-card">
                <legend className="credit-account-page__option-title">What services are you interested in? *</legend>
                <div className="credit-account-page__checkbox-list">
                  {serviceOptions.map((option) => (
                    <label key={option} className="credit-account-page__checkbox-row">
                      <input type="checkbox" checked={form.servicesInterestedIn.includes(option)} onChange={() => handleServiceToggle(option)} className="credit-account-page__checkbox" />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="credit-account-page__option-card">
                <legend className="credit-account-page__option-title">Waste Management Terms *</legend>
                <label className="credit-account-page__checkbox-row credit-account-page__checkbox-row--terms">
                  <input type="checkbox" checked={form.acceptedTerms} onChange={(event) => handleChange("acceptedTerms", event.target.checked)} className="credit-account-page__checkbox" />
                  <span>
                    I have read and agreed to the Waste Management and Plant Hire <Link to="/terms-and-conditions">terms and conditions</Link> *
                  </span>
                </label>
              </fieldset>

              {error ? <p className="status-note status-note-error">{error}</p> : null}
              {message ? <p className="status-note status-note-success">{message}</p> : null}

              <button type="submit" className="solid-button credit-account-page__submit">
                Submit
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

