export interface WorkerPoolStats {
  totalWorkers: number
  busyWorkers: number
  idleWorkers: number
  pendingTasks: number
}

export interface ApiResponse<T = any> {
  success: boolean
  type?: string
  data?: T
  worker?: {
    poolStats: WorkerPoolStats
    timestamp: string
  }
  error?: string
  message?: string
}

export interface CalculationParams {
  iterations?: number
  complexity?: number
  size?: number
}

export interface DataAnalysisParams {
  fileName?: string
  analysis?: 'basic' | 'advanced'
  segmentation?: 'basic' | 'advanced'
}

export interface CalculationResult {
  result: number
  statistics: {
    iterations: number
    complexity: number
    primeCount: number
    fibonacciSum: number
    duration: number
    averageTimePerIteration: number
    dataPoints: number
    memoryUsage: NodeJS.MemoryUsage
    startTime: number
    endTime: number
  }
  sampleData: Array<{
    iteration: number
    value: number
    timestamp: number
  }>
}

export interface MatrixCalculationResult {
  matrixSize: number
  sum: number
  average: number
  duration: number
  memoryUsage: NodeJS.MemoryUsage
  operationsCount: number
}

export interface DataAnalysisResult {
  success: boolean
  analysisType: string
  fileName: string
  processingTime: number
  results: any
  memoryUsage: NodeJS.MemoryUsage
  timestamp: string
  error?: string
}