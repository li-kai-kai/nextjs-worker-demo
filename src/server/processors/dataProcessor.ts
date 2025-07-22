/**
 * 数据处理器 - 演示跨模块依赖的业务处理器
 */
import { MathUtils, FileUtils, ValidationUtils } from '../utils/businessUtils'
import path from 'path'

/**
 * 用户数据分析处理器
 */
export async function analyzeUserData(userData: any[]) {
  const startTime = Date.now()
  
  // 验证数据
  const validUsers = userData.filter(user => {
    return ValidationUtils.isValidEmail(user.email) && 
           ValidationUtils.isPositiveInteger(user.age)
  })

  // 计算年龄统计
  const ages = validUsers.map(user => user.age)
  const ageStats = {
    count: ages.length,
    average: MathUtils.average(ages),
    standardDeviation: MathUtils.standardDeviation(ages),
    min: Math.min(...ages),
    max: Math.max(...ages)
  }

  // 按年龄分组
  const ageGroups = {
    young: validUsers.filter(u => u.age < 25).length,
    adult: validUsers.filter(u => u.age >= 25 && u.age < 60).length,
    senior: validUsers.filter(u => u.age >= 60).length
  }

  const processingTime = Date.now() - startTime

  return {
    totalUsers: userData.length,
    validUsers: validUsers.length,
    invalidUsers: userData.length - validUsers.length,
    ageStatistics: ageStats,
    ageDistribution: ageGroups,
    processingTime
  }
}

/**
 * 数学序列分析处理器
 */
export function analyzeMathSequence(n: number) {
  const startTime = Date.now()
  
  // 生成斐波那契数列
  const fibonacci = MathUtils.fibonacci(n)
  
  // 计算统计信息
  const stats = {
    sequence: fibonacci,
    length: fibonacci.length,
    sum: fibonacci.reduce((sum, num) => sum + num, 0),
    average: MathUtils.average(fibonacci),
    standardDeviation: MathUtils.standardDeviation(fibonacci),
    lastValue: fibonacci[fibonacci.length - 1]
  }

  const processingTime = Date.now() - startTime

  return {
    input: n,
    fibonacciStats: stats,
    processingTime
  }
}

/**
 * 文件批处理器
 */
export async function batchProcessFiles(filePathsRelativeToData: string[]) {
  const startTime = Date.now()
  const results = []
  
  for (const relativePath of filePathsRelativeToData) {
    try {
      const fullPath = path.join(process.cwd(), 'src', 'data', relativePath)
      const stats = await FileUtils.getFileStats(fullPath)
      
      results.push({
        file: relativePath,
        success: true,
        stats
      })
    } catch (error) {
      results.push({
        file: relativePath,
        success: false,
        error: error.message
      })
    }
  }

  const processingTime = Date.now() - startTime
  
  return {
    processedFiles: results.length,
    successfulFiles: results.filter(r => r.success).length,
    failedFiles: results.filter(r => !r.success).length,
    results,
    processingTime
  }
}

/**
 * 复合数据处理器 - 同时使用多个工具模块
 */
export async function complexDataProcessing(params: {
  numbers: number[]
  emails: string[]
  fibonacciLength: number
}) {
  const startTime = Date.now()
  const { numbers, emails, fibonacciLength } = params

  // 数学计算
  const mathResults = {
    numbers,
    count: numbers.length,
    average: MathUtils.average(numbers),
    standardDeviation: MathUtils.standardDeviation(numbers)
  }

  // 邮箱验证
  const emailResults = {
    total: emails.length,
    valid: emails.filter(email => ValidationUtils.isValidEmail(email)).length,
    invalid: emails.filter(email => !ValidationUtils.isValidEmail(email)).length,
    validEmails: emails.filter(email => ValidationUtils.isValidEmail(email)),
    invalidEmails: emails.filter(email => !ValidationUtils.isValidEmail(email))
  }

  // 斐波那契计算
  const fibonacciSequence = MathUtils.fibonacci(fibonacciLength)
  const fibonacciResults = {
    length: fibonacciLength,
    sequence: fibonacciSequence,
    sum: fibonacciSequence.reduce((sum, num) => sum + num, 0),
    average: MathUtils.average(fibonacciSequence)
  }

  const processingTime = Date.now() - startTime

  return {
    mathAnalysis: mathResults,
    emailValidation: emailResults,
    fibonacciAnalysis: fibonacciResults,
    totalProcessingTime: processingTime,
    timestamp: new Date().toISOString()
  }
}