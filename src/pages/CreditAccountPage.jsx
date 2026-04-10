import { ArrowLeft, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function CreditAccountPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-brand-soft">
        <section className="section-space">
          <div className="container-shell max-w-4xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green">
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Link>

            <div className="mt-6 rounded-[32px] border border-brand-line bg-white p-8 shadow-soft sm:p-12">
              <span className="pill-label">Credit Account</span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark sm:text-5xl">
                Credit Account Application
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                This page is ready for the client-provided form fields. Once the final form content is shared, we can
                add the full application form here and connect it to the webhook and email flow.
              </p>

              <div className="mt-10 grid gap-6 rounded-[28px] bg-brand-soft p-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-brand-line bg-white p-6">
                  <Send className="h-8 w-8 text-brand-green" />
                  <h2 className="mt-5 text-2xl font-semibold text-brand-dark">Planned Submission Flow</h2>
                  <p className="mt-3 text-base leading-7 text-slate-500">
                    Submit form details to the client webhook and send the same payload to the client email.
                  </p>
                </div>

                <div className="rounded-3xl border border-brand-line bg-white p-6">
                  <Mail className="h-8 w-8 text-brand-green" />
                  <h2 className="mt-5 text-2xl font-semibold text-brand-dark">Waiting For Final Fields</h2>
                  <p className="mt-3 text-base leading-7 text-slate-500">
                    Use the provided reference page and the final field list from the client to complete this form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
