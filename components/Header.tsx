export default function Header() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.9)",
        borderBottom: "1px solid rgba(212,175,55,0.2)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ color: "#D4AF37", fontWeight: 900, fontSize: "20px" }}>
        Civil-Art
      </div>
      <nav style={{ display: "flex", gap: "24px" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "none" }}>خانه</a>
        <a href="/about" style={{ color: "#fff", textDecoration: "none" }}>درباره ما</a>
        <a href="/contact" style={{ color: "#fff", textDecoration: "none" }}>تماس</a>
      </nav>
    </header>
  );
}
