import workerpool from 'workerpool'
import path from 'path'

let pool: workerpool.Pool | null = null

export function getWorkerPool(): workerpool.Pool {
  if (!pool) {
    pool = workerpool.pool(
      path.join(process.cwd(), 'src', 'server', 'workers', 'calculation-worker.js'),
      {
        minWorkers: 1,
        maxWorkers: 4,
        workerType: 'process'
      }
    )
  }
  return pool
}

export function closeWorkerPool(): void {
  if (pool) {
    pool.terminate()
    pool = null
  }
}

export async function executeInWorker<T>(
  functionName: string, 
  params?: any[]
): Promise<T> {
  const workerPool = getWorkerPool()
  return workerPool.exec(functionName, params || [])
}