import React, { useEffect, useState } from "react";
import api from "../services/api";

const BADGE_META = {
    Pending:       { color:"#fbbf24", bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.25)",  icon:"🕐" },
    Assigned:      { color:"#60a5fa", bg:"rgba(59,130,246,0.12)",  border:"rgba(59,130,246,0.25)",  icon:"👷" },
    "In Progress": { color:"#a78bfa", bg:"rgba(139,92,246,0.12)", border:"rgba(139,92,246,0.25)", icon:"🚿" },
    Completed:     { color:"#34d399", bg:"rgba(16,185,129,0.12)",  border:"rgba(16,185,129,0.25)",  icon:"✅" },
};

const Badge = ({ status }) => {
    const m = BADGE_META[status] || { color:"#9ca3af", bg:"rgba(255,255,255,0.06)", border:"rgba(255,255,255,0.1)", icon:"•" };
    return (
        <span style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", padding:"0.25rem 0.75rem", borderRadius:99, fontSize:"0.71rem", fontWeight:700, letterSpacing:"0.04em", background:m.bg, color:m.color, border:`1px solid ${m.border}` }}>
            {m.icon} {status}
        </span>
    );
};

const ADMIN_STATS = [
    { label:"Total Bookings", key:"bookings",  icon:"📋", grad:"linear-gradient(135deg,rgba(59,130,246,0.18),rgba(6,182,212,0.1))",   border:"rgba(59,130,246,0.25)",  color:"white"   },
    { label:"Pending",        key:"pending",   icon:"🕐", grad:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(251,191,36,0.06))", border:"rgba(245,158,11,0.25)", color:"#fbbf24" },
    { label:"Employees",      key:"employees", icon:"👨‍🔧", grad:"linear-gradient(135deg,rgba(6,182,212,0.15),rgba(59,130,246,0.08))",   border:"rgba(6,182,212,0.25)",   color:"#22d3ee" },
    { label:"Services",       key:"services",  icon:"✨", grad:"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(52,211,153,0.06))",  border:"rgba(16,185,129,0.25)",  color:"#34d399" },
];

