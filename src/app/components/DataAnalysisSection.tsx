import { useState } from 'react'

interface DataAnalysisSectionProps {
  onApiCall: (apiCall: () => Promise<any>) => void
  loading: boolean
}

export default function DataAnalysisSection({ onApiCall, loading }: DataAnalysisSectionProps) {
  const [dataAnalysisType, setDataAnalysisType] = useState('sales')
  const [analysisLevel, setAnalysisLevel] = useState('basic')

  const handleDataAnalysis = async () => {
    const url = `/api/calculate?type=${dataAnalysisType}&analysis=${analysisLevel}`
    const response = await fetch(url)
    return response.json()
  }

  const handleAdvancedDataAnalysis = async () => {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: dataAnalysisType,
        analysis: 'advanced',
        fileName: dataAnalysisType === 'sales' ? 'sales-data.parquet' : 'user-data.parquet'
      })
    })
    return response.json()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
      <h2 className="text-xl font-semibold mb-4">🚀 Polars Data Analysis</h2>
      <p className="text-sm text-gray-600 mb-4">
        Analyze parquet files using nodejs-polars in worker threads
      </p>
      
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Data Type:</label>
          <select
            value={dataAnalysisType}
            onChange={(e) => setDataAnalysisType(e.target.value)}
            className="border rounded px-3 py-2 mr-4"
            disabled={loading}
          >
            <option value="sales">Sales Data (10k records)</option>
            <option value="users">User Data (5k records)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Analysis Level:</label>
          <select
            value={analysisLevel}
            onChange={(e) => setAnalysisLevel(e.target.value)}
            className="border rounded px-3 py-2 mr-4"
            disabled={loading}
          >
            <option value="basic">Basic (Schema + Sample)</option>
            <option value="advanced">Advanced (Full Analytics)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onApiCall(handleDataAnalysis)}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Run Analysis
        </button>
        
        <button
          onClick={() => onApiCall(handleAdvancedDataAnalysis)}
          disabled={loading}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          Deep Analysis
        </button>
      </div>
    </div>
  )
}