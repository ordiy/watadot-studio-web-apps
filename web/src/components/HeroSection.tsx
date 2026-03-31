import { useRef } from 'react'
import { KnowledgeGraphBackground } from './KnowledgeGraphBackground'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="map-rag"
      className="border-neutral-200/80 relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden border-b bg-[#fafafa] px-5 py-20 sm:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        <KnowledgeGraphBackground containerRef={sectionRef} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p
          id="foresight-agent"
          className="text-neutral-500 mb-4 text-xs font-medium uppercase tracking-[0.2em] sm:text-sm"
        >
          ForesightAgent · MAP-RAG
        </p>
        <h1
          id="hero-heading"
          className="text-neutral-950 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[3.5rem]"
        >
          From Hindsight
          <span className="text-neutral-400 font-normal"> to </span>
          Foresight.
        </h1>
        <p className="text-neutral-600 mx-auto mt-3 max-w-2xl text-lg leading-relaxed sm:text-xl">
          The &ldquo;What-If&rdquo; Revolution in AI-Driven Analytics
        </p>
        <p className="text-neutral-500 mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
          Data analysis is evolving from a retrospective report of &ldquo;what
          happened&rdquo; into an AI-powered simulation of &ldquo;what could
          be.&rdquo;
        </p>
      </div>
    </section>
  )
}
