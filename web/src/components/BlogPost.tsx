import { useState } from 'react'

/* ── Shared primitives ── */

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-medium text-neutral-500">
      {children}
    </span>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-neutral-950 mt-10 mb-3 text-lg font-semibold tracking-tight first:mt-0">
      {children}
    </h3>
  )
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-neutral-600 mb-4 text-[15px] leading-[1.75]">{children}</p>
  )
}

function Callout({
  color = 'sky',
  label,
  children,
}: {
  color?: 'sky' | 'amber' | 'emerald' | 'red'
  label: string
  children: React.ReactNode
}) {
  const styles = {
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    red: 'border-red-200 bg-red-50 text-red-700',
  }
  return (
    <div className={`my-6 rounded-xl border px-5 py-4 ${styles[color]}`}>
      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-[14px] leading-relaxed font-medium">{children}</p>
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[12px] text-neutral-700">
      {children}
    </code>
  )
}

function Pipeline() {
  const steps = [
    { label: 'Raw Documents (TXT / MD / PDF)', type: 'input' },
    { label: 'Jina Segmenter — Semantic Chunking', type: 'step' },
    { label: 'Vertex AI text-embedding-004 → LanceDB', type: 'step' },
    { label: 'Vector Search  →  Small-to-Big Expansion', type: 'step' },
    { label: 'Jina Cross-Encoder Reranker  (Top K=3)', type: 'step' },
    { label: 'Query Type Detector', type: 'branch' },
    { label: 'Factual Track → Strict Grader → GEN_PROMPT', type: 'leaf' },
    { label: 'Analysis Track → Relaxed Grader → GEN_ANALYSIS_PROMPT', type: 'leaf' },
    { label: 'Final Answer  (labeled [Factual] / [Reasoning])', type: 'output' },
  ]
  const typeStyle: Record<string, string> = {
    input:  'border-neutral-300 bg-neutral-50 text-neutral-600',
    step:   'border-sky-200 bg-sky-50 text-sky-800',
    branch: 'border-amber-300 bg-amber-50 text-amber-800',
    leaf:   'border-neutral-200 bg-white text-neutral-600 ml-6',
    output: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  }
  return (
    <div className="my-6 space-y-1.5 rounded-xl border border-neutral-100 bg-neutral-50/50 p-5 font-mono">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-2">
          {s.type !== 'input' && (
            <span className="mt-[7px] shrink-0 text-neutral-300 text-xs">
              {s.type === 'leaf' ? '├─' : '↓'}
            </span>
          )}
          <span
            className={`rounded-lg border px-3 py-1.5 text-[12px] leading-tight ${typeStyle[s.type]}`}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function BenchmarkTable() {
  const rows = [
    { metric: 'Recall@1', base: '86.0%', pipeline: '96.0%', delta: '+10.0%' },
    { metric: 'Recall@3', base: '96.0%', pipeline: '100.0%', delta: '+4.0%' },
    { metric: 'Recall@5', base: '99.0%', pipeline: '100.0%', delta: '+1.0%' },
    { metric: 'Recall@10', base: '100.0%', pipeline: '100.0%', delta: 'Maxed' },
  ]
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-neutral-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Metric</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Base Vector Search</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">MAP-RAG Pipeline</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Δ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.metric} className="border-b border-neutral-50 last:border-0">
              <td className="px-4 py-3 font-mono text-[13px] font-medium text-neutral-800">{r.metric}</td>
              <td className="px-4 py-3 text-[13px] text-neutral-500">{r.base}</td>
              <td className="px-4 py-3 font-semibold text-[13px] text-emerald-600">{r.pipeline}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  r.delta === 'Maxed'
                    ? 'bg-neutral-100 text-neutral-400'
                    : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {r.delta}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-neutral-50 px-4 py-2.5 text-[11px] text-neutral-400">
        Dataset: HuggingFace SciQ · 1,000 documents · 100 queries
      </p>
    </div>
  )
}

function DualTrackTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-neutral-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500" />
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Factual Track</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Analysis Track</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {[
            ['Trigger', 'Default', 'analyze / impact / why / how / plan / risk…'],
            ['Grader', 'Strict: requires direct answer in context', 'Relaxed: requires any topic-related fact'],
            ['Generator', 'GEN_PROMPT: "strictly use context"', 'GEN_ANALYSIS_PROMPT: facts + domain reasoning'],
            ['Output format', 'Direct answer', '[Factual Evidence] + [Analytical Reasoning] labeled sections'],
          ].map(([label, factual, analysis]) => (
            <tr key={label}>
              <td className="px-4 py-3 text-[12px] font-semibold text-neutral-500">{label}</td>
              <td className="px-4 py-3 text-[13px] text-neutral-600">{factual}</td>
              <td className="px-4 py-3 text-[13px] text-neutral-600">{analysis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Full article body ── */
function ArticleBody() {
  return (
    <div className="mt-8 border-t border-neutral-100 pt-8">

      {/* ── 1. Problem ── */}
      <SectionHeading>The Problem: Why Standard RAG Fails in the Enterprise</SectionHeading>
      <Para>
        Retrieval-Augmented Generation (RAG) promised to ground LLMs in real documents — but in
        practice, enterprise deployments hit three hard failure modes that vanilla pipelines cannot
        solve out of the box.
      </Para>
      <Para>
        <strong className="text-neutral-800">Hallucination</strong> is the most visible: the model
        generates a confident, plausible-sounding answer that contradicts the retrieved context.
        In legal, financial, or HR policy settings, this is not a UX annoyance — it is a liability.
      </Para>
      <Para>
        <strong className="text-neutral-800">Intent Drift</strong> is subtler. Most RAG pipelines
        apply LLM-powered query rewriting to improve recall. The problem: specialized internal terms
        like <Code>pea-sprout-futures</Code> or internal product codes get paraphrased into generic equivalents,
        losing their exact meaning and returning irrelevant chunks.
      </Para>
      <Para>
        <strong className="text-neutral-800">Retrieval imprecision</strong> compounds both: dense
        vector search finds semantically similar chunks that are not factually relevant, feeding
        noise into the context window and increasing the surface area for hallucination.
      </Para>

      <Callout color="red" label="Core Design Principle">
        "No Answer is better than a Bad / Toxic Answer." — If the grader cannot verify the context
        supports the query, the pipeline blocks the response rather than passing through unverified
        content.
      </Callout>

      {/* ── 2. Architecture ── */}
      <SectionHeading>MAP-RAG Architecture: A Three-Layer Defense</SectionHeading>
      <Para>
        DynaSense-RAG implements MAP-RAG (Multi-resolution Agentic Perception RAG) as a directed
        LangGraph state machine. The pipeline has three distinct defense layers that address each
        failure mode independently.
      </Para>

      <Pipeline />

      <Para>
        <strong className="text-neutral-800">Layer 1 — Intelligent Chunking.</strong>{' '}
        Instead of naive fixed-size chunking, the Jina Segmenter API splits documents along
        semantic boundaries. This produces child chunks that are topically coherent, reducing
        the noise each chunk contributes to the reranker.
      </Para>
      <Para>
        <strong className="text-neutral-800">Layer 2 — Small-to-Big Retrieval + Cross-Encoder
        Reranking.</strong>{' '}
        Vector search runs against child chunks (smaller, more precise units). Matches are then
        expanded to their parent document to restore full context. The Jina multilingual
        Cross-Encoder reranks the expanded candidates, surfacing the top K=3 with the highest
        semantic alignment — discarding the rest before the LLM ever sees them.
      </Para>
      <Para>
        <strong className="text-neutral-800">Layer 3 — Dual-Track Grader + Generator.</strong>{' '}
        A query type detector routes each request to one of two LangGraph paths. Factual queries
        require a strict grader that demands a direct answer be present in the context. Analysis
        queries use a relaxed grader that accepts any topic-related background fact, then instructs
        the generator to explicitly label retrieved facts vs. domain reasoning.
      </Para>

      {/* ── 3. Dual-Track ── */}
      <SectionHeading>Dual-Track Query Routing in Detail</SectionHeading>
      <Para>
        The routing decision is based on keyword detection — keywords like{' '}
        <Code>analyze</Code>, <Code>impact</Code>, <Code>why</Code>, <Code>plan</Code>,{' '}
        <Code>risk</Code>, and their Chinese equivalents trigger the analysis track. Everything
        else defaults to the strict factual track.
      </Para>

      <DualTrackTable />

      <Para>
        The output format discipline is what makes the analysis track trustworthy:{' '}
        <Code>[Factual Evidence]</Code> sections are strictly grounded in retrieved text;{' '}
        <Code>[Analytical Reasoning]</Code> sections are explicitly labeled as model reasoning. Users can
        distinguish document evidence from inference at a glance — no hidden hallucination.
      </Para>

      {/* ── 4. No Query Rewrite ── */}
      <SectionHeading>The No-Query-Rewrite Principle</SectionHeading>
      <Callout color="amber" label="Key Design Decision">
        MAP-RAG explicitly rejects real-time query rewriting on the critical path. Precision
        is achieved through better chunking and reranking — not by rephrasing the user's intent.
      </Callout>
      <Para>
        This runs counter to common RAG advice. The reasoning: rewriting works well for
        open-domain web search where paraphrase diversity helps. In enterprise knowledge bases,
        exact terminology matters. A compliance query using internal product codes or regulatory
        identifiers must not be paraphrased. Intent Drift is a correctness bug, not a style issue.
      </Para>
      <Para>
        The latency benefit is a bonus. Eliminating a round-trip LLM call for query rewriting
        cuts end-to-end p95 latency significantly, with no recall penalty — because the reranker
        handles the precision work instead.
      </Para>

      {/* ── 5. Benchmark ── */}
      <SectionHeading>Benchmark Results: +10% Recall@1 on SciQ</SectionHeading>
      <Para>
        The pipeline was benchmarked against 100 questions drawn from the HuggingFace SciQ dataset
        (1,000 source documents). Baseline is Vertex AI <Code>text-embedding-004</Code> vector
        search alone; the MAP-RAG pipeline adds the Jina reranker on top.
      </Para>

      <BenchmarkTable />

      <Para>
        The +10 percentage point jump in Recall@1 is the critical number: it means the correct
        context is the very first result in 96% of queries, so the LLM grader only needs to
        evaluate one chunk to produce a verified answer. This eliminates the majority of
        hallucination surface area while also reducing token cost and latency.
      </Para>

      {/* ── 6. Memory ── */}
      <SectionHeading>Server-Side Multi-Turn Memory</SectionHeading>
      <Para>
        Enterprise users ask follow-up questions. MAP-RAG manages conversation sessions
        server-side using a <Code>conversation_id</Code> key with TTL cleanup. Each turn calls{' '}
        <Code>_build_query_with_history()</Code>, which injects compressed prior context into the
        retrieval query while respecting a configurable context-length budget.
      </Para>
      <Para>
        A dedicated A/B endpoint (<Code>POST /api/chat/session/ab</Code>) runs both the{' '}
        <Code>prioritized</Code> and <Code>legacy</Code> memory strategies in parallel, returning
        side-by-side answers and blocking status. This makes it practical to diagnose memory
        strategy effects without rebuilding the whole pipeline.
      </Para>

      {/* ── 7. Stack ── */}
      <SectionHeading>Tech Stack</SectionHeading>
      <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[
          ['Orchestration', 'LangGraph · LangChain'],
          ['Embedding', 'Vertex AI text-embedding-004'],
          ['LLM', 'Gemini 2.5 Pro'],
          ['Vector DB', 'LanceDB'],
          ['Chunking', 'Jina Segmenter API'],
          ['Reranker', 'Jina Multilingual v2'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-neutral-100 bg-neutral-50 px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
            <p className="mt-0.5 text-[13px] font-medium text-neutral-700">{value}</p>
          </div>
        ))}
      </div>

      {/* ── 8. Conclusion ── */}
      <SectionHeading>Conclusion</SectionHeading>
      <Para>
        DynaSense-RAG demonstrates that enterprise-grade RAG does not require more LLM calls — it
        requires smarter retrieval. The combination of semantic chunking, Small-to-Big expansion,
        Cross-Encoder reranking, and dual-track grading achieves near-perfect recall while
        maintaining strict hallucination control.
      </Para>
      <Para>
        The No-Query-Rewrite principle and the Fail-Closed grader are the two architectural
        choices that matter most in practice: they trade marginal recall gains for correctness
        guarantees that are non-negotiable in regulated environments.
      </Para>

      {/* ── GitHub CTA ── */}
      <div className="mt-8 flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4">
        <svg className="size-5 shrink-0 text-neutral-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-neutral-800">DynaSense-RAG (MAP-RAG Architecture)</p>
          <p className="text-[11px] text-neutral-500">github.com/ordiy/DynaSense-RAG</p>
        </div>
        <a
          href="https://github.com/ordiy/DynaSense-RAG"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-700"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  )
}

/* ── Main export ── */
export function BlogPost() {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="border-neutral-100 rounded-2xl border bg-white p-6 sm:p-8">
      {/* ── Card header ── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="bg-sky-50 text-sky-600 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-widest">
          Architecture
        </span>
        <span className="bg-neutral-100 text-neutral-500 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-widest">
          RAG
        </span>
        <span className="bg-neutral-100 text-neutral-500 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-widest">
          Anti-Hallucination
        </span>
        <span className="ml-auto text-xs text-neutral-400">Mar 2026 · 8 min read</span>
      </div>

      <h3 className="text-neutral-950 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
        DynaSense-RAG: Building Hallucination-Free RAG for the Enterprise
      </h3>
      <p className="text-neutral-500 mt-1 text-sm">
        MAP-RAG — Multi-resolution Agentic Perception Retrieval-Augmented Generation
      </p>

      <p className="text-neutral-600 mt-4 text-[15px] leading-relaxed">
        Standard RAG pipelines suffer from three enterprise-breaking failure modes: hallucination,
        intent drift, and retrieval imprecision. DynaSense-RAG addresses all three through
        intelligent chunking, Cross-Encoder reranking, and a dual-track LangGraph grader —
        achieving <strong className="text-neutral-800">+10% Recall@1</strong> over baseline
        vector search with a strict fail-closed guarantee.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Tag>LangGraph</Tag>
        <Tag>Jina Reranker</Tag>
        <Tag>LanceDB</Tag>
        <Tag>Gemini 2.5 Pro</Tag>
        <Tag>Small-to-Big Retrieval</Tag>
        <Tag>Dual-Track Routing</Tag>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-sky-600 transition-colors hover:text-sky-700"
      >
        {expanded ? (
          <>
            <span className="inline-block rotate-90 transition-transform">›</span>
            Collapse
          </>
        ) : (
          <>
            <span className="transition-transform">›</span>
            Read full article
          </>
        )}
      </button>

      {expanded && <ArticleBody />}
    </article>
  )
}
