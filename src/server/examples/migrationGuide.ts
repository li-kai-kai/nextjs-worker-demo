/**
 * 迁移指南: 从 DependencyManager 到基于编译入口的方案
 */
import { executeFromBundle, executeFunction } from '../lib/workerPool'
import { DependencyManager } from '../lib/dependencyManager'
import path from 'path'

/**
 * 旧方案示例 - 使用 DependencyManager
 */
async function oldApproachExample() {
  console.log('📖 旧方案示例 (DependencyManager)')
  console.log('-'.repeat(50))

  try {
    // 使用已注册的math处理器
    const result1 = await executeFunction(
      DependencyManager.getFunctionCode('math', 'complexCalculation'),
      'complexCalculation',
      [{ iterations: 500000, complexity: 2 }],
      DependencyManager.getDependencies('math', 'complexCalculation'),
      DependencyManager.isAsync('math', 'complexCalculation')
    )
    
    console.log('🧮 复杂计算结果:', result1.result)

    // 使用需要依赖的data处理器
    const result2 = await executeFunction(
      DependencyManager.getFunctionCode('data', 'polarsAnalysis'),
      'polarsAnalysis',
      ['sales-data.parquet'],
      DependencyManager.getDependencies('data', 'polarsAnalysis'),
      DependencyManager.isAsync('data', 'polarsAnalysis')
    )
    
    console.log('📊 Polars分析结果:', result2.result?.fileName)

  } catch (error) {
    console.log('❌ 旧方案错误 (预期的):', error.message)
  }
}

/**
 * 创建新方案的等效处理器文件
 */
const newProcessorCode = `
// 新方案处理器 - 直接使用import/require
const path = require('path')

/**
 * 复杂数学计算 - 新方案版本
 */
function complexCalculation(params = {}) {
  const { iterations = 1000000, complexity = 1 } = params
  const startTime = Date.now()
  
  let result = 0
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i) * complexity
  }
  
  return {
    result: Math.round(result * 100) / 100,
    duration: Date.now() - startTime,
    iterations,
    complexity,
    approach: 'new-bundled'
  }
}

/**
 * CSV文件处理 - 新方案版本（支持跨模块依赖）
 */
async function csvProcessor(params) {
  const fs = require('fs')
  const path = require('path')
  
  const { filePath } = params
  
  try {
    const data = await fs.promises.readFile(filePath, 'utf8')
    const lines = data.split('\\n').filter(line => line.trim())
    
    // 使用内置工具进行更复杂的处理
    const sampleData = lines.slice(0, 5)
    const wordCounts = lines.map(line => line.split(',').length)
    const avgWordsPerLine = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length
    
    return {
      totalLines: lines.length,
      sampleData,
      fileSize: Buffer.byteLength(data, 'utf8'),
      avgWordsPerLine: Math.round(avgWordsPerLine * 100) / 100,
      approach: 'new-bundled'
    }
  } catch (error) {
    throw new Error(\`CSV processing failed: \${error.message}\`)
  }
}

/**
 * 业务数据处理器 - 演示跨模块依赖
 */
function businessDataProcessor(data) {
  // 这里可以import其他业务模块，无需手动配置依赖
  const processedData = data.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now(),
    hash: require('crypto').createHash('md5').update(JSON.stringify(item)).digest('hex').substr(0, 8)
  }))
  
  return {
    originalCount: data.length,
    processedCount: processedData.length,
    data: processedData,
    approach: 'new-bundled'
  }
}

// 导出所有函数
module.exports = {
  complexCalculation,
  csvProcessor,
  businessDataProcessor
}
`

/**
 * 新方案示例 - 使用编译入口
 */
async function newApproachExample() {
  console.log('\n🚀 新方案示例 (编译入口)')
  console.log('-'.repeat(50))

  try {
    // 创建临时处理器文件来演示
    const { createTempEntryFile, cleanupTempFile } = await import('../lib/bundler')
    const tempFile = await createTempEntryFile(newProcessorCode)

    try {
      // 执行复杂计算
      const result1 = await executeFromBundle(
        tempFile,
        'complexCalculation',
        [{ iterations: 500000, complexity: 2 }]
      )
      
      console.log('🧮 复杂计算结果:', result1.result)
      console.log('   优势: 无需手动管理依赖，代码更简洁')

      // 执行业务数据处理
      const testData = [
        { id: 1, name: 'Alice', score: 95 },
        { id: 2, name: 'Bob', score: 87 },
        { id: 3, name: 'Charlie', score: 92 }
      ]
      
      const result2 = await executeFromBundle(
        tempFile,
        'businessDataProcessor',
        [testData]
      )
      
      console.log('📦 业务数据处理结果:', {
        原始数量: result2.result.originalCount,
        处理数量: result2.result.processedCount,
        样本: result2.result.data[0]
      })
      console.log('   优势: 支持require动态依赖，无需预先配置')

      // 显示bundle信息
      console.log('\n📈 Bundle信息:')
      console.log(`   Bundle大小: ${result1.bundleSize} bytes`)
      console.log(`   可用函数: complexCalculation, csvProcessor, businessDataProcessor`)

    } finally {
      // 清理临时文件
      cleanupTempFile(tempFile)
    }

  } catch (error) {
    console.error('❌ 新方案错误:', error.message)
  }
}

/**
 * 方案对比总结
 */
function comparisonSummary() {
  console.log('\n📊 方案对比总结')
  console.log('='.repeat(60))
  
  console.log('\n🔴 旧方案 (DependencyManager) 的问题:')
  console.log('   ❌ 需要手动配置依赖列表')
  console.log('   ❌ 跨业务模块依赖困难')
  console.log('   ❌ 函数需要预注册')
  console.log('   ❌ 依赖注入复杂，容易出错')
  console.log('   ❌ 不支持TypeScript的类型检查')
  
  console.log('\n🟢 新方案 (编译入口) 的优势:')
  console.log('   ✅ 自动解析和打包依赖')
  console.log('   ✅ 支持任意跨模块依赖')
  console.log('   ✅ 使用标准的import/require语法')
  console.log('   ✅ 支持TypeScript和现代JS特性')
  console.log('   ✅ 编译时错误检查')
  console.log('   ✅ 更接近正常开发体验')
  console.log('   ✅ 支持npm包和业务模块混用')

  console.log('\n🔄 迁移建议:')
  console.log('   1. 将DependencyManager注册的函数移动到独立文件')
  console.log('   2. 使用标准的module.exports或ES6 export')
  console.log('   3. 将手动依赖配置改为import/require语句')
  console.log('   4. 使用executeFromBundle替代executeFunction')
  console.log('   5. 删除dependencyManager中的函数注册代码')
}

/**
 * 完整的迁移演示
 */
export async function migrationDemo() {
  console.log('🔄 DependencyManager 到编译入口方案迁移演示')
  console.log('='.repeat(70))

  await oldApproachExample()
  await newApproachExample()
  comparisonSummary()

  console.log('\n🎯 迁移完成! 建议在生产环境中逐步替换为新方案。')
}

// 如果直接运行此文件
if (require.main === module) {
  migrationDemo().catch(console.error)
}