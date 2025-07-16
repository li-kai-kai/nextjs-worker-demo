'use client'

import { useState } from 'react'

export default function Page() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [calculationType, setCalculationType] = useState('complex')
  const [dataAnalysisType, setDataAnalysisType] = useState('sales')
  const [analysisLevel, setAnalysisLevel] = useState('basic')

  const handleGetRequest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/hello')
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostRequest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Next.js',
          version: '15.3.3',
          message: 'This is a POST request'
        })
      })
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplexCalculation = async () => {
    setLoading(true)
    try {
      const url = calculationType === 'matrix' 
        ? '/api/calculate?type=matrix&size=100'
        : '/api/calculate?type=complex&iterations=1000000&complexity=2'
      
      const response = await fetch(url)
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomCalculation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: calculationType,
          iterations: 2000000,
          complexity: 3,
          size: 150
        })
      })
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDataAnalysis = async () => {
    setLoading(true)
    try {
      const url = `/api/calculate?type=${dataAnalysisType}&analysis=${analysisLevel}`
      const response = await fetch(url)
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdvancedDataAnalysis = async () => {
    setLoading(true)
    try {
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
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Next.js Worker Pool + Polars Demo</h1>
      <p className="text-gray-600 mb-8">
        Demonstrating complex calculations and data analysis using workerpool and nodejs-polars
      </p>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic API Tests</h2>
          <div className="flex gap-4">
            <button
              onClick={handleGetRequest}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Simple GET
            </button>
            
            <button
              onClick={handlePostRequest}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Simple POST
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Complex Worker Calculations</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Calculation Type:</label>
            <select
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value)}
              className="border rounded px-3 py-2 mr-4"
              disabled={loading}
            >
              <option value="complex">Complex Math (Prime + Fibonacci)</option>
              <option value="matrix">Matrix Multiplication</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleComplexCalculation}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Run Standard Calculation
            </button>
            
            <button
              onClick={handleCustomCalculation}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Run Heavy Calculation
            </button>
          </div>
        </div>

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
              onClick={handleDataAnalysis}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Run Analysis
            </button>
            
            <button
              onClick={handleAdvancedDataAnalysis}
              disabled={loading}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              Deep Analysis
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700 mr-2"></div>
              Processing calculation in worker pool...
            </div>
          </div>
        )}

        {apiResponse && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Results:</h2>
            
            {/* Traditional calculation results */}
            {apiResponse.data?.statistics && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded shadow">
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold">{apiResponse.data.statistics.duration}ms</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="text-sm text-gray-600">Iterations</div>
                  <div className="font-semibold">{apiResponse.data.statistics.iterations?.toLocaleString()}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="text-sm text-gray-600">Result</div>
                  <div className="font-semibold">{apiResponse.data.result}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="text-sm text-gray-600">Memory (MB)</div>
                  <div className="font-semibold">{Math.round((apiResponse.data.statistics.memoryUsage?.heapUsed || 0) / 1024 / 1024)}</div>
                </div>
              </div>
            )}

            {/* Polars analysis results */}
            {apiResponse.data?.results && (
              <div className="mb-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">
                    📊 {apiResponse.data.analysisType === 'sales' ? 'Sales' : 'User'} Analysis Results
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white p-3 rounded shadow">
                      <div className="text-sm text-gray-600">Processing Time</div>
                      <div className="font-semibold">{apiResponse.data.processingTime}ms</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow">
                      <div className="text-sm text-gray-600">Analysis Type</div>
                      <div className="font-semibold capitalize">{apiResponse.data.analysisType}</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow">
                      <div className="text-sm text-gray-600">Records</div>
                      <div className="font-semibold">{apiResponse.data.results.summary?.totalRecords || apiResponse.data.results.summary?.totalUsers || 'N/A'}</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow">
                      <div className="text-sm text-gray-600">Memory (MB)</div>
                      <div className="font-semibold">{Math.round((apiResponse.data.memoryUsage?.heapUsed || 0) / 1024 / 1024)}</div>
                    </div>
                  </div>

                  {/* Advanced analysis visualization */}
                  {apiResponse.data.results.productAnalysis && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">🛍️ Top Products by Revenue</h4>
                      <div className="bg-white p-3 rounded shadow">
                        {apiResponse.data.results.productAnalysis.slice(0, 3).map((product: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="font-medium">{product.product}</span>
                            <span className="text-green-600">${product.total_revenue?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {apiResponse.data.results.subscriptionAnalysis && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">👥 Subscription Distribution</h4>
                      <div className="bg-white p-3 rounded shadow">
                        {apiResponse.data.results.subscriptionAnalysis.map((sub: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="font-medium">{sub.subscription_type}</span>
                            <span className="text-blue-600">{sub.user_count} users</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                View Full Response Data
              </summary>
              <pre className="text-xs mt-2 p-3 bg-gray-100 rounded overflow-x-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}