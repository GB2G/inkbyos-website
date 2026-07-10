import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { RouteEffects } from './components/RouteEffects'
import { HomePage } from './pages/HomePage'
import { WorkPage } from './pages/WorkPage'
import { AftercarePage } from './pages/AftercarePage'
import { BookPage } from './pages/BookPage'

export function App() {
  return (
    <>
      <RouteEffects />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/aftercare" element={<AftercarePage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  )
}
