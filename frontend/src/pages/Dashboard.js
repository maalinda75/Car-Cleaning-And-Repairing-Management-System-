import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const STATUS_META = {
    Pending:       { color:"#fbbf24", bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.25)", icon:"🕐" },
    Assigned:      { color:"#60a5fa", bg:"rgba(59,130,246,0.12)",  border:"rgba(59,130,246,0.25)",  icon:"👷" },
    "In Progress": { color:"#a78bfa", bg:"rgba(139,92,246,0.12)", border:"rgba(139,92,246,0.25)", icon:"🚿" },
    Completed:     { color:"#34d399", bg:"rgba(16,185,129,0.12)",  border:"rgba(16,185,129,0.25)",  icon:"✅" },
};

const Badge = ({ status }) => {
    const m = STATUS_META[status] || { color:"#9ca3af", bg:"rgba(255,255,255,0.06)", border:"rgba(255,255,255,0.1)", icon:"•" };
    return (
        <span style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", padding:"0.25rem 0.8rem", borderRadius:99, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.04em", background:m.bg, color:m.color, border:`1px solid ${m.border}` }}>
            {m.icon} {status}
        </span>
    );
};

const STAT_CARDS = [
    { label:"Total Bookings",  key:"total",       icon:"📋", grad:"linear-gradient(135deg,rgba(59,130,246,0.15),rgba(6,182,212,0.08))",  border:"rgba(59,130,246,0.2)",  color:"white"   },
    { label:"Pending",         key:"pending",     icon:"🕐", grad:"linear-gradient(135deg,rgba(245,158,11,0.12),rgba(251,191,36,0.06))", border:"rgba(245,158,11,0.2)", color:"#fbbf24" },
    { label:"In Progress",     key:"inProgress",  icon:"🚿", grad:"linear-gradient(135deg,rgba(139,92,246,0.12),rgba(167,139,250,0.06))",border:"rgba(139,92,246,0.2)", color:"#a78bfa" },
    { label:"Completed",       key:"completed",   icon:"✅", grad:"linear-gradient(135deg,rgba(16,185,129,0.12),rgba(52,211,153,0.06))", border:"rgba(16,185,129,0.2)", color:"#34d399" },
];

