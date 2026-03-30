/** Minimal anchor targets for navbar links until full pages exist. */
export function AnchorSections() {
  return (
    <div className="bg-white">
      <section
        id="blog"
        className="border-neutral-100 mx-auto max-w-6xl border-t px-5 py-16 sm:px-8"
        aria-labelledby="blog-heading"
      >
        <h2
          id="blog-heading"
          className="text-neutral-950 text-lg font-semibold tracking-tight"
        >
          Blog
        </h2>
        <p className="text-neutral-500 mt-2 max-w-xl text-sm leading-relaxed">
          Notes on MAP-RAG, evaluation, and product — coming soon.
        </p>
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
