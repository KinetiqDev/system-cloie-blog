import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Chapter1 from './pages/Chapter1'
import Chapter2 from './pages/Chapter2'
import Chapter3 from './pages/Chapter3'
import References from './pages/References'

function App() {
  const location = useLocation()

  return (
    <ThemeProvider>
      <div className="app">
        <ScrollToTop />
        <Header />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/chapter1" element={<Chapter1 />} />
            <Route path="/chapter2" element={<Chapter2 />} />
            <Route path="/chapter3" element={<Chapter3 />} />
            <Route path="/references" element={<References />} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <BackToTop />
      </div>
    </ThemeProvider>
  )
}

export default App