function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) return;
        api.get(`/bookings/user/${user.id}`)
            .then(r => setBookings(r.data))
            .finally(() => setLoading(false));
    // eslint-disable-next-line
    }, [user?.id]);

    const stats = {
        total:      bookings.length,
        pending:    bookings.filter(b => b.status === "Pending").length,
        inProgress: bookings.filter(b => b.status === "In Progress").length,
        completed:  bookings.filter(b => b.status === "Completed").length,
    };

    return (
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"3rem 2rem", position:"relative" }} className="fade-in">
            {/* Background orb */}
            <div style={{ position:"fixed", top:0, right:0, width:600, height:600, background:"radial-gradient(circle,rgba(59,130,246,0.06),transparent)", pointerEvents:"none", zIndex:0 }} />

            {/* ── Header ── */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", marginBottom:"2.5rem", position:"relative", zIndex:1 }}>
                <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.5rem" }}>
                        <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#3b82f6,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", boxShadow:"0 6px 20px rgba(59,130,246,0.35)" }}>
                            🚗
                        </div>
                        <h1 className="font-display" style={{ fontSize:"2rem", fontWeight:800, color:"white", letterSpacing:"-0.03em" }}>My Bookings</h1>
                    </div>
                    <p style={{ color:"#6b7280", fontSize:"0.9rem" }}>
                        Welcome back, <span style={{ color:"#d1d5db", fontWeight:600 }}>{user?.name}</span> 👋
                    </p>
                </div>
                <Link to="/booking" className="btn btn-primary btn-ripple" style={{ padding:"0.75rem 1.75rem", fontSize:"0.95rem" }}>
                    + New Booking
                </Link>
            </div>

            {/* ── 3D Stat Cards ── */}
            <div className="perspective" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1.25rem", marginBottom:"2.5rem", position:"relative", zIndex:1 }}>
                {STAT_CARDS.map((s, i) => (
                    <div key={s.key} className={`stat-3d rotate-in-3d delay-${i + 1}`}
                        style={{ background:s.grad, border:`1px solid ${s.border}`, borderRadius:20, padding:"1.5rem", position:"relative", overflow:"hidden" }}>
                        {/* Corner glow */}
                        <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, background:`radial-gradient(circle,${s.color}22,transparent)`, borderRadius:"50%" }} />
                        <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>{s.icon}</div>
                        <div className="font-display" style={{ fontSize:"2.25rem", fontWeight:800, color:s.color, letterSpacing:"-0.04em", lineHeight:1 }}>
                            {stats[s.key]}
                        </div>
                        <div style={{ fontSize:"0.8rem", color:"#6b7280", marginTop:"0.5rem", fontWeight:500 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Glow divider ── */}
            <div className="glow-line" style={{ marginBottom:"2rem" }} />

            {/* ── Content ── */}
            <div style={{ position:"relative", zIndex:1 }}>
                {loading ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                        {[1,2,3].map(i => (
                            <div key={i} className="glass-card" style={{ padding:"1.25rem" }}>
                                <div style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
                                    <div className="skeleton" style={{ width:48, height:48, borderRadius:12 }} />
                                    <div style={{ flex:1 }}>
                                        <div className="skeleton" style={{ height:14, width:"40%", marginBottom:8 }} />
                                        <div className="skeleton" style={{ height:11, width:"70%" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="glass-card float-3d" style={{ padding:"5rem 2rem", textAlign:"center" }}>
                        <div style={{ fontSize:"4rem", marginBottom:"1.25rem" }}>🚗</div>
                        <h2 className="font-display" style={{ fontSize:"1.4rem", fontWeight:700, color:"white", marginBottom:"0.5rem" }}>No bookings yet</h2>
                        <p style={{ color:"#6b7280", marginBottom:"2rem", fontSize:"0.9rem" }}>Book your first car cleaning service today.</p>
                        <Link to="/booking" className="btn btn-primary btn-ripple" style={{ padding:"0.85rem 2rem" }}>Book Now →</Link>
                    </div>
                ) : (
                    <>
                        {/* ── Cards on mobile / medium ── */}
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:"1.25rem" }}>
                            {bookings.map((b, i) => {
                                const m = STATUS_META[b.status] || STATUS_META["Pending"];
                                return (
                                    <div key={b.id} className={`glass-card card-3d rotate-in-3d delay-${(i % 4) + 1}`} style={{ padding:"1.5rem", position:"relative", overflow:"hidden" }}>
                                        {/* Status accent line */}
                                        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${m.color},transparent)`, borderRadius:"20px 20px 0 0" }} />

                                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
                                            <div>
                                                <div style={{ fontWeight:700, color:"white", fontSize:"0.97rem", marginBottom:"0.25rem", maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                                    {b.service_names}
                                                </div>
                                                <div style={{ fontSize:"0.78rem", color:"#6b7280" }}>
                                                    📅 {new Date(b.booking_date).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
                                                </div>
                                            </div>
                                            <Badge status={b.status} />
                                        </div>

                                        <div style={{ display:"flex", gap:"0.5rem", alignItems:"flex-start", marginBottom:"1rem", padding:"0.75rem", background:"rgba(255,255,255,0.02)", borderRadius:12, border:"1px solid rgba(255,255,255,0.04)" }}>
                                            <span style={{ fontSize:"0.9rem", flexShrink:0 }}>📍</span>
                                            <span style={{ fontSize:"0.82rem", color:"#9ca3af", lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                                                {b.location}
                                            </span>
                                        </div>

                                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                            <div className="font-display" style={{ fontSize:"1.4rem", fontWeight:800, color:"#60a5fa", letterSpacing:"-0.03em" }}>
                                                Rs. {Number(b.total_price).toLocaleString()}
                                            </div>
                                            <span style={{ fontSize:"0.75rem", color:"#4b5563", padding:"0.25rem 0.6rem", background:"rgba(255,255,255,0.03)", borderRadius:8, border:"1px solid rgba(255,255,255,0.05)" }}>
                                                #{b.id}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
