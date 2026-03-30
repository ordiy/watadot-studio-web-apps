import { AnchorSections } from './components/AnchorSections'
import { HeroSection } from './components/HeroSection'
import { Navbar } from './components/Navbar'
import { SiteFooter } from './components/SiteFooter'

function App() {
  return (
    <div className="text-neutral-900 flex min-h-svh flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AnchorSections />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
