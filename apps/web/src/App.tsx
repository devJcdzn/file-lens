import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Steps } from './components/Steps'
import { Formats } from './components/Formats'
import { Demo } from './components/Demo'
// MVP: extensão oculta - reativar com:
// import { Install } from './components/Install'
import { Footer } from './components/Footer'
import { ViewerPage } from './pages/ViewerPage'

function Landing() {
  return (
    <div className="site">
      <Nav />
      <main>
        <Hero />
        <Steps />
        <Formats />
        <Demo />
        {/* MVP: extensão oculta
        <Install />
        */}
      </main>
      <Footer />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/viewer" element={<ViewerPage />} />
      </Routes>
    </BrowserRouter>
  )
}