export default function AdminDashboard() {
    const [bookings,  setBookings]  = useState([]);
    const [employees, setEmployees] = useState([]);
    const [services,  setServices]  = useState([]);
    const [activeTab, setActiveTab] = useState("bookings");
    const [showEmpModal, setShowEmpModal] = useState(false);
    const [showSvcModal, setShowSvcModal] = useState(false);
    const [editingSvcId, setEditingSvcId] = useState(null);
    const [emp, setEmp] = useState({ name:"", email:"", password:"" });
    const [svc, setSvc] = useState({ name:"", description:"", price:"" });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        const [b, e, s] = await Promise.all([api.get("/bookings"), api.get("/employees"), api.get("/services")]);
        setBookings(b.data); setEmployees(e.data); setServices(s.data);
    };

    const handleAssign = async (bookingId, employeeId) => {
        await api.put(`/bookings/${bookingId}/assign`, { employee_id: employeeId });
        await api.put(`/bookings/${bookingId}/status`, { status: "Assigned" });
        fetchAll();
    };

    const handleAddEmp  = async (e) => { e.preventDefault(); try { await api.post("/employees", emp); setShowEmpModal(false); setEmp({name:"",email:"",password:""}); fetchAll(); } catch(err) { alert(err.response?.data?.message || "Failed"); } };
    const handleDelEmp  = async (id) => { if (!window.confirm("Delete this employee?")) return; await api.delete(`/employees/${id}`); fetchAll(); };
    const handleSaveSvc = async (e) => { e.preventDefault(); if (editingSvcId) await api.put(`/services/${editingSvcId}`, svc); else await api.post("/services", svc); setShowSvcModal(false); setSvc({name:"",description:"",price:""}); setEditingSvcId(null); fetchAll(); };
    const handleDelSvc  = async (id) => { if (!window.confirm("Delete this service?")) return; await api.delete(`/services/${id}`); fetchAll(); };

    const statsVals = {
        bookings:  bookings.length,
        pending:   bookings.filter(b => b.status==="Pending").length,
        employees: employees.length,
        services:  services.length,
    };

    const TABS = [
        { key:"bookings",  label:"Bookings",  count:bookings.length,  icon:"📋" },
        { key:"employees", label:"Employees", count:employees.length, icon:"👥" },
        { key:"services",  label:"Services",  count:services.length,  icon:"✨" },
    ];

    return (
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"3rem 2rem", position:"relative" }} className="fade-in">
            {/* Background */}
            <div style={{ position:"fixed", top:0, left:0, width:800, height:800, background:"radial-gradient(circle at 20% 20%,rgba(59,130,246,0.05),transparent)", pointerEvents:"none", zIndex:0 }} />

            {/* ── Header ── */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", marginBottom:"2rem", position:"relative", zIndex:1 }}>
                <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.5rem" }}>
                        <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#8b5cf6,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", boxShadow:"0 6px 20px rgba(139,92,246,0.35)" }}>
                            ⚡
                        </div>
                        <h1 className="font-display" style={{ fontSize:"2rem", fontWeight:800, color:"white", letterSpacing:"-0.03em" }}>Admin Dashboard</h1>
                    </div>
                    <p style={{ color:"#6b7280", fontSize:"0.9rem" }}>Manage bookings, staff, and service packages</p>
                </div>
                <div style={{ display:"flex", gap:"0.75rem" }}>
                    <button className="btn btn-ghost btn-ripple" onClick={() => setShowEmpModal(true)} style={{ gap:"0.4rem" }}>
                        👤 Add Employee
                    </button>
                    <button className="btn btn-primary btn-ripple" onClick={() => { setEditingSvcId(null); setSvc({name:"",description:"",price:""}); setShowSvcModal(true); }} style={{ gap:"0.4rem" }}>
                        ✨ New Package
                    </button>
                </div>
            </div>

            {/* ── 3D Stat Cards ── */}
            <div className="perspective" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:"1.25rem", marginBottom:"2.5rem", position:"relative", zIndex:1 }}>
                {ADMIN_STATS.map((s, i) => (
                    <div key={s.key} className={`stat-3d rotate-in-3d delay-${i + 1}`}
                        style={{ background:s.grad, border:`1px solid ${s.border}`, borderRadius:20, padding:"1.5rem", position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:-24, right:-24, width:90, height:90, background:`radial-gradient(circle,${s.color}15,transparent)`, borderRadius:"50%" }} />
                        <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>{s.icon}</div>
                        <div className="font-display" style={{ fontSize:"2.5rem", fontWeight:800, color:s.color, letterSpacing:"-0.04em", lineHeight:1, marginBottom:"0.5rem" }}>
                            {statsVals[s.key]}
                        </div>
                        <div style={{ fontSize:"0.8rem", color:"#6b7280", fontWeight:500 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Glow line ── */}
            <div className="glow-line" style={{ marginBottom:"2rem" }} />

            {/* ── Tabs ── */}
            <div style={{ display:"flex", gap:"0.25rem", marginBottom:"2rem", background:"rgba(255,255,255,0.02)", borderRadius:14, padding:"0.25rem", border:"1px solid rgba(255,255,255,0.06)", width:"fit-content", position:"relative", zIndex:1 }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        style={{ padding:"0.6rem 1.25rem", background: activeTab===t.key ? "linear-gradient(135deg,rgba(59,130,246,0.25),rgba(6,182,212,0.15))" : "transparent",
                            border: activeTab===t.key ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                            borderRadius:10, color: activeTab===t.key ? "#60a5fa" : "#6b7280", fontWeight:600, fontSize:"0.875rem", cursor:"pointer",
                            transition:"all 0.25s ease", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        {t.icon} {t.label}
                        <span style={{ fontSize:"0.68rem", fontWeight:700, padding:"0.1rem 0.5rem", borderRadius:99, background: activeTab===t.key ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)", color: activeTab===t.key ? "#60a5fa" : "#4b5563" }}>
                            {t.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── BOOKINGS TAB ── */}
            {activeTab === "bookings" && (
                <div className="glass-card rotate-in-3d" style={{ overflow:"hidden", position:"relative", zIndex:1 }}>
                    <div style={{ padding:"1.25rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <h3 className="font-display" style={{ color:"white", fontWeight:700 }}>All Bookings</h3>
                        <span className="badge badge-blue">{bookings.length} total</span>
                    </div>
                    <div style={{ overflowX:"auto" }}>
                        <table className="table-grid" style={{ width:"100%" }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Services</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Assign Employee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id} className="booking-row">
                                        <td style={{ color:"#4b5563", fontSize:"0.8rem" }}>#{b.id}</td>
                                        <td>
                                            <div style={{ display:"flex", alignItems:"center", gap:"0.65rem" }}>
                                                <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", fontWeight:700, color:"white", flexShrink:0 }}>
                                                    {b.customer_name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight:600, color:"white", fontSize:"0.88rem" }}>{b.customer_name}</div>
                                                    <div style={{ fontSize:"0.72rem", color:"#4b5563", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#d1d5db", fontSize:"0.85rem" }} title={b.service_names}>
                                                {b.service_names}
                                            </div>
                                        </td>
                                        <td style={{ color:"#9ca3af", fontSize:"0.85rem" }}>{new Date(b.booking_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                                        <td>
                                            <span className="font-display" style={{ color:"#60a5fa", fontWeight:700 }}>
                                                Rs. {Number(b.total_price).toLocaleString()}
                                            </span>
                                        </td>
                                        <td><Badge status={b.status} /></td>
                                        <td>
                                            <select value={b.employee_id||""} onChange={e => handleAssign(b.id, e.target.value)}
                                                className="input" style={{ width:"auto", padding:"0.4rem 0.8rem", fontSize:"0.82rem", minWidth:140 }}>
                                                <option value="" disabled>Select staff…</option>
                                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {bookings.length === 0 && (
                            <div style={{ padding:"4rem", textAlign:"center", color:"#4b5563" }}>No bookings yet.</div>
                        )}
                    </div>
                </div>
            )}

            {/* ── EMPLOYEES TAB ── */}
            {activeTab === "employees" && (
                <div style={{ position:"relative", zIndex:1 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
                        {employees.map((e, i) => (
                            <div key={e.id} className={`glass-card card-3d rotate-in-3d delay-${(i % 4) + 1}`} style={{ padding:"1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                                    <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#3b82f6,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", fontWeight:800, color:"white", flexShrink:0, boxShadow:"0 6px 16px rgba(59,130,246,0.3)" }}>
                                        {e.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight:700, color:"white", fontSize:"0.97rem" }}>{e.name}</div>
                                        <div style={{ color:"#6b7280", fontSize:"0.8rem", marginTop:2 }}>{e.email}</div>
                                        <span className="badge badge-cyan" style={{ marginTop:6, fontSize:"0.65rem" }}>Employee</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelEmp(e.id)} className="btn btn-danger" style={{ padding:"0.4rem 0.75rem", fontSize:"0.8rem" }}>
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button onClick={() => setShowEmpModal(true)}
                            style={{ border:"1px dashed rgba(59,130,246,0.3)", borderRadius:20, padding:"1.5rem", cursor:"pointer", background:"rgba(59,130,246,0.03)", color:"#60a5fa", fontWeight:600, fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", transition:"all 0.2s" }}>
                            <span style={{ fontSize:"1.5rem" }}>+</span> Add Employee
                        </button>
                    </div>
                    {employees.length === 0 && (
                        <div style={{ textAlign:"center", padding:"4rem", color:"#4b5563" }}>No employees yet.</div>
                    )}
                </div>
            )}

            {/* ── SERVICES TAB ── */}
            {activeTab === "services" && (
                <div style={{ position:"relative", zIndex:1 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
                        {services.map((s, i) => (
                            <div key={s.id} className={`glass-card card-3d rotate-in-3d delay-${(i % 4) + 1}`} style={{ padding:"1.75rem", position:"relative", overflow:"hidden" }}>
                                {/* Top accent */}
                                <div className="gradient-anim" style={{ position:"absolute", top:0, left:0, right:0, height:3, borderRadius:"20px 20px 0 0" }} />
                                <div style={{ position:"absolute", top:"1rem", right:"1rem", display:"flex", gap:"0.4rem" }}>
                                    <button onClick={() => { setEditingSvcId(s.id); setSvc({name:s.name,description:s.description,price:s.price}); setShowSvcModal(true); }}
                                        style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:9, padding:"0.35rem 0.6rem", cursor:"pointer", fontSize:"0.85rem", transition:"all 0.2s" }}>✏️</button>
                                    <button onClick={() => handleDelSvc(s.id)}
                                        style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:9, padding:"0.35rem 0.6rem", cursor:"pointer", fontSize:"0.85rem", transition:"all 0.2s" }}>🗑️</button>
                                </div>
                                <div style={{ fontSize:"2.25rem", marginBottom:"0.75rem" }}>✨</div>
                                <div style={{ fontWeight:700, color:"white", fontSize:"1.05rem", marginBottom:"0.5rem" }}>{s.name}</div>
                                <p style={{ color:"#6b7280", fontSize:"0.84rem", lineHeight:1.7, marginBottom:"1.25rem", minHeight:56 }}>{s.description}</p>
                                <div className="font-display" style={{ fontSize:"1.6rem", fontWeight:800, color:"#60a5fa", letterSpacing:"-0.03em" }}>
                                    Rs. {Number(s.price).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        <button onClick={() => { setEditingSvcId(null); setSvc({name:"",description:"",price:""}); setShowSvcModal(true); }}
                            style={{ border:"1px dashed rgba(59,130,246,0.3)", borderRadius:20, padding:"1.75rem", cursor:"pointer", background:"rgba(59,130,246,0.02)", color:"#60a5fa", fontWeight:600, fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", transition:"all 0.2s" }}>
                            <span style={{ fontSize:"1.5rem" }}>+</span> New Package
                        </button>
                    </div>
                </div>
            )}

            {/* ── Employee Modal ── */}
            {showEmpModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.75rem" }}>
                            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>👤</div>
                            <h2 className="font-display" style={{ fontWeight:700, color:"white", fontSize:"1.25rem" }}>Add New Employee</h2>
                        </div>
                        <form onSubmit={handleAddEmp}>
                            {[["Full Name","text","Jane Smith","name"],["Email Address","email","jane@company.com","email"],["Password","password","••••••••","password"]].map(([lbl,type,ph,key]) => (
                                <div key={key} style={{ marginBottom:"1.25rem" }}>
                                    <label className="label">{lbl}</label>
                                    <input className="input" type={type} placeholder={ph} value={emp[key]} onChange={e => setEmp({...emp,[key]:e.target.value})} required />
                                </div>
                            ))}
                            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
                                <button type="button" className="btn btn-ghost" style={{ flex:1 }} onClick={() => setShowEmpModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-ripple" style={{ flex:1 }}>Create Account →</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Service Modal ── */}
            {showSvcModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.75rem" }}>
                            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#10b981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>✨</div>
                            <h2 className="font-display" style={{ fontWeight:700, color:"white", fontSize:"1.25rem" }}>
                                {editingSvcId ? "Edit Package" : "New Service Package"}
                            </h2>
                        </div>
                        <form onSubmit={handleSaveSvc}>
                            <div style={{ marginBottom:"1.25rem" }}>
                                <label className="label">Package Name</label>
                                <input className="input" placeholder="e.g. Premium Wash" value={svc.name} onChange={e => setSvc({...svc,name:e.target.value})} required />
                            </div>
                            <div style={{ marginBottom:"1.25rem" }}>
                                <label className="label">Description</label>
                                <textarea className="input" rows={3} placeholder="What's included…" value={svc.description} onChange={e => setSvc({...svc,description:e.target.value})} required />
                            </div>
                            <div style={{ marginBottom:"1.75rem" }}>
                                <label className="label">Price (Rs.)</label>
                                <input className="input" type="number" min="0" placeholder="5000" value={svc.price} onChange={e => setSvc({...svc,price:e.target.value})} required />
                            </div>
                            <div style={{ display:"flex", gap:"0.75rem" }}>
                                <button type="button" className="btn btn-ghost" style={{ flex:1 }} onClick={() => setShowSvcModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-ripple" style={{ flex:1 }}>{editingSvcId ? "Update →" : "Create →"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
