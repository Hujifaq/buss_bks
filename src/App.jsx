import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './index.css'
import Index from './pages/Index'
import BusStops from './pages/BusStops'
import RouteInformation from './pages/RouteInformation'
import HelpSupport from './pages/HelpSupport'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import Topbar from './components/Topbar'

function App() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200) 

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      {isLoading && <Loader fullScreen={true} />}
      <Topbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/bus-stops" element={<BusStops />} />
        <Route path="/route-information" element={<RouteInformation />} />
        <Route path="/search-routes" element={<BusStops />} />
        <Route path="/search" element={<BusStops />} />
        <Route path="/help" element={<HelpSupport />} />
      </Routes>
      
    </>
  )
}

export default App
