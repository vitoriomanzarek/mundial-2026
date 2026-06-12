import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Mundial 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0B",
          color: "#FAFAFA",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#71717A",
          }}
        >
          11 de junio - 19 de julio
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 700,
            marginTop: 16,
          }}
        >
          <span>Mundial&nbsp;</span>
          <span style={{ color: "#00D9A3" }}>2026</span>
        </div>
        <div style={{ fontSize: 32, color: "#A1A1AA", marginTop: 24 }}>
          48 selecciones · 16 sedes · 104 partidos
        </div>
      </div>
    ),
    size
  );
}
