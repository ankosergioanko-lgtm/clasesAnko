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
  { top: "6%",  left: "4%",   size: 13, opacity: 0.22, delay: "0s",    dur: "7s"  },
  { top: "12%", right: "6%",  size: 9,  opacity: 0.16, delay: "1.4s",  dur: "9s"  },
  { top: "28%", left: "1.5%", size: 7,  opacity: 0.18, delay: "0.7s",  dur: "8s"  },
  { top: "42%", right: "3%",  size: 11, opacity: 0.14, delay: "2.2s",  dur: "6s"  },
  { top: "58%", left: "6%",   size: 8,  opacity: 0.2,  delay: "1.8s",  dur: "10s" },
  { top: "70%", right: "8%",  size: 10, opacity: 0.16, delay: "0.3s",  dur: "7s"  },
  { top: "83%", left: "3%",   size: 6,  opacity: 0.15, delay: "3s",    dur: "9s"  },
  { top: "90%", right: "5%",  size: 12, opacity: 0.18, delay: "1.1s",  dur: "8s"  },
  { top: "20%", left: "18%",  size: 6,  opacity: 0.1,  delay: "2.5s",  dur: "11s" },
  { top: "50%", right: "18%", size: 7,  opacity: 0.12, delay: "4s",    dur: "8s"  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body
        className="min-h-full antialiased relative"
        style={{ fontFamily: "var(--font-geist-sans), -apple-system, sans-serif" }}
      >
        {/* Estrellas decorativas de fondo */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute star-float select-none"
              style={{
                top: s.top,
                left: "left" in s ? s.left : undefined,
                right: "right" in s ? s.right : undefined,
                fontSize: `${s.size}px`,
                opacity: s.opacity,
                color: "#D4607E",
                animationDelay: s.delay,
                animationDuration: s.dur,
              }}
            >
              ✩
            </span>
          ))}
        </div>
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
