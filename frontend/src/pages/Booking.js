import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import api from "../services/api";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PG = { maxWidth:1100, margin:"0 auto", padding:"3rem 1.5rem" };

// Map Event Component
function LocationMarker({ position, setPosition, setLocation }) {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            // Reverse geocoding using Nominatim
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
                const data = await res.json();
                if (data.display_name) setLocation(data.display_name);
            } catch (err) {
                console.error("Geocoding failed", err);
            }
        },
    });

    return position ? <Marker position={position} /> : null;
}

function Booking() {
    const [services, setServices] = useState([]);
    const [serviceIds, setServiceIds] = useState([]); // Changed to array
    const [date, setDate]         = useState("");
    const [location, setLocation] = useState("");
    const [coords, setCoords]     = useState([6.9271, 79.8612]); // Default: Colombo
    const [loading, setLoading]   = useState(false);

    const navigate  = useNavigate();
    const query     = new URLSearchParams(useLocation().search);
    const preId     = query.get("serviceId");
    const today     = new Date().toISOString().split("T")[0];
    const selectedServices = services.filter(s => serviceIds.includes(String(s.id)));
    const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);

    useEffect(() => {
        api.get("/services").then(res => {
            setServices(res.data);
            if (preId) setServiceIds([preId]); // Initialize with pre-selected
        });
    }, [preId]);

    const toggleService = (id) => {
        const sId = String(id);
        setServiceIds(prev => 
            prev.includes(sId) ? prev.filter(i => i !== sId) : [...prev, sId]
        );
    };

    const submit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) { navigate("/login"); return; }
        setLoading(true);
        try {
            await api.post("/bookings", { 
                user_id: user.id, 
                service_ids: serviceIds, 
                booking_date: date, 
                location: `${location} (Coords: ${coords[0].toFixed(5)}, ${coords[1].toFixed(5)})`
            });
            alert("Booking confirmed! We'll contact you soon.");
            navigate("/dashboard");
        } catch { alert("Booking failed. Please try again."); }
        setLoading(false);
    };

    return (
        <div style={PG} className="fade-in">
            <div style={{ marginBottom:"2.5rem" }}>
                <h1 style={{ fontFamily:"Space Grotesk,sans-serif", fontSize:"2.2rem", fontWeight:700, color:"white", letterSpacing:"-0.02em", marginBottom:"0.5rem" }}>
                    Schedule Your Service
                </h1>
                <p style={{ color:"#6b7280", fontSize:"1rem" }}>Customize your service and pinpoint your location on the map.</p>
            </div>

            <form onSubmit={submit}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:"2rem", alignItems:"start" }}>
                    
                    {/* Left Column */}
                    <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
                        
                        {/* 1. Package Selection */}
                        <div className="glass" style={{ padding:"1.75rem" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.5rem" }}>
                                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem", fontWeight:700, color:"#60a5fa" }}>1</div>
                                <h2 style={{ fontWeight:700, color:"white", fontSize:"1.1rem", margin:0 }}>Choose a Package</h2>
                            </div>
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem" }}>
                                {services.map(s => {
                                    const active = serviceIds.includes(String(s.id));
                                    return (
                                        <button key={s.id} type="button" onClick={() => toggleService(s.id)}
                                            style={{ textAlign:"left", padding:"1.25rem", borderRadius:14, cursor:"pointer", transition:"all 0.2s", background: active ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.02)", border: active ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.06)", outline:"none" }}>
                                            <div style={{ fontWeight:700, color: active ? "#60a5fa" : "white", fontSize:"0.95rem", marginBottom:"0.35rem" }}>{s.name}</div>
                                            <div style={{ color:"#6b7280", fontSize:"0.8rem", lineHeight:1.5, marginBottom:"1rem" }}>{s.description}</div>
                                            <div style={{ fontWeight:800, color:"#60a5fa", fontSize:"1.1rem" }}>Rs. {Number(s.price).toLocaleString()}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Map & Location */}
                        <div className="glass" style={{ padding:"1.75rem" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.5rem" }}>
                                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem", fontWeight:700, color:"#60a5fa" }}>2</div>
                                <h2 style={{ fontWeight:700, color:"white", fontSize:"1.1rem", margin:0 }}>Service Location</h2>
                            </div>
                            
                            <p style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1rem" }}>Click on the map to drop a pin at your exact location.</p>
                            
                            <div style={{ height:320, borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)", marginBottom:"1.25rem" }}>
                                <MapContainer center={coords} zoom={13} style={{ height:"100%", width:"100%" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                                    <LocationMarker position={coords} setPosition={setCoords} setLocation={setLocation} />
                                </MapContainer>
                            </div>

                            <div>
                                <label className="label">Confirmed Address</label>
                                <textarea className="input" rows={2} readOnly placeholder="Click on the map to set address..." value={location} style={{ background:"rgba(0,0,0,0.2)", cursor:"default" }} />
                                <p style={{ fontSize:"0.75rem", color:"#4b5563", marginTop:8 }}>* You can also manually adjust the address if needed by clicking different spots.</p>
                            </div>
                        </div>

                        {/* 3. Date */}
                        <div className="glass" style={{ padding:"1.75rem" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.5rem" }}>
                                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem", fontWeight:700, color:"#60a5fa" }}>3</div>
                                <h2 style={{ fontWeight:700, color:"white", fontSize:"1.1rem", margin:0 }}>Select Date</h2>
                            </div>
                            <div style={{ maxWidth:300 }}>
                                <label className="label">Preferred Date</label>
                                <input className="input" type="date" style={{ colorScheme:"dark" }} min={today} value={date} onChange={e=>setDate(e.target.value)} required />
                            </div>
                        </div>

                    </div>

                    {/* Sidebar / Summary */}
                    <div style={{ position:"sticky", top:100 }}>
                        <div className="glass" style={{ padding:"1.75rem" }}>
                            <h3 style={{ fontWeight:700, color:"white", marginBottom:"1.5rem", fontSize:"1.1rem" }}>Summary</h3>
                            
                            {selectedServices.length > 0 ? (
                                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                                    <div>
                                        <div style={{ fontSize:"0.75rem", color:"#6b7280", textTransform:"uppercase", fontWeight:600, letterSpacing:"0.05em", marginBottom:"0.25rem" }}>Selected Services ({selectedServices.length})</div>
                                        <div style={{ color:"white", fontWeight:600, fontSize:"0.85rem" }}>
                                            {selectedServices.map(s => s.name).join(', ')}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize:"0.75rem", color:"#6b7280", textTransform:"uppercase", fontWeight:600, letterSpacing:"0.05em", marginBottom:"0.25rem" }}>Date</div>
                                        <div style={{ color:"white", fontWeight:500 }}>{date || "Not selected"}</div>
                                    </div>
                                    {location && (
                                        <div>
                                            <div style={{ fontSize:"0.75rem", color:"#6b7280", textTransform:"uppercase", fontWeight:600, letterSpacing:"0.05em", marginBottom:"0.25rem" }}>Location</div>
                                            <div style={{ color:"#d1d5db", fontSize:"0.8rem", lineHeight:1.4 }}>{location.split(',').slice(0, 3).join(',')}</div>
                                        </div>
                                    )}
                                    <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"1.25rem", marginTop:"0.5rem" }}>
                                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                                            <span style={{ color:"#94a3b8", fontSize:"0.9rem" }}>Total</span>
                                            <span style={{ fontSize:"1.75rem", fontWeight:800, color:"#60a5fa", fontFamily:"Space Grotesk,sans-serif", letterSpacing:"-0.02em" }}>Rs. {totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width:"100%", padding:"1rem", marginTop:"0.5rem" }} disabled={loading || serviceIds.length === 0 || !location || !date}>
                                        {loading ? "Confirming..." : "Complete Booking"}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ textAlign:"center", padding:"1rem 0", color:"#4b5563", fontSize:"0.9rem" }}>
                                    Select at least one package to continue.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default Booking;