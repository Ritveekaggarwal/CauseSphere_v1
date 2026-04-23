import React from 'react'
import Home from './pages/Home.jsx'
import Donor from './pages/Donor.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/donor" element={<Donor />} /> */}
      </Routes>
    </Router>
  )
}

export default App