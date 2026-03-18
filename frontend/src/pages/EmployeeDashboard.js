import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";

const STATUS_META = {
    Assigned:      { color:"#60a5fa", bg:"rgba(59,130,246,0.12)", border:"rgba(59,130,246,0.25)", icon:"📋", label:"Assigned" },
    "In Progress": { color:"#a78bfa", bg:"rgba(139,92,246,0.12)",border:"rgba(139,92,246,0.25)", icon:"🚿", label:"In Progress" },
    Completed:     { color:"#34d399", bg:"rgba(16,185,129,0.12)", border:"rgba(16,185,129,0.25)", icon:"✅", label:"Completed" },
};

function TaskCard({ task: t, onUpdate }) {
    const m = STATUS_META[t.status] || STATUS_META["Assigned"];
    const [hovered, setHovered] = useState(false);

    return (
        <div className="glass-card card-3d rotate-in-3d"
            style={{ position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>

            {/* Status accent top bar */}
            <div style={{ height:4, background:`linear-gradient(90deg,${m.color},${m.color}55,transparent)`, borderRadius:"20px 20px 0 0" }} />

            {/* Background orb */}
            <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, background:`radial-gradient(circle,${m.color}15,transparent)`, borderRadius:"50%", transition:"transform 0.4s ease", transform: hovered ? "scale(1.5)" : "scale(1)" }} />

            <div style={{ padding:"1.5rem", flex:1, display:"flex", flexDirection:"column", gap:"1rem", position:"relative", zIndex:1 }}>
                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                        <div style={{ fontSize:"0.72rem", fontWeight:700, color:m.color, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.4rem" }}>
                            {m.icon} {t.service_names}
                        </div>
                        <div style={{ fontWeight:700, color:"white", fontSize:"1.05rem" }}>{t.customer_name}</div>
                    </div>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", padding:"0.25rem 0.8rem", borderRadius:99, fontSize:"0.71rem", fontWeight:700, letterSpacing:"0.04em", background:m.bg, color:m.color, border:`1px solid ${m.border}`, flexShrink:0 }}>
                        {m.label}
                    </span>
                </div>

                {/* Details */}
                <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:"1rem", border:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display:"flex", gap:"0.6rem", marginBottom:"0.6rem" }}>
                        <span style={{ fontSize:"1rem" }}>📍</span>
                        <span style={{ color:"#d1d5db", fontSize:"0.84rem", lineHeight:1.5 }}>{t.location}</span>
                    </div>
                    <div style={{ display:"flex", gap:"0.6rem", color:"#9ca3af" }}>
                        <span style={{ fontSize:"1rem" }}>📅</span>
                        <span style={{ fontSize:"0.84rem" }}>
                            {new Date(t.booking_date).toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric", year:"numeric" })}
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop:"auto" }}>
                    {t.status === "Assigned" && (
                        <button className="btn btn-primary btn-ripple" style={{ width:"100%", padding:"0.8rem", fontSize:"0.9rem", gap:"0.5rem" }} onClick={() => onUpdate(t.id, "In Progress")}>
                            🚀 Check In & Start Job
                        </button>
                    )}
                    {t.status === "In Progress" && (
                        <button className="btn btn-ripple"
                            style={{ width:"100%", padding:"0.8rem", fontSize:"0.9rem", gap:"0.5rem", background:"linear-gradient(135deg,#10b981,#059669)", color:"white", border:"none", cursor:"pointer", borderRadius:12, fontWeight:600, boxShadow:"0 6px 20px rgba(16,185,129,0.3)" }}
                            onClick={() => onUpdate(t.id, "Completed")}>
                            ✅ Mark as Completed
                        </button>
                    )}
                    {t.status === "Completed" && (
                        <div style={{ textAlign:"center", padding:"0.6rem", background:"rgba(16,185,129,0.08)", borderRadius:10, border:"1px solid rgba(16,185,129,0.2)", color:"#34d399", fontWeight:600, fontSize:"0.88rem" }}>
                            Job Finished ✅
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmployeeDashboard() {
    const [tasks,   setTasks]   = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        try { const res = await api.get(`/bookings/employee/${user.id}`); setTasks(res.data); }
        catch(e) { console.error(e); }
        setLoading(false);
    // eslint-disable-next-line
    }, [user?.id]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const updateStatus = async (id, status) => {
        await api.put(`/bookings/${id}/status`, { status });
        fetchTasks();
    };

    const active    = tasks.filter(t => t.status !== "Completed");
    const completed = tasks.filter(t => t.status === "Completed");

    const STAT_CARDS = [
        { label:"Active Tasks",  val:active.length,    icon:"📋", grad:"linear-gradient(135deg,rgba(59,130,246,0.15),rgba(6,182,212,0.08))",  border:"rgba(59,130,246,0.25)",  color:"#60a5fa" },
        { label:"In Progress",   val:tasks.filter(t=>t.status==="In Progress").length, icon:"🚿", grad:"linear-gradient(135deg,rgba(139,92,246,0.15),rgba(167,139,250,0.06))", border:"rgba(139,92,246,0.25)", color:"#a78bfa" },
        { label:"Completed",     val:completed.length, icon:"✅", grad:"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(52,211,153,0.06))",  border:"rgba(16,185,129,0.25)",  color:"#34d399" },
    ];

    return (
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"3rem 2rem", position:"relative" }} className="fade-in">
            {/* Background */}
            <div style={{ position:"fixed", bottom:0, right:0, width:700, height:700, background:"radial-gradient(circle,rgba(139,92,246,0.06),transparent)", pointerEvents:"none", zIndex:0 }} />

            {/* ── Header ── */}
            <div style={{ marginBottom:"2.5rem", position:"relative", zIndex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"0.75rem" }}>
                    <div style={{ width:50, height:50, borderRadius:15, background:"linear-gradient(135deg,#a78bfa,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", boxShadow:"0 8px 24px rgba(139,92,246,0.35)" }}>
                        🔧
                    </div>
                    <div>
                        <h1 className="font-display" style={{ fontSize:"2rem", fontWeight:800, color:"white", letterSpacing:"-0.03em" }}>My Tasks</h1>
                        <p style={{ color:"#6b7280", fontSize:"0.9rem" }}>
                            Welcome, <span style={{ color:"#d1d5db", fontWeight:600 }}>{user?.name}</span> — 
                            <span style={{ color:"#60a5fa", fontWeight:600 }}> {active.length} active</span> task{active.length !== 1 ? "s" : ""} today
                        </p>
                    </div>
                </div>
                {/* Progress bar */}
                {tasks.length > 0 && (
                    <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:99, height:6, overflow:"hidden", maxWidth:400, marginTop:"0.5rem" }}>
                        <div className="progress-bar" style={{ width:`${(completed.length / tasks.length) * 100}%`, background:"linear-gradient(90deg,#10b981,#34d399)" }} />
                    </div>
                )}
                {tasks.length > 0 && (
                    <div style={{ fontSize:"0.78rem", color:"#4b5563", marginTop:"0.4rem" }}>
                        {completed.length} of {tasks.length} tasks completed
                    </div>
                )}
            </div>

            {/* ── 3D Stat Cards ── */}
            <div className="perspective" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.25rem", marginBottom:"2.5rem", position:"relative", zIndex:1 }}>
                {STAT_CARDS.map((s, i) => (
                    <div key={s.label} className={`stat-3d rotate-in-3d delay-${i + 1}`}
                        style={{ background:s.grad, border:`1px solid ${s.border}`, borderRadius:20, padding:"1.5rem", position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, background:`radial-gradient(circle,${s.color}20,transparent)`, borderRadius:"50%" }} />
                        <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>{s.icon}</div>
                        <div className="font-display" style={{ fontSize:"2.5rem", fontWeight:800, color:s.color, letterSpacing:"-0.04em", lineHeight:1, marginBottom:"0.5rem" }}>
                            {s.val}
                        </div>
                        <div style={{ fontSize:"0.8rem", color:"#6b7280", fontWeight:500 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Glow line ── */}
            <div className="glow-line" style={{ marginBottom:"2rem" }} />

            {/* ── Task Groups ── */}
            <div style={{ position:"relative", zIndex:1 }}>
                {loading ? (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
                        {[1,2,3].map(i => (
                            <div key={i} className="glass-card" style={{ padding:"1.5rem" }}>
                                <div className="skeleton" style={{ height:14, width:"50%", marginBottom:12 }} />
                                <div className="skeleton" style={{ height:20, width:"70%", marginBottom:16 }} />
                                <div className="skeleton" style={{ height:80, borderRadius:12, marginBottom:12 }} />
                                <div className="skeleton" style={{ height:44, borderRadius:12 }} />
                            </div>
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="glass-card float-3d" style={{ padding:"6rem 2rem", textAlign:"center" }}>
                        <div style={{ fontSize:"5rem", marginBottom:"1.25rem" }}>🎉</div>
                        <h2 className="font-display" style={{ fontSize:"1.4rem", fontWeight:700, color:"white", marginBottom:"0.5rem" }}>All clear!</h2>
                        <p style={{ color:"#6b7280", fontSize:"0.9rem" }}>No tasks assigned to you yet. Check back soon.</p>
                    </div>
                ) : (
                    <>
                        {active.length > 0 && (
                            <div style={{ marginBottom:"3rem" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.25rem" }}>
                                    <div style={{ fontSize:"0.75rem", fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                                        Active Tasks
                                    </div>
                                    <span className="badge badge-blue">{active.length}</span>
                                </div>
                                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"1.25rem" }}>
                                    {active.map(t => <TaskCard key={t.id} task={t} onUpdate={updateStatus} />)}
                                </div>
                            </div>
                        )}

                        {completed.length > 0 && (
                            <div style={{ opacity:0.65 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.25rem" }}>
                                    <div style={{ fontSize:"0.75rem", fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                                        Completed
                                    </div>
                                    <span className="badge badge-green">{completed.length}</span>
                                </div>
                                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"1.25rem" }}>
                                    {completed.map(t => <TaskCard key={t.id} task={t} onUpdate={updateStatus} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default EmployeeDashboard;
