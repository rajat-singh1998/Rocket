import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "../../lib/router";
import { buildApiUrl } from "../../lib/api";
import { isAdminAuthenticated, persistAdminSession } from "../../utils/adminAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email, password })
      });

      const data = await response.json().catch(() => ({
        ok: false,
        message: "Unable to reach admin login. Please try again."
      }));

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
        <p className="admin-login-card__text">Main admin can use password only. Team users enter email and password.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label className="admin-login-form__label" htmlFor="admin-email">
            Email Address
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="Only required for team users"
            className="admin-login-form__input"
          />

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
