type Props = {
  className?: string
  /** Pulse the core node (navbar). */
  animated?: boolean
  title?: string
}

/**
 * WataDot wordmark icon: graph edges + hub “dot” (MAP-RAG metaphor).
 * Geometry matches `public/favicon.svg` (minus rounded tile / static core in favicon).
 */
export function WataDotMark({
  className,
  animated = false,
  title = 'WataDot',
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <g
        className="text-neutral-900"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2}
      >
        <path d="M16 16V7.5M16 16l-8 9M16 16l8 9" />
      </g>
      <circle cx="16" cy="7.5" r="2.75" fill="currentColor" className="text-neutral-900" />
      <circle cx="8" cy="25" r="2.75" fill="currentColor" className="text-neutral-900" />
      <circle cx="24" cy="25" r="2.75" fill="currentColor" className="text-neutral-900" />
      <circle
        cx="16"
        cy="16"
        r="4.25"
        fill="currentColor"
        className={`text-sky-600 ${animated ? 'animate-breathe-logo-core' : ''}`}
      />
    </svg>
  )
}
