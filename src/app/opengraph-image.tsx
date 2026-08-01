import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Impetus — Uma entidade, várias máquinas";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0c",
          padding: 72,
          color: "#f2f0ee",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#ff3b3f" }} />
          <div style={{ fontSize: 26, letterSpacing: -0.5 }}>Impetus</div>
          <div style={{ fontSize: 18, color: "rgba(242,240,238,0.32)", letterSpacing: 3 }}>
            FASE 0
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <div style={{ fontSize: 92, letterSpacing: -3 }}>Uma entidade.</div>
          <div style={{ fontSize: 92, letterSpacing: -3, color: "#ff3b3f" }}>
            Várias máquinas.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "rgba(242,240,238,0.55)", maxWidth: 900 }}>
          Um cérebro central e um agente em cada máquina do time — e, do seu lado, uma
          conversa só.
        </div>
      </div>
    ),
    size,
  );
}
