import { useCallback, useState } from 'react'

type StepStatus = 'idle' | 'running' | 'done'

const PIPELINE = [
  { id: 1, label: 'Load baseline dataset', detail: 'Q1–Q2 2026 · 84 k records' },
  { id: 2, label: 'Initialize ForesightAgent', detail: 'Model v2.1 ready' },
  { id: 3, label: 'Apply what-if constraint', detail: 'Price ×1.10 · all SKUs' },
  { id: 4, label: 'Run scenario simulation', detail: 'Monte Carlo · 1,000 paths' },
  { id: 5, label: 'Compute impact metrics', detail: 'Revenue · Margin · Churn' },
  { id: 6, label: 'Scenario report ready', detail: '' },
] as const

type ChatMsg = { role: 'user' | 'ai'; text: string }

const CHAT: ChatMsg[] = [
  {
    role: 'user',
    text: 'What would happen to Q3 revenue if we raise prices by 10%?',
  },
  {
    role: 'ai',
    text: 'Running 1,000 Monte Carlo scenarios against your Q1–Q2 baseline…',
  },
  {
    role: 'ai',
    text: 'Done. Q3 revenue projected −7.2% due to demand elasticity. Gross margin improves +4.1%. Churn risk is concentrated in the entry tier (AOV < $200) — high-value customers show resilience.',
  },
]

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

/* ── Ontology graph ── */
const GW = 240
const GH = 218
const NR = 22

const NODES = [
  { id: 'rev',    label: 'Revenue',   x: 120, y: 32,  fill: '#e0f2fe', stroke: '#0ea5e9', text: '#0284c7', abbr: 'R' },
  { id: 'price',  label: 'Pricing',   x: 36,  y: 108, fill: '#fef3c7', stroke: '#f59e0b', text: '#b45309', abbr: 'P' },
  { id: 'cust',   label: 'Customers', x: 204, y: 108, fill: '#ede9fe', stroke: '#8b5cf6', text: '#7c3aed', abbr: 'C' },
  { id: 'margin', label: 'Margin',    x: 168, y: 190, fill: '#d1fae5', stroke: '#10b981', text: '#059669', abbr: 'M' },
  { id: 'churn',  label: 'Churn',     x: 72,  y: 190, fill: '#fee2e2', stroke: '#ef4444', text: '#dc2626', abbr: '!' },
]

const EDGES: [string, string][] = [
  ['price', 'rev'],
  ['cust', 'rev'],
  ['price', 'churn'],
  ['cust', 'margin'],
  ['rev', 'margin'],
]

function getNode(id: string) {
  return NODES.find((n) => n.id === id)!
}

export function ForesightAgentDemo() {
  const [statuses, setStatuses] = useState<StepStatus[]>(PIPELINE.map(() => 'done'))
  const [chatCount, setChatCount] = useState(CHAT.length)
  const [isRunning, setIsRunning] = useState(false)

  const replay = useCallback(async () => {
    if (isRunning) return
    setIsRunning(true)
    setStatuses(PIPELINE.map(() => 'idle'))
    setChatCount(1)

    for (let i = 0; i < PIPELINE.length; i++) {
      setStatuses((prev) => prev.map((s, idx) => (idx === i ? 'running' : s)))
      await delay(750)
      setStatuses((prev) => prev.map((s, idx) => (idx === i ? 'done' : s)))
      await delay(120)
      if (i === 1) setChatCount(2)
    }

    setChatCount(3)
    setIsRunning(false)
  }, [isRunning])

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            ForesightAgent
          </span>
          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-600">
            Demo
          </span>
        </div>
        <button
          type="button"
          onClick={replay}
          disabled={isRunning}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <span className="inline-block size-2.5 animate-spin rounded-full border border-white/40 border-t-white" />
              Running…
            </>
          ) : (
            '▶  Run Scenario'
          )}
        </button>
      </div>

      {/* ── Three panels ── */}
      <div className="grid md:grid-cols-[1fr_1fr_260px] md:divide-x md:divide-neutral-100">

        {/* ── Left: Chat (dark) ── */}
        <div className="flex min-h-[340px] flex-col bg-neutral-950 p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            Analyst · What-If Query
          </p>
          <div className="flex flex-1 flex-col gap-3">
            {CHAT.slice(0, chatCount).map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    msg.role === 'ai'
                      ? 'bg-sky-500 text-white'
                      : 'bg-neutral-600 text-neutral-200'
                  }`}
                >
                  {msg.role === 'ai' ? 'FA' : 'U'}
                </div>
                <div
                  className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === 'ai'
                      ? 'bg-neutral-800 text-neutral-200'
                      : 'bg-neutral-700 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-neutral-600">
            AI Models of choice · MAP-RAG grounded
          </p>
        </div>

        {/* ── Middle: Pipeline ── */}
        <div className="flex flex-col bg-white p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Agent Pipeline
          </p>
          <ol className="flex flex-col">
            {PIPELINE.map((step, i) => {
              const status = statuses[i]
              return (
                <li key={step.id} className="relative flex gap-3">
                  {/* Vertical connector */}
                  {i < PIPELINE.length - 1 && (
                    <span
                      className={`absolute left-[11px] top-6 h-[calc(100%-8px)] w-px transition-colors ${
                        status === 'done' ? 'bg-sky-200' : 'bg-neutral-100'
                      }`}
                    />
                  )}
                  {/* Status badge */}
                  <span
                    className={`relative z-10 mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-300 ${
                      status === 'done'
                        ? 'border-sky-400 bg-sky-50 text-sky-600'
                        : status === 'running'
                          ? 'border-amber-400 bg-amber-50 text-amber-600'
                          : 'border-neutral-200 bg-white text-neutral-300'
                    }`}
                  >
                    {status === 'done' ? '✓' : status === 'running' ? '·' : step.id}
                  </span>
                  <div className={`${i < PIPELINE.length - 1 ? 'pb-5' : ''}`}>
                    <p
                      className={`text-[13px] font-medium leading-snug transition-colors ${
                        status === 'idle' ? 'text-neutral-300' : 'text-neutral-800'
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.detail && (
                      <p className="mt-0.5 text-[11px] text-neutral-400">{step.detail}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* ── Right: Ontology graph ── */}
        <div className="hidden flex-col bg-neutral-50 p-5 md:flex">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Ontology
          </p>
          <svg
            viewBox={`0 0 ${GW} ${GH}`}
            className="w-full"
            aria-hidden
          >
            {/* Edges */}
            {EDGES.map(([a, b]) => {
              const na = getNode(a)
              const nb = getNode(b)
              return (
                <line
                  key={`${a}-${b}`}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke="#e5e7eb"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              )
            })}
            {/* Nodes */}
            {NODES.map((n) => (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={NR}
                  fill={n.fill}
                  stroke={n.stroke}
                  strokeWidth={1.5}
                />
                <text
                  x={n.x}
                  y={n.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight="700"
                  fill={n.text}
                >
                  {n.abbr}
                </text>
                <text
                  x={n.x}
                  y={n.y + NR + 10}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight="500"
                  fill="#9ca3af"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
          <p className="mt-auto text-[10px] text-neutral-300">
            All data shown is notional.
          </p>
        </div>

      </div>
    </div>
  )
}
