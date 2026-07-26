import CinematicConstruction from "../components/CinematicConstruction";

export default function Home() {
  return (
    <>
      <CinematicConstruction />

      {/* بخش موقت پایین — فقط برای تست اینکه بعد از ویدیو اسکرول عادی برمیگرده */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0d",
        }}
      >
        <h2 style={{ color: "#D4AF37", fontSize: "32px" }}>
          ✅ بخش بعدی — یعنی sticky درست تموم شد
        </h2>
      </section>
    </>
  );
}
