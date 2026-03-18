import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState("");
    const [loading, setLoading]   = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); setError(""); setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            const role = res.data.user.role;
            navigate(role === "admin" ? "/admin" : role === "employee" ? "/employee" : "/dashboard");
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || "Incorrect email or password.");
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight:"calc(100vh - 72px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem 1rem", position:"relative", overflow:"hidden" }} className="fade-in">
            {/* Background orbs */}
            <div style={{ position:"fixed", top:"-20%", left:"-10%", width:500, height:500, background:"radial-gradient(circle,rgba(59,130,246,0.1),transparent)", pointerEvents:"none", zIndex:0 }} />
            <div style={{ position:"fixed", bottom:"-10%", right:"-10%", width:400, height:400, background:"radial-gradient(circle,rgba(6,182,212,0.07),transparent)", pointerEvents:"none", zIndex:0 }} />

            <div style={{ width:"100%", maxWidth:440, position:"relative", zIndex:1 }}>
                {/* Logo */}
                <div style={{ textAlign:"center", marginBottom:"2rem" }}>
                    <img src="/logo.png" alt="SparkleDrive Logo" style={{ width:60, height:60, borderRadius:18, objectFit:"cover", margin:"0 auto 1.25rem", display:"block", boxShadow:"0 8px 24px rgba(59,130,246,0.35)" }} />
                    <h1 className="font-display" style={{ fontSize:"1.85rem", fontWeight:800, color:"white", letterSpacing:"-0.03em", marginBottom:"0.4rem" }}>Welcome back</h1>
                    <p style={{ color:"#6b7280", fontSize:"0.9rem" }}>Sign in to manage your bookings</p>
                </div>

                <div className="glass-card" style={{ padding:"2.25rem" }}>
                    {error && (
                        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, padding:"0.85rem 1rem", color:"#f87171", fontSize:"0.875rem", marginBottom:"1.5rem" }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom:"1.25rem" }}>
                            <label className="label">Email Address</label>
                            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div style={{ marginBottom:"1.75rem" }}>
                            <label className="label">Password</label>
                            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width:"100%", padding:"0.95rem", fontSize:"0.95rem" }} disabled={loading}>
                            {loading ? (
                                <span style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                                    <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin-slow 0.8s linear infinite", display:"inline-block" }} />
                                    Signing in…
                                </span>
                            ) : "Sign In →"}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign:"center", marginTop:"1.5rem", fontSize:"0.875rem", color:"#6b7280" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color:"#60a5fa", fontWeight:600 }}>Create one free</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
