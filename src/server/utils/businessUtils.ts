/**
 * 业务工具模块 - 演示跨模块依赖
 */
import fs from 'fs'
import path from 'path'

/**
 * 数学工具函数
 */
export const MathUtils = {
  /**
   * 计算数组平均值
   */
  average(numbers: number[]): number {
    if (numbers.length === 0) return 0
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
  },

  /**
   * 计算标准差
   */
  standardDeviation(numbers: number[]): number {
    if (numbers.length === 0) return 0
    const avg = this.average(numbers)
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - avg, 2), 0) / numbers.length
    return Math.sqrt(variance)
  },

  /**
   * 生成斐波那契数列
   */
  fibonacci(n: number): number[] {
    if (n <= 0) return []
    if (n === 1) return [0]
    if (n === 2) return [0, 1]
    
    const result = [0, 1]
    for (let i = 2; i < n; i++) {
      result.push(result[i-1] + result[i-2])
    }
    return result
  }
}

/**
 * 文件处理工具
 */
export const FileUtils = {
  /**
   * 读取JSON文件
   */
  async readJsonFile(filePath: string): Promise<any> {
    const content = await fs.promises.readFile(filePath, 'utf8')
    return JSON.parse(content)
  },

  /**
   * 写入JSON文件
   */
  async writeJsonFile(filePath: string, data: any): Promise<void> {
    const content = JSON.stringify(data, null, 2)
    await fs.promises.writeFile(filePath, content)
  },

  /**
   * 获取文件统计信息
   */
  async getFileStats(filePath: string) {
    const stats = await fs.promises.stat(filePath)
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    }
  }
}

/**
 * 数据验证工具
 */
export const ValidationUtils = {
  /**
   * 验证email格式
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * 验证手机号格式（中国）
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  },

  /**
   * 验证是否为正整数
   */
  isPositiveInteger(value: any): boolean {
    return Number.isInteger(value) && value > 0
  }
}