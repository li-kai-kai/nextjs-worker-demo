import { NextResponse } from 'next/server'
import { ApiResponse, WorkerPoolStats } from '../../shared/types/api'
import { getWorkerPool } from '../lib/workerPool'

export function createSuccessResponse<T>(
  data: T,
  type?: string
): NextResponse<ApiResponse<T>> {
  const workerPool = getWorkerPool()
  
  return NextResponse.json({
    success: true,
    type,
    data,
    worker: {
      poolStats: workerPool.stats() as WorkerPoolStats,
      timestamp: new Date().toISOString()
    }
  })
}

export function createErrorResponse(
  error: string,
  message?: string,
  status: number = 500
): NextResponse<ApiResponse> {
  console.error('API Error:', error)
  
  return NextResponse.json(
    {
      success: false,
      error,
      message: message || 'An error occurred'
    },
    { status }
  )
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  return createErrorResponse('Operation failed', errorMessage)
}