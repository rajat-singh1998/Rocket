import { useState } from "react";
import { ArrowLeft, Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";

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
    <main className="min-h-screen bg-[#f7f8f3] px-6 py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green">
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[34px] bg-[#111b2c] px-8 py-10 text-white shadow-soft sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8ec956]">Credit Account</p>
            <h1 className="mt-4 text-[2.5rem] font-semibold tracking-[-0.05em] sm:text-[3.4rem]">
              Apply for a trade or business account
            </h1>
            <p className="mt-5 text-[1.05rem] leading-8 text-white/78">
              This page is now a real frontend form instead of a placeholder. Once the final fields and webhook details are
              shared, we can wire this directly into the client system.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                { icon: Building2, title: "Business details", text: "Capture company and contact information clearly." },
                { icon: Mail, title: "Webhook ready", text: "Submission structure is now ready for backend integration." },
                { icon: MapPin, title: "Address capture", text: "Useful for account setup and service area checks." }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                        <Icon className="h-5 w-5 text-[#8ec956]" />
                      </div>
                      <div>
                        <h2 className="text-[1.1rem] font-semibold">{item.title}</h2>
                        <p className="mt-2 text-[0.98rem] leading-7 text-white/72">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[34px] border border-[#dfe4d8] bg-white p-8 shadow-soft sm:p-10">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field-card">
                  <span className="field-card__label">Full Name</span>
                  <div className="mt-2 flex items-center gap-3">
                    <User className="h-4 w-4 text-[#7b8478]" />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(event) => handleChange("fullName", event.target.value)}
                      placeholder="Your full name"
                      className="field-input"
                    />
                  </div>
                </label>

                <label className="field-card">
                  <span className="field-card__label">Company Name</span>
                  <div className="mt-2 flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-[#7b8478]" />
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(event) => handleChange("companyName", event.target.value)}
                      placeholder="Company or trading name"
                      className="field-input"
                    />
                  </div>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field-card">
                  <span className="field-card__label">Email Address</span>
                  <div className="mt-2 flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#7b8478]" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      placeholder="name@company.com"
                      className="field-input"
                    />
                  </div>
                </label>

                <label className="field-card">
                  <span className="field-card__label">Phone Number</span>
                  <div className="mt-2 flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#7b8478]" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => handleChange("phone", event.target.value)}
                      placeholder="0800 123 4567"
                      className="field-input"
                    />
                  </div>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field-card">
                  <span className="field-card__label">Postcode</span>
                  <input
                    type="text"
                    value={form.postcode}
                    onChange={(event) => handleChange("postcode", event.target.value)}
                    placeholder="Enter postcode"
                    className="field-input mt-2"
                  />
                </label>

                <label className="field-card">
                  <span className="field-card__label">Waste Type</span>
                  <select value={form.wasteType} onChange={(event) => handleChange("wasteType", event.target.value)} className="field-input mt-2">
                    <option>General Waste</option>
                    <option>Office Clearance</option>
                    <option>Bulky Items</option>
                    <option>Mixed Load</option>
                  </select>
                </label>
              </div>

              <label className="field-card">
                <span className="field-card__label">Business Address</span>
                <textarea
                  rows="3"
                  value={form.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  placeholder="Company address"
                  className="field-input mt-2 resize-none"
                />
              </label>

              <label className="field-card">
                <span className="field-card__label">Additional Notes</span>
                <textarea
                  rows="4"
                  value={form.notes}
                  onChange={(event) => handleChange("notes", event.target.value)}
                  placeholder="Tell us anything useful for the account setup"
                  className="field-input mt-2 resize-none"
                />
              </label>

              <label className="flex items-start gap-3 rounded-[22px] border border-[#dce4d6] bg-[#f8fbf6] px-5 py-4 text-[0.98rem] text-[#455046]">
                <input
                  type="checkbox"
                  checked={form.accepted}
                  onChange={(event) => handleChange("accepted", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#c8d3c3]"
                />
                <span>I confirm that these details are correct and ready to be sent for account review.</span>
              </label>

              {error ? <p className="status-note status-note-error">{error}</p> : null}
              {message ? <p className="status-note status-note-success">{message}</p> : null}

              <button type="submit" className="solid-button w-full sm:w-fit">
                Submit Credit Account Form
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
