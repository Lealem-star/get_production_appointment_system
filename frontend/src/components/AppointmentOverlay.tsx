import { useState } from 'react'

const clientTypes = [
  'Individual',
  'Business',
  'Organization',
  'Social Media Production',
  'Wedding',
  'Others',
]

const serviceOptions = [
  'Portrait Session',
  'Event Coverage',
  'Commercial Shoot',
  'Family Photoshoot',
  'Wedding Photo & Video',
]

const TOTAL_STEPS = 5

type Props = {
  open: boolean
  onClose: () => void
}

const stepTitleClass =
  'font-serif text-lg font-semibold tracking-tight text-ethio-coffee-deep sm:text-xl'
const labelClass = 'flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ethio-ink'
const fieldClass =
  'mt-2 h-11 w-full rounded-xl border border-ethio-coffee/15 bg-white px-3 text-sm text-ethio-ink shadow-inner outline-none focus:border-ethio-gold/50 focus:ring-2 focus:ring-ethio-gold/20'
const textareaClass =
  'mt-2 min-h-28 w-full rounded-xl border border-ethio-coffee/15 bg-white p-3 text-sm text-ethio-ink shadow-inner outline-none placeholder:text-ethio-muted/60 focus:border-ethio-gold/50 focus:ring-2 focus:ring-ethio-gold/20'
const btnPrimary =
  'rounded-xl bg-ethio-forest px-5 py-2.5 text-sm font-bold text-ethio-sun shadow-sm transition hover:bg-ethio-forest-deep'
const btnSecondary =
  'rounded-xl border border-ethio-coffee/20 bg-ethio-sun/50 px-4 py-2.5 text-sm font-bold text-ethio-coffee transition hover:bg-ethio-sun'

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}

export default function AppointmentOverlay({ open, onClose }: Props) {
  const [step, setStep] = useState(1)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [service, setService] = useState(serviceOptions[0]!)
  const [clientType, setClientType] = useState(clientTypes[0]!)
  const [location, setLocation] = useState<'Indoor' | 'Outdoor'>('Indoor')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

  if (!open) return null

  const closeAndReset = () => {
    setStep(1)
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')
    setService(serviceOptions[0]!)
    setClientType(clientTypes[0]!)
    setLocation('Indoor')
    setDate('')
    setTime('')
    setNotes('')
    setSubmitted(false)
    setSubmitting(false)
    setSubmitError('')
    onClose()
  }

  async function submitAppointment() {
    // If backend isn't configured, keep the existing optimistic flow.
    if (!apiBaseUrl) {
      setSubmitted(true)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch(`${apiBaseUrl}/public/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          service,
          clientType,
          location,
          date,
          time,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setSubmitted(true)
    } catch {
      setSubmitError('Unable to reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center bg-black/65 p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close appointment dialog"
        className="absolute inset-0"
        onClick={closeAndReset}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-title"
        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-3xl border border-ethio-gold/30 bg-ethio-paper shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-ethio-coffee/10"
      >
        <div className="border-b border-ethio-coffee/10 bg-linear-to-br from-ethio-sun via-ethio-paper to-ethio-sun-strong px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ethio-clay">Get production</p>
              <h2 id="appointment-title" className="mt-1 font-serif text-2xl font-semibold text-ethio-coffee-deep">
                {submitted ? 'Request received' : 'Book appointment'}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeAndReset}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ethio-coffee/15 bg-white/70 text-ethio-coffee transition hover:border-ethio-gold/40 hover:bg-ethio-sun hover:text-ethio-coffee-deep"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          {!submitted && (
            <div className="mt-4 flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i + 1 <= step ? 'bg-ethio-gold' : 'bg-ethio-coffee/15'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          {!submitted ? (
            <>
              {step === 1 && (
                <>
                  <div className={stepTitleClass}>Contact details</div>
                  <p className="mt-1 text-sm text-ethio-muted">Tell us who this booking is for.</p>
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-ethio-ink">
                      Full name
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={fieldClass}
                        placeholder="Your full name"
                      />
                    </label>
                    <label className="block text-sm font-medium text-ethio-ink">
                      Email
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className={fieldClass}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label className="block text-sm font-medium text-ethio-ink">
                      Phone
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className={fieldClass}
                        placeholder="+251 9XX XXX XXX"
                      />
                    </label>
                    <label className="block text-sm font-medium text-ethio-ink">
                      Service
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className={fieldClass}
                      >
                        {serviceOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className={btnPrimary}
                      disabled={!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className={stepTitleClass}>Client type</div>
                  <p className="mt-1 text-sm text-ethio-muted">What type of client are you?</p>
                  <div className="mt-4 space-y-2">
                    {clientTypes.map((type) => (
                      <label
                        key={type}
                        className={`${labelClass} rounded-xl border px-4 py-2.5 transition ${
                          clientType === type
                            ? 'border-ethio-gold/50 bg-ethio-sun/80 ring-1 ring-ethio-gold/25'
                            : 'border-ethio-coffee/10 bg-white/60 hover:border-ethio-clay-soft/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="clientType"
                          checked={clientType === type}
                          onChange={() => setClientType(type)}
                          className="accent-ethio-gold"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button type="button" onClick={() => setStep(1)} className={btnSecondary}>
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className={btnPrimary}>
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className={stepTitleClass}>Location</div>
                  <p className="mt-1 text-sm text-ethio-muted">Where is the shoot or event?</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {(['Indoor', 'Outdoor'] as const).map((option) => (
                      <label
                        key={option}
                        className={`${labelClass} rounded-xl border px-4 py-2.5 transition ${
                          location === option
                            ? 'border-ethio-gold/50 bg-ethio-sun/80 ring-1 ring-ethio-gold/25'
                            : 'border-ethio-coffee/10 bg-white/60 hover:border-ethio-clay-soft/50'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={location === option}
                          onChange={() => setLocation(option)}
                          className="accent-ethio-gold"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button type="button" onClick={() => setStep(2)} className={btnSecondary}>
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(4)} className={btnPrimary}>
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className={stepTitleClass}>Preferred schedule</div>
                  <p className="mt-1 text-sm text-ethio-muted">When would you like to shoot?</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-ethio-ink">
                      Date
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={fieldClass}
                      />
                    </label>
                    <label className="block text-sm font-medium text-ethio-ink">
                      Time
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={fieldClass}
                      />
                    </label>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button type="button" onClick={() => setStep(3)} className={btnSecondary}>
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(5)} className={btnPrimary} disabled={!date || !time}>
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <div className={stepTitleClass}>Additional details</div>
                  <p className="mt-1 text-sm text-ethio-muted">Optional — vision, location notes, or special requests</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={textareaClass}
                    placeholder="Tell us more about your project..."
                  />
                  {submitError ? (
                    <p className="mt-4 rounded-lg border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
                      {submitError}
                    </p>
                  ) : null}
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button type="button" onClick={() => setStep(4)} className={btnSecondary}>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => void submitAppointment()}
                      className={btnPrimary}
                      disabled={submitting}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ethio-forest/10 text-2xl text-ethio-forest">
                ✓
              </div>
              <p className="mt-4 font-serif text-xl font-semibold text-ethio-coffee-deep">Thank you!</p>
              <p className="mt-2 text-sm leading-relaxed text-ethio-muted">
                Thanks, {clientType}. We&apos;ll review your request and contact you soon.
              </p>
              <button type="button" onClick={closeAndReset} className={`mt-6 ${btnPrimary}`}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
