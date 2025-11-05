import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/catalog", label: "Catalog" },
  { to: "/orders", label: "Orders" },
  { to: "/customers", label: "Customers" },
  { to: "/reports", label: "Reports" },
];

export default function Sidebar() {
  return (
    <nav className="rounded-2xl border bg-white p-3 sticky top-16">
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.end as any}
              className={({ isActive }) =>
                [
                  "block rounded-lg px-3 py-2 text-sm",
                  isActive ? "bg-gray-900 text-white" : "hover:bg-gray-50 text-gray-700",
                ].join(" ")
              }
            >
              {it.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
