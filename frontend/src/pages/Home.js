import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/* ─── Animated Counter ──────────────────────────────────── */
function Counter({ target, suffix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let start = 0;
                const step = target / 60;
                const t = setInterval(() => {
                    start += step;
                    if (start >= target) { setCount(target); clearInterval(t); }
                    else setCount(Math.floor(start));
                }, 16);
                obs.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Service Icon ──────────────────────────────────────── */
const svcIcons = ["🚿","✨","🧴","🪣","🔧","🛞","💎","🧽"];

const FEATURES = [
    {
        icon: "📍",
        title: "We Come to You",
        desc: "Service at your home, office, or anywhere. Zero travel required on your part.",
    },
    {
        icon: "⚡",
        title: "Book in 2 Minutes",
        desc: "No queuing. Select your package, drop a pin, pick a date. Done.",
    },
    {
        icon: "👨‍🔧",
        title: "Certified Detailers",
        desc: "Trained professionals with premium-grade, eco-friendly products.",
    },
    {
        icon: "🛡️",
        title: "Fully Insured",
        desc: "Your vehicle is covered throughout the entire service process.",
    },
];

const HOW_IT_WORKS = [
    { step: "01", title: "Pick Your Service", desc: "Browse premium cleaning packages tailored to your car." },
    { step: "02", title: "Set Your Location", desc: "Drop a pin on the live map where you want us to come." },
    { step: "03", title: "Choose a Date", desc: "Select a date and time that fits your schedule." },
    { step: "04", title: "Sit Back & Relax", desc: "Our detailer shows up and leaves your car showroom-clean." },
];

export default function Home() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/services")
            .then(r => setServices(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="fade-in" style={{ overflowX: "hidden" }}>

            {/* ═══════════════════════════════════════════
                HERO
            ═══════════════════════════════════════════ */}
            <div style={{
                position: "relative",
                background: "linear-gradient(160deg, rgba(59,130,246,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
                paddingBottom: "4rem",
            }}>
                {/* Background orbs */}
                <div style={{ position:"absolute", top:"-20%", left:"-10%", width:600, height:600, background:"radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />
                <div style={{ position:"absolute", top:"10%", right:"-15%", width:500, height:500, background:"radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />

                <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center", padding:"5rem 0 3rem" }}>

                        {/* Left – Text */}
                        <div className="slide-left">
                            <div className="tag fade-up" style={{ marginBottom:"1.5rem" }}>
                                ✦ &nbsp;Sri Lanka's #1 Mobile Car Cleaning Platform
                            </div>
                            <h1 className="font-display" style={{ fontSize:"clamp(2.4rem,4.5vw,3.6rem)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.04em", color:"white", marginBottom:"1.25rem" }}>
                                Your Car,{" "}
                                <span className="gradient-text">Professionally</span>
                                <br />Cleaned at Your{" "}
                                <span className="gradient-text">Doorstep</span>
                            </h1>
                            <p style={{ fontSize:"1.05rem", color:"#94a3b8", lineHeight:1.8, marginBottom:"2.5rem", maxWidth:520 }}>
                                Skip the queue. Our certified detailers come to <strong style={{ color:"#d1d5db" }}>you</strong> — delivering showroom-quality results every single time.
                            </p>
                            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                                <Link to="/booking" className="btn btn-primary fade-up delay-2" style={{ fontSize:"1rem", padding:"0.9rem 2.25rem" }}>
                                    Book Now &nbsp;→
                                </Link>
                                <a href="#packages" className="btn btn-outline fade-up delay-3" style={{ fontSize:"1rem", padding:"0.9rem 2.25rem" }}>
                                    View Packages
                                </a>
                            </div>

                            {/* Stats row */}
                            <div style={{ display:"flex", gap:"2rem", marginTop:"3rem", paddingTop:"2rem", borderTop:"1px solid rgba(255,255,255,0.07)", flexWrap:"wrap" }}>
                                {[
                                    { val: 500, suffix: "+", label: "Happy Customers" },
                                    { val: 4.9, suffix: "★", label: "Average Rating" },
                                    { val: 100, suffix: "%", label: "Satisfaction" },
                                ].map(s => (
                                    <div key={s.label}>
                                        <div className="font-display" style={{ fontSize:"1.8rem", fontWeight:800, color:"white", letterSpacing:"-0.03em" }}>
                                            <Counter target={s.val} suffix={s.suffix} />
                                        </div>
                                        <div style={{ fontSize:"0.8rem", color:"#6b7280", marginTop:"0.2rem" }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right – Hero Image */}
                        <div className="slide-right float-anim" style={{ position:"relative" }}>
                            <div className="hero-image-wrap">
                                <img
                                    src="/hero.png"
                                    alt="Professional car cleaning service"
                                    style={{ width:"100%", height:420, objectFit:"cover", borderRadius:24 }}
                                />
                            </div>
                            {/* Floating badge */}
                            <div className="glass-card pulse-glow" style={{ position:"absolute", bottom:24, left:-24, padding:"0.9rem 1.4rem", display:"flex", alignItems:"center", gap:"0.75rem", borderRadius:16, zIndex:10 }}>
                                <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#10b981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 }}>
                                    ✓
                                </div>
                                <div>
                                    <div style={{ fontWeight:700, color:"white", fontSize:"0.9rem" }}>Booking Confirmed!</div>
                                    <div style={{ color:"#6b7280", fontSize:"0.78rem" }}>Arrives in 45 minutes</div>
                                </div>
                            </div>
                            {/* Rating badge */}
                            <div className="glass-card" style={{ position:"absolute", top:24, right:-16, padding:"0.75rem 1.1rem", borderRadius:14, textAlign:"center", zIndex:10 }}>
                                <div className="font-display" style={{ fontSize:"1.4rem", fontWeight:800, color:"#fbbf24" }}>4.9★</div>
                                <div style={{ color:"#6b7280", fontSize:"0.72rem" }}>2,400+ reviews</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                WHY CHOOSE US
            ═══════════════════════════════════════════ */}
            <div style={{ maxWidth:1280, margin:"0 auto", padding:"5rem 2rem 4rem" }}>
                <div style={{ textAlign:"center", marginBottom:"3rem" }}>
                    <div className="tag" style={{ marginBottom:"1rem" }}>Why SparkleDrive?</div>
                    <h2 className="font-display" style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:700, color:"white", letterSpacing:"-0.03em", marginBottom:"0.75rem" }}>
                        Premium quality, maximum convenience
                    </h2>
                    <p style={{ color:"#6b7280", maxWidth:520, margin:"0 auto", fontSize:"0.95rem", lineHeight:1.7 }}>
                        Everything you need for a spotless car — without leaving your home.
                    </p>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"1.25rem" }}>
                    {FEATURES.map((f, i) => (
                        <div key={f.title} className={`glass-card card-hover fade-up delay-${i + 1}`} style={{ padding:"1.75rem", display:"flex", gap:"1.25rem", alignItems:"flex-start" }}>
                            <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,rgba(59,130,246,0.2),rgba(6,182,212,0.15))", border:"1px solid rgba(59,130,246,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", flexShrink:0 }}>
                                {f.icon}
                            </div>
                            <div>
                                <div style={{ fontWeight:700, color:"white", fontSize:"0.97rem", marginBottom:"0.4rem" }}>{f.title}</div>
                                <div style={{ color:"#6b7280", fontSize:"0.84rem", lineHeight:1.7 }}>{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                HOW IT WORKS
            ═══════════════════════════════════════════ */}
            <div style={{ background:"linear-gradient(135deg,rgba(59,130,246,0.04),rgba(6,182,212,0.03))", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"5rem 0" }}>
                <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem" }}>
                    <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
                        <div className="tag" style={{ marginBottom:"1rem" }}>Simple Process</div>
                        <h2 className="font-display" style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:700, color:"white", letterSpacing:"-0.03em" }}>
                            How it works
                        </h2>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1.5rem", position:"relative" }}>
                        {HOW_IT_WORKS.map((h, i) => (
                            <div key={h.step} className={`glass-card card-hover fade-up delay-${i + 1}`} style={{ padding:"2rem 1.75rem", textAlign:"center", position:"relative" }}>
                                <div className="font-display" style={{ fontSize:"3rem", fontWeight:800, color:"rgba(59,130,246,0.12)", letterSpacing:"-0.04em", marginBottom:"1rem" }}>
                                    {h.step}
                                </div>
                                <div style={{ fontWeight:700, color:"white", fontSize:"1rem", marginBottom:"0.5rem" }}>{h.title}</div>
                                <div style={{ color:"#6b7280", fontSize:"0.85rem", lineHeight:1.6 }}>{h.desc}</div>
                                {i < HOW_IT_WORKS.length - 1 && (
                                    <div style={{ display:"none" }} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign:"center", marginTop:"3rem" }}>
                        <Link to="/booking" className="btn btn-primary" style={{ padding:"1rem 2.75rem", fontSize:"1rem" }}>
                            Get Started Today →
                        </Link>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SERVICE PACKAGES
            ═══════════════════════════════════════════ */}
            <div id="packages" style={{ maxWidth:1280, margin:"0 auto", padding:"5rem 2rem" }}>
                <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
                    <div className="tag" style={{ marginBottom:"1rem" }}>Our Packages</div>
                    <h2 className="font-display" style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:700, color:"white", letterSpacing:"-0.03em", marginBottom:"0.75rem" }}>
                        Service Packages
                    </h2>
                    <p style={{ color:"#6b7280", maxWidth:480, margin:"0 auto", fontSize:"0.95rem" }}>
                        Choose the plan that suits your car and your budget.
                    </p>
                </div>

                {loading ? (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.5rem" }}>
                        {[1,2,3].map(i => (
                            <div key={i} className="glass-card" style={{ padding:"1.75rem" }}>
                                <div className="skeleton" style={{ height:180, borderRadius:12, marginBottom:16 }} />
                                <div className="skeleton" style={{ height:14, width:"60%", marginBottom:10 }} />
                                <div className="skeleton" style={{ height:11, marginBottom:8 }} />
                                <div className="skeleton" style={{ height:11, width:"80%", marginBottom:24 }} />
                                <div className="skeleton" style={{ height:42, borderRadius:10 }} />
                            </div>
                        ))}
                    </div>
                ) : services.length === 0 ? (
                    <div style={{ textAlign:"center", color:"#4b5563", padding:"4rem", background:"rgba(255,255,255,0.02)", borderRadius:20, border:"1px dashed rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🚿</div>
                        <div>No packages available yet. Check back soon.</div>
                    </div>
                ) : (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.5rem" }}>
                        {services.map((s, i) => (
                            <div key={s.id} className={`service-card fade-up delay-${(i % 4) + 1}`}>
                                {/* Image section */}
                                <div style={{ overflow:"hidden", borderRadius:"20px 20px 0 0", position:"relative" }}>
                                    <img
                                        src={i % 2 === 0 ? "/hero.png" : "/interior.png"}
                                        alt={s.name}
                                        className="service-card-img"
                                    />
                                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 40%,rgba(6,11,24,0.85))" }} />
                                    <div style={{ position:"absolute", bottom:12, left:16 }}>
                                        <span style={{ fontSize:"1.75rem" }}>{svcIcons[i % svcIcons.length]}</span>
                                    </div>
                                    <div style={{ position:"absolute", top:12, right:12 }} className="badge badge-blue">
                                        Premium
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding:"1.5rem", flex:1, display:"flex", flexDirection:"column" }}>
                                    <div style={{ fontWeight:700, color:"white", fontSize:"1.05rem", marginBottom:"0.5rem" }}>{s.name}</div>
                                    <p style={{ color:"#6b7280", fontSize:"0.85rem", lineHeight:1.7, flex:1, marginBottom:"1.25rem" }}>{s.description}</p>
                                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
                                        <div className="font-display" style={{ fontSize:"1.75rem", fontWeight:800, color:"var(--blue-light)", letterSpacing:"-0.02em" }}>
                                            Rs. {Number(s.price).toLocaleString()}
                                        </div>
                                        <span className="tag" style={{ fontSize:"0.72rem" }}>⏱ 2–3 hrs</span>
                                    </div>
                                    <Link to={`/booking?serviceId=${s.id}`} className="btn btn-primary" style={{ width:"100%", padding:"0.75rem", fontSize:"0.9rem" }}>
                                        Book This Package →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════
                TESTIMONIAL BANNER
            ═══════════════════════════════════════════ */}
            <div style={{ background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(6,182,212,0.05))", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"4rem 0" }}>
                <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1.5rem" }}>
                        {[
                            { val: 500, suffix: "+", label: "Cars Cleaned", icon: "🚗" },
                            { val: 98, suffix: "%", label: "Customer Satisfaction", icon: "🌟" },
                            { val: 50, suffix: "+", label: "Expert Detailers", icon: "👨‍🔧" },
                            { val: 5, suffix: " yrs", label: "In Business", icon: "🏆" },
                        ].map(s => (
                            <div key={s.label} className="stat-chip">
                                <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>{s.icon}</div>
                                <div className="font-display" style={{ fontSize:"1.75rem", fontWeight:800, color:"white", letterSpacing:"-0.03em" }}>
                                    <Counter target={s.val} suffix={s.suffix} />
                                </div>
                                <div style={{ color:"#6b7280", fontSize:"0.82rem", marginTop:"0.25rem" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                CTA SECTION
            ═══════════════════════════════════════════ */}
            <div style={{ maxWidth:1280, margin:"0 auto", padding:"5rem 2rem" }}>
                <div className="glass-accent" style={{ padding:"4rem", textAlign:"center", borderRadius:28, position:"relative", overflow:"hidden" }}>
                    {/* Glow orbs */}
                    <div style={{ position:"absolute", top:"50%", left:"10%", width:300, height:300, background:"radial-gradient(circle,rgba(59,130,246,0.15),transparent)", transform:"translateY(-50%)", pointerEvents:"none" }} />
                    <div style={{ position:"absolute", top:"50%", right:"10%", width:300, height:300, background:"radial-gradient(circle,rgba(6,182,212,0.1),transparent)", transform:"translateY(-50%)", pointerEvents:"none" }} />
                    <div style={{ position:"relative", zIndex:1 }}>
                        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✨</div>
                        <h2 className="font-display" style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:800, color:"white", letterSpacing:"-0.03em", marginBottom:"1rem" }}>
                            Ready for a showroom-clean car?
                        </h2>
                        <p style={{ color:"#94a3b8", maxWidth:480, margin:"0 auto 2rem", fontSize:"1rem", lineHeight:1.7 }}>
                            Book in 2 minutes. We handle the rest.
                        </p>
                        <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
                            <Link to="/booking" className="btn btn-primary" style={{ padding:"1rem 2.5rem", fontSize:"1rem" }}>
                                Book a Cleaning →
                            </Link>
                            <Link to="/register" className="btn btn-outline" style={{ padding:"1rem 2.5rem", fontSize:"1rem" }}>
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════ */}
            <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"2.5rem 0" }}>
                <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                        <img src="/logo.png" alt="SparkleDrive" style={{ width:34, height:34, borderRadius:10, objectFit:"cover" }} />
                        <span className="font-display" style={{ fontWeight:700, fontSize:"1.1rem", color:"white" }}>
                            Sparkle<span style={{ color:"#60a5fa" }}>Drive</span>
                        </span>
                    </div>
                    <div style={{ color:"#4b5563", fontSize:"0.83rem" }}>
                        © {new Date().getFullYear()} SparkleDrive. All rights reserved.
                    </div>
                    <div style={{ display:"flex", gap:"1.5rem" }}>
                        {["Home","Book","Contact"].map(l => (
                            <a key={l} href="/#" style={{ color:"#4b5563", fontSize:"0.83rem", textDecoration:"none", transition:"color 0.2s" }}
                                onMouseEnter={e => e.target.style.color="#94a3b8"}
                                onMouseLeave={e => e.target.style.color="#4b5563"}
                            >{l}</a>
                        ))}
                    </div>
                </div>
            </footer>

        </div>
    );
}
