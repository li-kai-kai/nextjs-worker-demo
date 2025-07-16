import { useState } from 'react'

interface CalculationSectionProps {
  onApiCall: (apiCall: () => Promise<any>) => void
  loading: boolean
}

export default function CalculationSection({ onApiCall, loading }: CalculationSectionProps) {
  const [calculationType, setCalculationType] = useState('complex')

  const handleStandardCalculation = async () => {
    const url = calculationType === 'matrix' 
      ? '/api/calculate?type=matrix&size=100'
      : '/api/calculate?type=complex&iterations=1000000&complexity=2'
    
    const response = await fetch(url)
    return response.json()
  }

  const handleHeavyCalculation = async () => {
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
    return response.json()
  }

  return (
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
          onClick={() => onApiCall(handleStandardCalculation)}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Run Standard Calculation
        </button>
        
        <button
          onClick={() => onApiCall(handleHeavyCalculation)}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Run Heavy Calculation
        </button>
      </div>
    </div>
  )
}