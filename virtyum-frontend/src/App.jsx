import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Products from './components/Products'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'products':
        return <Products />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  )
}

export default App
