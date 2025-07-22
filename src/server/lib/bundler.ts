/**
 * 文件编译器 - 使用esbuild将入口文件编译成worker可执行的代码
 */
import { build } from 'esbuild'
import path from 'path'
import fs from 'fs'

export interface BundleOptions {
  entryPoint: string  // 入口文件路径
  format?: 'cjs' | 'esm'  // 输出格式
  platform?: 'node' | 'browser'
  external?: string[]  // 外部依赖（不打包）
  minify?: boolean
}

export interface BundleResult {
  code: string  // 编译后的代码
  exports: string[]  // 导出的函数名列表
  size: number  // 代码大小
}

/**
 * 编译文件为worker可执行的代码
 */
export async function bundleForWorker(options: BundleOptions): Promise<BundleResult> {
  const {
    entryPoint,
    format = 'cjs',
    platform = 'node',
    external = [],
    minify = false
  } = options

  // 检查入口文件是否存在
  if (!fs.existsSync(entryPoint)) {
    throw new Error(`Entry point file not found: ${entryPoint}`)
  }

  try {
    // 使用esbuild编译
    const result = await build({
      entryPoints: [entryPoint],
      bundle: true,
      platform,
      format,
      minify,
      external,
      write: false,  // 不写文件，返回内容
      outdir: 'out',
      metafile: true,
      treeShaking: true,
      sourcemap: false
    })

    if (result.outputFiles.length === 0) {
      throw new Error('No output files generated')
    }

    const code = result.outputFiles[0].text
    
    // 分析导出的函数
    const exports = analyzeExports(code, format)
    
    return {
      code,
      exports,
      size: Buffer.byteLength(code, 'utf8')
    }
  } catch (error) {
    throw new Error(`Bundle failed: ${error.message}`)
  }
}

/**
 * 分析代码中的导出函数
 */
function analyzeExports(code: string, format: 'cjs' | 'esm'): string[] {
  const exports: string[] = []
  
  if (format === 'cjs') {
    // 匹配 exports.functionName = 或 module.exports.functionName =
    const exportRegex = /(?:exports|module\.exports)\.(\w+)\s*=/g
    let match
    while ((match = exportRegex.exec(code)) !== null) {
      exports.push(match[1])
    }
    
    // 匹配 module.exports = { functionName: ... }
    const moduleExportRegex = /module\.exports\s*=\s*{([^}]+)}/g
    const moduleMatch = moduleExportRegex.exec(code)
    if (moduleMatch) {
      const objectContent = moduleMatch[1]
      const functionRegex = /(\w+)\s*:/g
      let funcMatch
      while ((funcMatch = functionRegex.exec(objectContent)) !== null) {
        exports.push(funcMatch[1])
      }
    }
  } else {
    // ESM格式
    const exportRegex = /export\s+(?:(?:async\s+)?function\s+(\w+)|(?:const|let|var)\s+(\w+))/g
    let match
    while ((match = exportRegex.exec(code)) !== null) {
      exports.push(match[1] || match[2])
    }
  }
  
  return [...new Set(exports)]  // 去重
}

/**
 * 创建临时入口文件（用于动态生成代码）
 */
export async function createTempEntryFile(
  code: string, 
  tempDir: string = path.join(process.cwd(), '.tmp')
): Promise<string> {
  // 确保临时目录存在
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
  
  const tempFile = path.join(tempDir, `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.js`)
  fs.writeFileSync(tempFile, code)
  
  return tempFile
}

/**
 * 清理临时文件
 */
export function cleanupTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.warn(`Failed to cleanup temp file: ${filePath}`, error)
  }
}