
export function ComingSoon() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        className="coming-soon-bubbles"
        aria-label="Coming Soon"
        style={{
          fontSize: "clamp(44px, 10vw, 120px)",
          fontWeight: 900,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          margin: 0,
        }}
      >
        {Array.from("Coming Soon").map((character, index) =>
          character === " " ? (
            <span
              key={index}
              className="coming-soon-bubble__space"
              aria-hidden="true"
            >
              {"\u00a0"}
            </span>
          ) : (
            <span
              key={index}
              className="coming-soon-bubble__letter"
              aria-hidden="true"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {character}
            </span>
          )
        )}
      </h1>
    </main>
  );
}
