import workerpool from 'workerpool'
import path from 'path'
import { bundleForWorker, BundleOptions, cleanupTempFile, createTempEntryFile } from './bundler'

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

/**
 * 编译并执行入口文件中的函数
 * @param entryPoint 入口文件路径
 * @param functionName 要执行的函数名
 * @param args 函数参数
 * @param bundleOptions 编译选项
 */
export async function executeFromBundle<T>(
  entryPoint: string,
  functionName: string,
  args: any[] = [],
  bundleOptions?: Partial<BundleOptions>
): Promise<T> {
  const bundleResult = await bundleForWorker({
    entryPoint,
    ...bundleOptions
  })

  // 检查函数是否在导出列表中
  if (!bundleResult.exports.includes(functionName)) {
    throw new Error(`Function '${functionName}' not found in exports: [${bundleResult.exports.join(', ')}]`)
  }

  const workerPool = getWorkerPool()
  return workerPool.exec('executeBundle', [bundleResult.code, functionName, args])
}

/**
 * 从代码字符串创建临时入口文件并执行
 * @param code 代码字符串
 * @param functionName 要执行的函数名
 * @param args 函数参数
 * @param bundleOptions 编译选项
 */
export async function executeFromCode<T>(
  code: string,
  functionName: string,
  args: any[] = [],
  bundleOptions?: Partial<BundleOptions>
): Promise<T> {
  let tempFile: string | null = null
  
  try {
    // 创建临时文件
    tempFile = await createTempEntryFile(code)
    
    // 执行
    return await executeFromBundle<T>(tempFile, functionName, args, bundleOptions)
  } finally {
    // 清理临时文件
    if (tempFile) {
      cleanupTempFile(tempFile)
    }
  }
}