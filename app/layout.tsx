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

const STARS = [
  { top: "3%",  left: "0%",   size: 110, blur: 22, opacity: 0.55, delay: "0s",   dur: "9s"  },
  { top: "12%", right: "1%",  size: 80,  blur: 16, opacity: 0.45, delay: "1.6s", dur: "11s" },
  { top: "33%", left: "-1%",  size: 60,  blur: 13, opacity: 0.5,  delay: "0.9s", dur: "8s"  },
  { top: "52%", right: "0%",  size: 90,  blur: 19, opacity: 0.42, delay: "2.4s", dur: "10s" },
  { top: "67%", left: "1%",   size: 65,  blur: 14, opacity: 0.48, delay: "1.2s", dur: "9s"  },
  { top: "80%", right: "2%",  size: 75,  blur: 17, opacity: 0.4,  delay: "0.5s", dur: "12s" },
  { top: "90%", left: "0%",   size: 50,  blur: 11, opacity: 0.45, delay: "3s",   dur: "8s"  },
]

function starPoints(size: number): string {
  const cx = size / 2
  const cy = size / 2
  const outerR = size / 2 * 0.9
  const innerR  = size / 2 * 0.38
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2
    const r = i % 2 === 0 ? outerR : innerR
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`)
  }
  return pts.join(" ")
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body
        className="min-h-full antialiased relative"
        style={{ fontFamily: "var(--font-geist-sans), -apple-system, sans-serif" }}
      >
        {/* Estrellas borrosas SVG — funciona en todos los navegadores */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {STARS.map((s, i) => (
            <svg
              key={i}
              className="absolute star-float"
              viewBox={`0 0 ${s.size} ${s.size}`}
              style={{
                top: s.top,
                left: "left" in s ? (s as { left: string }).left : undefined,
                right: "right" in s ? (s as { right: string }).right : undefined,
                width: s.size,
                height: s.size,
                overflow: "visible",
                opacity: s.opacity,
                animationDelay: s.delay,
                animationDuration: s.dur,
              }}
            >
              <defs>
                <filter id={`sf${i}`} x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation={s.blur} />
                </filter>
              </defs>
              <polygon
                points={starPoints(s.size)}
                fill="#F472B6"
                filter={`url(#sf${i})`}
              />
            </svg>
          ))}
        </div>
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
