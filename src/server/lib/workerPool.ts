import workerpool from 'workerpool'
import path from 'path'

let pool: workerpool.Pool | null = null

/**
 * 纯粹的Worker Pool - 只负责进程管理，不涉及具体业务逻辑
 */
export function getWorkerPool(): workerpool.Pool {
  if (!pool) {
    pool = workerpool.pool(
      path.join(process.cwd(), 'src', 'server', 'workers', 'generic-worker.js'),
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

/**
 * 在Worker中执行函数代码（支持依赖注入）
 * @param functionCode 要执行的函数代码字符串
 * @param functionName 函数名
 * @param args 函数参数
 * @param dependencies 依赖模块列表
 * @param isAsync 是否为异步函数
 */
export async function executeFunction<T>(
  functionCode: string,
  functionName: string,
  args: any[] = [],
  dependencies: string[] = [],
  isAsync: boolean = true
): Promise<T> {
  const workerPool = getWorkerPool()
  const method = isAsync ? 'execute' : 'executeSync'
  return workerPool.exec(method, [functionCode, functionName, args, dependencies])
}