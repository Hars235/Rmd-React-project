// src/pages/VideoConsultPage.tsx
import React from "react";
import "../App.css";   // ✅ CORRECT - go up one level to src/

type SpecialityCard = {
  title: string;
  price: string;
  image: string;
};

type ConcernCard = {
  title: string;
  price: string;
  image: string;
};

type DoctorCard = {
  name: string;
  speciality: string;
  experience: string;
  consults: string;
  avatar: string;
};

type VideoCard = {
  title: string;
  subtitle: string;
  thumbnail: string;
};

const specialities: SpecialityCard[] = [
  {
    title: "Gynaecology",
    price: "₹499",
    image: "/images/consult/perioda%20photo.png",
  },
  {
    title: "Sexology",
    price: "₹499",
    image: "/images/consult/performance%20photo.png",
  },
  {
    title: "General physician",
    price: "₹399",
    image: "/images/consult/cold%20photo.png",
  },
  {
    title: "Dermatology",
    price: "₹449",
    image: "/images/consult/Skin%20photo.png",
  },
  {
    title: "Psychiatry",
    price: "₹499",
    image: "/images/consult/anxiety_photo.png",
  },
];

const concerns: ConcernCard[] = [
  {
    title: "Cough & Cold?",
    price: "₹399",
    image: "/images/consult/cold%20photo.png",
  },
  {
    title: "Period problems?",
    price: "₹499",
    image: "/images/consult/perioda%20photo.png",
  },
  {
    title: "Performance issues in bed?",
    price: "₹499",
    image: "/images/consult/performance%20photo.png",
  },
  {
    title: "Skin problems?",
    price: "₹449",
    image: "/images/consult/Skin%20photo.png",
  },
];

const doctors: DoctorCard[] = [
  {
    name: "Dr. Murali Reddy",
    speciality: "Dermatologist",
    experience: "8 years experience",
    consults: "73951 consults done",
    avatar: "/images/cards/doctors.jpg",
  },
  {
    name: "Dr. Hitesh Viradiya",
    speciality: "Dermatologist, Cosmetologist",
    experience: "9 years experience",
    consults: "62311 consults done",
    avatar: "/images/cards/Diagnosticimages.jpg",
  },
  {
    name: "Dr. Anshuman Gupta",
    speciality: "Cardiologist",
    experience: "11 years experience",
    consults: "10991 consults done",
    avatar: "/images/cards/patients2.jpg",
  },
  {
    name: "Dr. Tejashree M",
    speciality: "Obstetrician, Gynecologist",
    experience: "9 years experience",
    consults: "29118 consults done",
    avatar: "/images/cards/doctors.jpg",
  },
];

const videos: VideoCard[] = [
  {
    title: "#HelloDoctor Consult a doctor online from home",
    subtitle: "Say goodbye doubts. Say hello doctor.",
    thumbnail: "/images/cards/doctors.jpg",
  },
  {
    title: "#HelloDoctor Consult a doctor online from home",
    subtitle: "Online doctor consultation from the comfort of your home.",
    thumbnail: "/images/cards/patients2.jpg",
  },
  {
    title: "Video consult with top doctors online",
    subtitle: "Experience online doctor consultations.",
    thumbnail: "/images/cards/Diagnosticimages.jpg",
  },
];

