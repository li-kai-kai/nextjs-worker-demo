'use client'

import { useState } from 'react'
import ApiTestSection from './ApiTestSection'
import CalculationSection from './CalculationSection'
import DataAnalysisSection from './DataAnalysisSection'
import ResultsDisplay from './ResultsDisplay'
import LoadingIndicator from './LoadingIndicator'

export default function HomePage() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleApiCall = (apiCall: () => Promise<any>) => {
    setLoading(true)
    apiCall()
      .then(setApiResponse)
      .catch(error => console.error('Error:', error))
      .finally(() => setLoading(false))
  }

  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Next.js Worker Pool + Polars Demo</h1>
        <p className="text-gray-600">
          Demonstrating complex calculations and data analysis using workerpool and nodejs-polars
        </p>
      </header>
      
      <div className="space-y-6">
        <ApiTestSection onApiCall={handleApiCall} loading={loading} />
        <CalculationSection onApiCall={handleApiCall} loading={loading} />
        <DataAnalysisSection onApiCall={handleApiCall} loading={loading} />
        
        <LoadingIndicator loading={loading} />
        <ResultsDisplay apiResponse={apiResponse} />
      </div>
    </div>
  )
}