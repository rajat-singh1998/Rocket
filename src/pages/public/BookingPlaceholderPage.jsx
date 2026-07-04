import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import "./BookingPlaceholderPage.css";

export default function BookingPlaceholderPage() {
  return (
    <>
      <SiteHeader />
      <main className="booking-placeholder-page" aria-label="Booking coming soon">
        <img
          src="/images/rocket/booking-coming-soon.png"
          alt="Rocket Rubbish Removal booking coming soon"
          className="booking-placeholder-page__image"
        />
      </main>
      <SiteFooter />
    </>
  );
}
