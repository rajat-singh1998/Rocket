import { NavLink } from "react-router-dom";
import { adminMenu } from "../../data/homeContent";

function menuClass({ isActive }) {
  return `rounded-[14px] px-4 py-3 text-[0.98rem] font-medium transition ${
    isActive ? "bg-white/10 text-white" : "text-white/72 hover:bg-white/8 hover:text-white"
  }`;
}

export default function AdminLayout({ title, description, actions, children }) {
  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <div className="grid min-h-screen xl:grid-cols-[270px_1fr]">
        <aside className="flex flex-col gap-7 bg-[#141b24] px-5 py-7 text-white">
          <NavLink to="/admin/dashboard" className="inline-flex">
            <img src="/images/rocket/logo_rocket.png" alt="Rocket Rubbish Removal" className="h-[72px] w-auto" />
          </NavLink>

          <nav className="grid gap-2">
            {adminMenu.map((item) => (
              <NavLink key={item.label} to={item.to} className={menuClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-[18px] bg-white/6 p-4">
            <p className="text-sm font-semibold text-white">Admin User</p>
            <p className="mt-1 text-sm text-white/68">admin@rocket.com</p>
          </div>
        </aside>

        <section className="px-5 py-6 sm:px-7 lg:px-9">
          <header className="flex flex-col gap-4 border-b border-[#e7edf4] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[2.2rem] font-semibold tracking-[-0.04em] text-[#141b24]">{title}</h1>
              <p className="mt-2 text-[1rem] leading-7 text-[#6d7788]">{description}</p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </header>

          <div className="mt-6 grid gap-6">{children}</div>
        </section>
      </div>
    </main>
  );
}



