import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../services/auth";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/bom-analysis", icon: "🔬", label: "BOM Analysis" },
  { to: "/supplier-risk", icon: "⚠️", label: "Supplier Risk" },
  { to: "/inventory-risk", icon: "📦", label: "Inventory Risk" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          {!collapsed && <span className="sidebar__brand">SupplyChain AI</span>}
          {collapsed && <span className="sidebar__brand-icon">⚙️</span>}
        </div>
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__signout" onClick={handleSignOut}>
          <span className="sidebar__icon">🚪</span>
          {!collapsed && <span className="sidebar__label">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