const VideoConsultPage: React.FC = () => {
  const handleConsultNow = () => {
    alert("In a real app this would open the video consult booking flow.");
  };

  return (
    <div className="vc-page" style={{ background: "#fff" }}>
      {/* HERO */}
      <section className="vc-hero" style={{ padding: "28px 0", background: "transparent" }}>
        <div className="vc-hero-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 24, alignItems: "center", padding: "0 24px" }}>
          <div className="vc-hero-text" style={{ flex: 1 }}>
            <p className="vc-hero-tag" style={{ margin: 0, color: "#0f172a", fontWeight: 600 }}>Video Consult</p>
            <h1 className="vc-hero-title" style={{ fontSize: 32, margin: "8px 0 12px" }}>
              Skip the travel!
              <br />
              Take Online Doctor Consultation
            </h1>
            <p className="vc-hero-sub" style={{ margin: "0 0 16px", color: "#374151" }}>
              Private consultation + Audio / Video call – starts at just <b>₹199</b>.
            </p>

            <div className="vc-hero-doctors-row" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div className="vc-hero-avatars" style={{ display: "flex", gap: -8 }}>
                <span className="vc-hero-avatar vc-hero-avatar-1" style={{ width: 40, height: 40, borderRadius: 999, background: "#e6eef6", display: "inline-block" }} />
                <span className="vc-hero-avatar vc-hero-avatar-2" style={{ width: 40, height: 40, borderRadius: 999, background: "#e8f7ee", display: "inline-block" }} />
                <span className="vc-hero-avatar vc-hero-avatar-3" style={{ width: 40, height: 40, borderRadius: 999, background: "#fbeef2", display: "inline-block" }} />
              </div>
              <span className="vc-hero-doctors-text" style={{ color: "#0f172a" }}>
                <b>+159</b> doctors are online
              </span>
            </div>

            <button
              type="button"
              className="btn-primary vc-hero-btn"
              onClick={handleConsultNow}
              style={{ padding: "10px 18px", borderRadius: 8 }}
            >
              Consult Now
            </button>

            <div className="vc-hero-features" style={{ display: "flex", gap: 16, marginTop: 12, color: "#374151" }}>
              <span>✔ Verified Doctors</span>
              <span>✔ Digital Prescription</span>
              <span>✔ Free Follow-up</span>
            </div>
          </div>

          <div className="vc-hero-image" style={{ width: 320, borderRadius: 12, overflow: "hidden", background: "#f3f6fb" }}>
            <img src="/images/cards/patients2.jpg" alt="Online doctor consultation" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="vc-main" style={{ maxWidth: 1200, margin: "20px auto", padding: "0 24px 60px" }}>
        {/* SPECIALITIES */}
        <section className="vc-section" style={{ marginBottom: 28 }}>
          <div className="vc-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0 }}>25+ Specialities</h2>
              <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Consult with top doctors across specialities</p>
            </div>
            <button type="button" className="btn-outline vc-section-cta" onClick={handleConsultNow} style={{ padding: "8px 12px" }}>
              See all specialities
            </button>
          </div>

          <div className="vc-speciality-row" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {specialities.map((s) => (
              <article key={s.title} className="vc-card vc-card-speciality" onClick={handleConsultNow} style={{ width: 220, background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(15,23,42,0.06)", overflow: "hidden", cursor: "pointer" }}>
                <div className="vc-card-img" style={{ height: 120, overflow: "hidden" }}>
                  <img src={s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="vc-card-body" style={{ padding: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{s.title}</h3>
                  <p className="vc-price" style={{ margin: "6px 0 8px", color: "#6b7280" }}>{s.price}</p>
                  <button type="button" className="vc-card-link" onClick={handleConsultNow} style={{ background: "transparent", border: "none", color: "#0f9d8a", cursor: "pointer" }}>
                    Consult now →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* COMMON HEALTH CONCERNS */}
        <section className="vc-section" style={{ marginBottom: 28 }}>
          <div className="vc-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0 }}>Common Health Concerns</h2>
              <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Consult a doctor online for any health issue</p>
            </div>
            <button type="button" className="btn-outline vc-section-cta" onClick={handleConsultNow} style={{ padding: "8px 12px" }}>
              See all symptoms
            </button>
          </div>

          <div className="vc-concern-row" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {concerns.map((c) => (
              <article key={c.title} className="vc-card vc-card-concern" onClick={handleConsultNow} style={{ width: 220, background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(15,23,42,0.06)", overflow: "hidden", cursor: "pointer" }}>
                <div className="vc-card-img" style={{ height: 120, overflow: "hidden" }}>
                  <img src={c.image} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="vc-card-body" style={{ padding: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{c.title}</h3>
                  <p className="vc-price" style={{ margin: "6px 0 8px", color: "#6b7280" }}>{c.price}</p>
                  <button type="button" className="vc-card-link" onClick={handleConsultNow} style={{ background: "transparent", border: "none", color: "#0f9d8a", cursor: "pointer" }}>
                    Consult now →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* OUR DOCTORS */}
        <section className="vc-section" style={{ marginBottom: 28 }}>
          <h2 className="vc-section-title">Our Doctors</h2>
          <div className="vc-doctors-row" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
            {doctors.map((d) => (
              <article key={d.name} className="vc-doctor-card" style={{ display: "flex", gap: 12, width: 320, background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
                <div className="vc-doctor-avatar" style={{ width: 84, height: 84, borderRadius: 8, overflow: "hidden" }}>
                  <img src={d.avatar} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="vc-doctor-body">
                  <h3 style={{ margin: 0 }}>{d.name}</h3>
                  <p className="vc-doctor-speciality" style={{ margin: "6px 0 0", color: "#6b7280" }}>{d.speciality}</p>
                  <p className="vc-doctor-meta" style={{ margin: "6px 0 0", color: "#9ca3af" }}>{d.experience}</p>
                  <p className="vc-doctor-meta" style={{ margin: "6px 0 0", color: "#9ca3af" }}>{d.consults}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="vc-section" style={{ marginBottom: 28 }}>
          <h2 className="vc-section-title">How it works</h2>
          <div className="vc-how-row" style={{ display: "flex", gap: 20, marginTop: 12 }}>
            <div className="vc-how-step" style={{ width: 200, background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
              <div className="vc-how-icon" style={{ fontSize: 22 }}>✨</div>
              <h3 style={{ margin: "8px 0 6px" }}>Select</h3>
              <p style={{ margin: 0, color: "#6b7280" }}>Select a speciality or symptom</p>
            </div>
            <div className="vc-how-step" style={{ width: 200, background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
              <div className="vc-how-icon" style={{ fontSize: 22 }}>💬</div>
              <h3 style={{ margin: "8px 0 6px" }}>Consult</h3>
              <p style={{ margin: 0, color: "#6b7280" }}>Audio / video call with a verified doctor</p>
            </div>
            <div className="vc-how-step" style={{ width: 200, background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
              <div className="vc-how-icon" style={{ fontSize: 22 }}>🧾</div>
              <h3 style={{ margin: "8px 0 6px" }}>Prescription</h3>
              <p style={{ margin: 0, color: "#6b7280" }}>Get a digital prescription & free follow-up</p>
            </div>
          </div>
        </section>

        {/* EXPERIENCE VIDEOS */}
        <section className="vc-section">
          <h2 className="vc-section-title">Experience online doctor consultations</h2>
          <div className="vc-video-row" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
            {videos.map((v) => (
              <article key={v.title} className="vc-video-card" style={{ width: 360, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
                <div className="vc-video-thumb" style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img src={v.thumbnail} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button className="vc-video-play" type="button" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", padding: 12, borderRadius: "50%", cursor: "pointer" }}>
                    ▶
                  </button>
                </div>
                <div className="vc-video-body" style={{ padding: 12 }}>
                  <h3 style={{ margin: 0 }}>{v.title}</h3>
                  <p style={{ margin: "6px 0 0", color: "#6b7280" }}>{v.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default VideoConsultPage;