interface ApiTestSectionProps {
  onApiCall: (apiCall: () => Promise<any>) => void
  loading: boolean
}

export default function ApiTestSection({ onApiCall, loading }: ApiTestSectionProps) {
  const handleGetRequest = async () => {
    const response = await fetch('/api/hello')
    return response.json()
  }

  const handlePostRequest = async () => {
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
    return response.json()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Basic API Tests</h2>
      <div className="flex gap-4">
        <button
          onClick={() => onApiCall(handleGetRequest)}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Simple GET
        </button>
        
        <button
          onClick={() => onApiCall(handlePostRequest)}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Simple POST
        </button>
      </div>
    </div>
  )
}