interface LoadingIndicatorProps {
  loading: boolean
}

export default function LoadingIndicator({ loading }: LoadingIndicatorProps) {
  if (!loading) return null

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700 mr-2"></div>
        Processing calculation in worker pool...
      </div>
    </div>
  )
}