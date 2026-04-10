import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreditAccountPage from "./pages/CreditAccountPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/credit-account" element={<CreditAccountPage />} />
    </Routes>
  );
}
