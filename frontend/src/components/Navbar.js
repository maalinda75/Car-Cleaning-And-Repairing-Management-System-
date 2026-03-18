import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const user      = JSON.parse(localStorage.getItem("user"));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = user ? (
        user.role === "customer" ? [
            { to: "/",          label: "Home" },
            { to: "/booking",   label: "Book Service" },
            { to: "/dashboard", label: "My Bookings" },
        ] : user.role === "admin" ? [
            { to: "/",     label: "Home" },
            { to: "/admin", label: "Admin Panel" },
        ] : [
            { to: "/",        label: "Home" },
            { to: "/employee", label: "My Tasks" },
        ]
    ) : [
        { to: "/", label: "Home" },
    ];

    return (
        <>
            <header style={{
                position: "sticky", top: 0, zIndex: 100,
                background: "rgba(6,11,24,0.88)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                transition: "background 0.3s",
            }}>
                <nav style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem", height:72, display:"flex", alignItems:"center", justifyContent:"space-between" }}>

                    {/* ── Logo ── */}
                    <Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"0.75rem", flexShrink:0 }}>
                        <img src="/logo.png" alt="SparkleDrive Logo" style={{ width:42, height:42, borderRadius:12, objectFit:"cover", boxShadow:"0 4px 16px rgba(59,130,246,0.4)" }} />
                        <span className="font-display" style={{ fontWeight:700, fontSize:"1.2rem", color:"white", letterSpacing:"-0.03em" }}>
                            Sparkle<span style={{ color:"#60a5fa" }}>Drive</span>
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <div style={{ display:"flex", alignItems:"center", gap:"0.25rem" }}>
                        {navLinks.map(({ to, label }) => (
                            <Link key={to} to={to}
                                className="nav-link"
                                style={{ padding:"0.5rem 1rem", borderRadius:9, fontSize:"0.9rem", fontWeight:500, color: isActive(to) ? "#60a5fa" : "#9ca3af", background: isActive(to) ? "rgba(59,130,246,0.1)" : "transparent", transition:"all 0.2s" }}>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* ── Right Section ── */}
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                        {user ? (
                            <>
                                {/* User pill */}
                                <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", padding:"0.45rem 1rem", background:"rgba(255,255,255,0.04)", borderRadius:99, border:"1px solid rgba(255,255,255,0.08)" }}>
                                    <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.78rem", fontWeight:800, color:"white", flexShrink:0 }}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontSize:"0.85rem", color:"#e5e7eb", fontWeight:500, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                        {user.name}
                                    </span>
                                    {/* Role badge */}
                                    <span style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", padding:"0.15rem 0.5rem", borderRadius:99, background: user.role === "admin" ? "rgba(139,92,246,0.15)" : user.role === "employee" ? "rgba(6,182,212,0.15)" : "rgba(16,185,129,0.12)", color: user.role === "admin" ? "#a78bfa" : user.role === "employee" ? "#22d3ee" : "#34d399" }}>
                                        {user.role}
                                    </span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-ghost" style={{ padding:"0.5rem 1.1rem", fontSize:"0.85rem" }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost" style={{ padding:"0.5rem 1.2rem", fontSize:"0.9rem" }}>Login</Link>
                                <Link to="/register" className="btn btn-primary" style={{ padding:"0.5rem 1.4rem", fontSize:"0.9rem" }}>Get Started</Link>
                            </>
                        )}
                    </div>

                </nav>
            </header>
        </>
    );
};

export default Navbar;
