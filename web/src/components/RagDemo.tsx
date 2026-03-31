import { useEffect, useRef, useState } from 'react'

type LogEntry = {
  id: number
  time: string
  message: string
  type: 'info' | 'success' | 'processing' | 'error'
}

type RecallResult = {
  rank: number
  score: number
  content: string
  source: string
}

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  text: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatTime(date: Date): string {
  const y = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}.${mo}.${d} ${h}:${mi}:${s}`
}

const MOCK_RECALL_RESULTS: RecallResult[] = [
  {
    rank: 1,
    score: 0.94,
    content:
      'MAP-RAG is a Multi-dimensional Accuracy Precision retrieval-augmented generation framework that improves accuracy by evaluating retrieved passages across multiple dimensions before incorporating them into answers, ensuring every generated response is fully traceable.',
    source: 'watadot-whitepaper.pdf',
  },
  {
    rank: 2,
    score: 0.87,
    content:
      'MAP-RAG uses a graph-based knowledge index to maintain relationships between facts, achieving higher precision than pure vector retrieval while supporting multi-hop reasoning queries.',
    source: 'map-rag-technical.pdf',
  },
  {
    rank: 3,
    score: 0.81,
    content:
      'MAP-RAG evaluation metrics include faithfulness, answer relevance, and context precision, providing a complete quality score and provenance chain for every generated answer.',
    source: 'evaluation-guide.pdf',
  },
]

const RANK_COLORS = [
  'bg-sky-500 shadow-sky-200',
  'bg-sky-400/90 shadow-sky-100',
  'bg-sky-300/80 shadow-sky-100',
]

const EVAL_METRICS = [
  { label: 'Recall@1', value: 0.91, desc: 'Top-1 hit rate across 120 queries' },
  { label: 'Recall@3', value: 0.97, desc: 'Top-3 hit rate across 120 queries' },
  { label: 'NCDD', value: 0.88, desc: 'Normalized Contextual Document Density' },
  { label: 'Faithfulness', value: 0.93, desc: 'Answer grounded in retrieved context' },
  { label: 'Precision@3', value: 0.85, desc: 'Relevant docs among top-3 results' },
  { label: 'Latency (p95)', value: null, display: '320 ms', desc: 'End-to-end at 95th percentile' },
]

const MOCK_CHAT_SEED: ChatMessage[] = [
  { id: 1, role: 'user', text: 'What is MAP-RAG?' },
  {
    id: 2,
    role: 'assistant',
    text: 'MAP-RAG (Multi-dimensional Accuracy Precision RAG) is a retrieval-augmented generation framework that evaluates each retrieved passage across multiple quality dimensions — relevance, faithfulness, and context density — before composing the final answer. This ensures every response is both accurate and fully traceable to its source documents.',
  },
]

const MOCK_REPLIES = [
  'Based on the knowledge base, MAP-RAG uses a graph-based index to maintain factual relationships between documents, enabling multi-hop reasoning that pure vector search cannot support.',
  'Great question. The NCDD metric measures how densely a retrieved chunk covers the contextual information needed to answer a query. A higher score means less noise and more signal per retrieved passage.',
  'Evaluation in MAP-RAG is fully automated: for each query the system computes Recall@K, Faithfulness, and NCDD scores against a golden dataset, then surfaces a per-query quality report.',
]

let mockReplyIdx = 0

export function RagDemo() {
  const [activeTab, setActiveTab] = useState<'upload' | 'recall' | 'eval' | 'chat'>('upload')

  /* ── Upload state ── */
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logIdRef = useRef(0)

  /* ── Recall state ── */
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<RecallResult[] | null>(null)

  /* ── Chat state ── */
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_SEED)
  const [chatLoading, setChatLoading] = useState(false)
  const chatMsgIdRef = useRef(MOCK_CHAT_SEED.length + 1)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  function addLog(message: string, type: LogEntry['type'] = 'info') {
    setLogs((prev) => [
      { id: ++logIdRef.current, time: formatTime(new Date()), message, type },
      ...prev,
    ])
  }

  async function handleUpload() {
    if (!selectedFile || uploading) return
    setUploading(true)
    setLogs([])
    addLog(`Starting document upload: ${selectedFile.name}`, 'info')
    await delay(600)
    addLog('Document uploaded — embedding in progress...', 'success')
    await delay(1100)
    addLog(
      `Parsing document structure, extracting ${Math.floor(Math.random() * 80 + 30)} paragraphs...`,
      'processing',
    )
    await delay(900)
    addLog('Vectorization complete, building knowledge graph index...', 'processing')
    await delay(1000)
    addLog(
      `Index built — ${Math.floor(Math.random() * 200 + 100)} nodes written`,
      'success',
    )
    await delay(400)
    addLog('Knowledge base updated ✓', 'success')
    setUploading(false)
  }

  async function handleSearch() {
    if (!query.trim() || searching) return
    setSearching(true)
    setResults(null)
    await delay(850)
    setResults(MOCK_RECALL_RESULTS)
    setSearching(false)
  }

  async function handleChatSend() {
    const text = chatInput.trim()
    if (!text || chatLoading) return
    setChatInput('')
    setChatLoading(true)
    const userMsg: ChatMessage = { id: chatMsgIdRef.current++, role: 'user', text }
    setChatMessages((prev) => [...prev, userMsg])
    await delay(900)
    const reply = MOCK_REPLIES[mockReplyIdx % MOCK_REPLIES.length]
    mockReplyIdx++
    setChatMessages((prev) => [
      ...prev,
      { id: chatMsgIdRef.current++, role: 'assistant', text: reply },
    ])
    setChatLoading(false)
  }

  function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setSelectedFile(file)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-neutral-100 bg-neutral-50/60 scrollbar-none">
        {(
          [
            { id: 'upload', label: 'Upload' },
            { id: 'recall', label: 'Recall Test' },
            { id: 'eval', label: 'Evaluation', sub: 'Recall & NCDD' },
            { id: 'chat', label: 'Chat', sub: 'Demo' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative shrink-0 px-5 py-3.5 text-sm font-medium tracking-tight transition-colors ${
              activeTab === tab.id
                ? 'text-sky-600'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <span>{tab.label}</span>
            {'sub' in tab && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                activeTab === tab.id
                  ? 'bg-sky-50 text-sky-500'
                  : 'bg-neutral-100 text-neutral-400'
              }`}>
                {tab.sub}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-sky-600" />
            )}
          </button>
        ))}
      </div>

      {/* ── Upload Tab ── */}
      {activeTab === 'upload' && (
        <div className="space-y-5 p-6">
          <p className="text-sm font-medium text-neutral-500">
            Upload knowledge base documents (PDF, TXT, Markdown, DOCX supported)
          </p>

          {/* Drop zone + button row */}
          <div className="flex gap-3">
            <div
              role="button"
              tabIndex={0}
              aria-label="Select or drag a file"
              className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 transition-colors ${
                isDragging
                  ? 'border-sky-400 bg-sky-50'
                  : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100/60'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) =>
                e.key === 'Enter' && fileInputRef.current?.click()
              }
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
            >
              <svg
                className="size-4 shrink-0 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                />
              </svg>
              <span
                className={`truncate text-sm ${
                  selectedFile ? 'text-neutral-800' : 'text-neutral-400'
                }`}
              >
                {selectedFile ? selectedFile.name : 'Drop a file here or click to browse'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.txt,.md,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setSelectedFile(file)
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="shrink-0 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>

          {/* Log console */}
          {(logs.length > 0 || uploading) && (
            <div className="min-h-36 rounded-xl bg-neutral-950 p-4 font-mono text-xs">
              <p className="mb-3 text-neutral-500">log:</p>
              <div className="space-y-1.5">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-2.5">
                    <span className="shrink-0 text-neutral-600">{log.time}</span>
                    <span
                      className={
                        log.type === 'success'
                          ? 'text-emerald-400'
                          : log.type === 'processing'
                            ? 'text-sky-400'
                            : log.type === 'error'
                              ? 'text-red-400'
                              : 'text-neutral-400'
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
              {uploading && (
                <div className="mt-2 flex items-center gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="inline-block size-1 rounded-full bg-neutral-500 animate-pulse"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {logs.length === 0 && !uploading && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 py-10 text-center">
              <svg
                className="size-8 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <p className="text-sm text-neutral-400">
                Upload a document to see logs here
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Recall Tab ── */}
      {activeTab === 'recall' && (
        <div className="space-y-5 p-6">
          <p className="text-sm font-medium text-neutral-500">
            Enter a question to test knowledge base recall
          </p>

          {/* Query input row */}
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter a query…"
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 transition-all focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={!query.trim() || searching}
              className="shrink-0 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {searching ? 'Searching…' : 'Search'}
            </button>
          </div>

          {/* Skeleton loading */}
          {searching && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 size-6 shrink-0 animate-pulse rounded-full bg-neutral-200" />
                  <div className="flex-1 animate-pulse space-y-2 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                    <div className="h-3 w-1/3 rounded bg-neutral-200" />
                    <div className="h-3 w-full rounded bg-neutral-200" />
                    <div className="h-3 w-4/5 rounded bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {results && !searching && (
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.rank} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow ${RANK_COLORS[result.rank - 1]}`}
                    aria-label={`Rank ${result.rank}`}
                  >
                    {result.rank}
                  </span>
                  <div className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-3 transition-colors hover:bg-white hover:shadow-sm">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-[11px] text-neutral-400">
                        {result.source}
                      </span>
                      <span className="shrink-0 rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-sky-600">
                        score {result.score}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-700">
                      {result.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!results && !searching && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 py-10 text-center">
              <svg
                className="size-8 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
                />
              </svg>
              <p className="text-sm text-neutral-400">
                Enter a question and click Search — results will appear here
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Evaluation Tab ── */}
      {activeTab === 'eval' && (
        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-500">
              Benchmark run on <span className="text-neutral-800">120 queries</span> · dataset <span className="font-mono text-neutral-800">v2.1</span>
            </p>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
              Passed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {EVAL_METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-4 transition-colors hover:bg-white hover:shadow-sm"
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                  {m.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                  {m.value !== null ? m.value.toFixed(2) : m.display}
                </p>
                {m.value !== null && (
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{ width: `${m.value * 100}%` }}
                    />
                  </div>
                )}
                <p className="mt-2 text-[11px] leading-snug text-neutral-400">{m.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-neutral-300">
            Mock data — connect a real evaluation pipeline to populate live scores.
          </p>
        </div>
      )}

      {/* ── Chat Tab ── */}
      {activeTab === 'chat' && (
        <div className="flex h-[420px] flex-col">
          {/* Message list */}
          <div className="flex-1 overflow-y-auto space-y-4 p-6">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                  msg.role === 'assistant' ? 'bg-sky-500' : 'bg-neutral-300'
                }`}>
                  {msg.role === 'assistant' ? 'AI' : 'U'}
                </div>
                {/* Bubble */}
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-neutral-50 text-neutral-800 border border-neutral-100'
                    : 'bg-sky-600 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white">
                  AI
                </div>
                <div className="flex items-center gap-1 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="inline-block size-1.5 rounded-full bg-neutral-400 animate-pulse"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-neutral-100 bg-neutral-50/60 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Ask the knowledge base…"
                disabled={chatLoading}
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleChatSend}
                disabled={!chatInput.trim() || chatLoading}
                className="shrink-0 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
