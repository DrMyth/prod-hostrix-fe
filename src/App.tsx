import './App.css'
import { BrowserRouter, Route, Routes,  } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Verify from './pages/Verify'
import Dashboard from './pages/Dashboard'
import Deploy from './pages/Deploy'
import Project from './pages/Project';
import NewProject from './pages/NewProject'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/project/new" element={<NewProject/>} />
        <Route path="/project/:projectId" element={<Project/>} />
        <Route path="/deploy/:projectId" element={<Deploy/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
