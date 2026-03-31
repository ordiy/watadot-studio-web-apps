import { BlogPost } from './BlogPost'
import { ForesightAgentDemo } from './ForesightAgentDemo'
import { RagDemo } from './RagDemo'

/** Anchor sections for navbar links. */
export function AnchorSections() {
  return (
    <div className="bg-white">
      {/* ForesightAgent Demo */}
      <section
        id="foresight-agent"
        className="border-neutral-100 mx-auto max-w-5xl border-t px-5 py-16 sm:px-8"
        aria-labelledby="foresight-agent-heading"
      >
        <div className="mb-8">
          <p className="text-neutral-500 mb-1 text-xs font-medium uppercase tracking-[0.18em]">
            ForesightAgent · Demo
          </p>
          <h2
            id="foresight-agent-heading"
            className="text-neutral-950 text-2xl font-semibold tracking-tight"
          >
            What-If Scenario Simulation
          </h2>
          <p className="text-neutral-500 mt-2 max-w-xl text-sm leading-relaxed">
            Ask a what-if question and watch the agent decompose it into a
            verifiable pipeline — grounded in your data, traceable to sources.
          </p>
        </div>
        <ForesightAgentDemo />
      </section>

      {/* MAP-RAG Demo */}
      <section
        id="rag-demo"
        className="border-neutral-100 mx-auto max-w-4xl border-t px-5 py-16 sm:px-8"
        aria-labelledby="rag-demo-heading"
      >
        <div className="mb-8">
          <p className="text-neutral-500 mb-1 text-xs font-medium uppercase tracking-[0.18em]">
            MAP-RAG · Demo
          </p>
          <h2
            id="rag-demo-heading"
            className="text-neutral-950 text-2xl font-semibold tracking-tight"
          >
            Knowledge Base Demo
          </h2>
          <p className="text-neutral-500 mt-2 max-w-xl text-sm leading-relaxed">
            Upload documents to build a knowledge base and validate retrieval accuracy with Recall tests.
          </p>
        </div>
        <RagDemo />
      </section>

      <section
        id="blog"
        className="border-neutral-100 mx-auto max-w-4xl border-t px-5 py-16 sm:px-8"
        aria-labelledby="blog-heading"
      >
        <div className="mb-8">
          <h2
            id="blog-heading"
            className="text-neutral-950 text-lg font-semibold tracking-tight"
          >
            Blog
          </h2>
          <p className="text-neutral-500 mt-1 text-sm">
            Technical notes on MAP-RAG, architecture, and enterprise AI.
          </p>
        </div>
        <BlogPost />
      </section>
      <section
        id="about"
        className="border-neutral-100 mx-auto max-w-6xl border-t px-5 py-16 sm:px-8"
        aria-labelledby="about-heading"
      >
        <h2
          id="about-heading"
          className="text-neutral-950 text-lg font-semibold tracking-tight"
        >
          About
        </h2>
        <p className="text-neutral-500 mt-2 max-w-xl text-sm leading-relaxed">
          WataDot builds retrieval and generation systems for teams that care
          about accuracy and traceability.
        </p>
      </section>
    </div>
  )
}
