interface ResultsDisplayProps {
  apiResponse: any
}

export default function ResultsDisplay({ apiResponse }: ResultsDisplayProps) {
  if (!apiResponse) return null

  return (
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
  )
}