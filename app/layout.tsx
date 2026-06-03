import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "/ClasesIncera ✩",
  description: "reserva tu plaza · paga online",
}

// Estrellas borrosas: clip-path 5 puntas + blur = efecto glow
const STARS = [
  { top:  "4%",  left:  "2%",   size: 110, opacity: 0.38, blur: 22, delay: "0s",   dur: "9s"  },
  { top: "12%",  right: "3%",   size: 75,  opacity: 0.28, blur: 16, delay: "1.6s", dur: "11s" },
  { top: "32%",  left:  "0%",   size: 55,  opacity: 0.32, blur: 14, delay: "0.9s", dur: "8s"  },
  { top: "50%",  right: "1%",   size: 90,  opacity: 0.26, blur: 20, delay: "2.3s", dur: "10s" },
  { top: "68%",  left:  "3%",   size: 65,  opacity: 0.3,  blur: 15, delay: "1.1s", dur: "9s"  },
  { top: "82%",  right: "4%",   size: 80,  opacity: 0.24, blur: 18, delay: "0.4s", dur: "12s" },
  { top: "90%",  left:  "1%",   size: 50,  opacity: 0.28, blur: 12, delay: "3.2s", dur: "8s"  },
  { top: "22%",  left:  "40%",  size: 40,  opacity: 0.15, blur: 10, delay: "2.8s", dur: "10s" },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body
        className="min-h-full antialiased relative"
        style={{ fontFamily: "var(--font-geist-sans), -apple-system, sans-serif" }}
      >
        {/* Estrellas borrosas de fondo */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute star-float"
              style={{
                top: s.top,
                left: "left" in s ? (s as { left: string }).left : undefined,
                right: "right" in s ? (s as { right: string }).right : undefined,
                width:  s.size,
                height: s.size,
                opacity: s.opacity,
                animationDelay: s.delay,
                animationDuration: s.dur,
                filter: `blur(${s.blur}px)`,
                backgroundColor: "#F472B6",
                clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                willChange: "transform",
                transform: "translateZ(0)",
              }}
            />
          ))}
        </div>
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
