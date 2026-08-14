import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Heart, QrCode } from 'lucide-react'

const UPI_ID = '7706929484@axl'
const UPI_NAME = 'Utkarsh%20Bajpai'
const UPI_BASE = `upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&cu=INR`
const QR_TEXT = UPI_BASE

const amounts = [
  { label: '₹10', amt: 10 },
  { label: '₹20', amt: 20 },
  { label: '₹50', amt: 50 },
  { label: '₹100', amt: 100 },
]

export default function DonationSection() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, QR_TEXT, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    }).catch(() => {})
  }, [])

  return (
    <section id="support" className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="card rounded-3xl p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="tile inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white">
              <Heart size={22} />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Want to Support This Project?
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              This website is completely free to use. If you find it useful and genuinely want to support the project,
              you can contribute voluntarily. There is absolutely no obligation.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center">
            <div className="flex flex-col items-center">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft dark:border-white/10">
                <canvas ref={canvasRef} className="block h-[220px] w-[220px]" aria-label="UPI payment QR code" role="img" />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <QrCode size={13} />
                Scan with any UPI app
              </p>
              <p className="mt-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-sm font-bold tracking-wide text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white">
                {UPI_ID}
              </p>
            </div>

            <div className="w-full max-w-sm text-center sm:text-left">
              <h3 className="font-bold text-slate-900 dark:text-white">Optional Support</h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Donations are 100% voluntary and are used to keep this directory free and up to date. Tapping a button opens your UPI app — no payment happens until you confirm it there.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:justify-start">
                {amounts.map((a) => (
                  <a
                    key={a.amt}
                    href={`${UPI_BASE}&am=${a.amt}&tn=${encodeURIComponent(`Optional Support - FreeAI Alternatives ${a.amt}`)}`}
                    className="btn btn-soft px-4 py-2.5 text-sm font-bold"
                  >
                    {a.label}
                  </a>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                Works best on a phone with a UPI app installed (Google Pay, PhonePe, Paytm, BHIM and others).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
