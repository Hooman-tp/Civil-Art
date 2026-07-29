export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 44,
            height: 44,
            margin: "0 auto",
            border: "3px solid rgba(212,175,55,0.15)",
            borderTop: "3px solid #D4AF37",
            borderRadius: "50%",
            animation: "loadingSpin 0.8s linear infinite",
          }}
        />
        <style>{`
          @keyframes loadingSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: "#D4AF37", fontSize: 13, letterSpacing: 3, marginTop: 18 }}>
          در حال بارگذاری...
        </p>
      </div>
    </div>
  );
}
