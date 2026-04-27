import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../lib/api";
import { isAdminAuthenticated, persistAdminSession } from "../../utils/adminAuth";
import "./AdminLoginPage.css";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(buildApiUrl("/api/admin/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Login failed.");
      }

      persistAdminSession(data.token, data.admin);
      navigate("/admin/dashboard", { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Please enter the correct password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-card__icon-wrap">
          <Lock size={34} strokeWidth={2.1} />
        </div>

        <h1 className="admin-login-card__title">Admin Access</h1>
        <p className="admin-login-card__text">Please Enter Your Password To Continue.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label className="admin-login-form__label" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="Enter Password"
            className="admin-login-form__input"
          />

          {error ? <p className="admin-login-form__error">{error}</p> : null}

          <button type="submit" className="admin-login-form__button" disabled={loading}>
            {loading ? "Logging In..." : "Login To Dashboard"}
          </button>
        </form>
      </section>
    </main>
  );
}
