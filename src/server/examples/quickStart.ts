#!/usr/bin/env node
/**
 * 快速开始脚本 - 演示新的基于编译入口的Worker Pool
 * 
 * 使用方法:
 *   npx ts-node src/server/examples/quickStart.ts
 *   或者编译后运行
 */

import { executeFromBundle, executeFromCode } from '../lib/workerPool'
import path from 'path'

async function quickStartDemo() {
  console.log('🚀 基于编译入口的Worker Pool - 快速开始')
  console.log('=' .repeat(50))

  // 示例1: 从文件执行
  console.log('\n📁 示例1: 从文件执行业务函数')
  try {
    const result1 = await executeFromBundle(
      path.join(process.cwd(), 'src', 'server', 'processors', 'dataProcessor.ts'),
      'analyzeMathSequence',
      [8] // 生成8个斐波那契数
    )
    
    console.log('✅ 结果:', {
      序列: result1.result.fibonacciStats.sequence,
      和: result1.result.fibonacciStats.sum,
      处理时间: result1.result.processingTime + 'ms'
    })
  } catch (error) {
    console.error('❌ 错误:', error.message)
  }

  // 示例2: 从代码字符串执行
  console.log('\n💻 示例2: 从代码字符串执行')
  const inlineCode = `
    // 可以使用任何Node.js内置模块
    const crypto = require('crypto')
    const path = require('path')

    function hashGenerator(data) {
      const hash = crypto.createHash('sha256')
      hash.update(JSON.stringify(data))
      
      return {
        original: data,
        hash: hash.digest('hex'),
        algorithm: 'sha256',
        timestamp: Date.now(),
        nodeVersion: process.version
      }
    }

    function pathAnalyzer(filePaths) {
      return filePaths.map(filePath => ({
        original: filePath,
        dirname: path.dirname(filePath),
        basename: path.basename(filePath),
        extname: path.extname(filePath),
        parsed: path.parse(filePath)
      }))
    }

    module.exports = { hashGenerator, pathAnalyzer }
  `

  try {
    // 执行哈希生成器
    const hashResult = await executeFromCode(
      inlineCode,
      'hashGenerator',
      [{ message: 'Hello Worker Pool!', timestamp: Date.now() }]
    )
    
    console.log('🔐 哈希结果:', {
      原始数据: hashResult.result.original,
      哈希值: hashResult.result.hash.substring(0, 16) + '...',
      算法: hashResult.result.algorithm
    })

    // 执行路径分析器
    const pathResult = await executeFromCode(
      inlineCode,
      'pathAnalyzer',
      [['/home/user/project/src/file.ts', '/var/log/system.log']]
    )
    
    console.log('📂 路径分析结果:', pathResult.result.map(p => ({
      文件: p.basename,
      目录: p.dirname,
      扩展名: p.extname || '无'
    })))

  } catch (error) {
    console.error('❌ 错误:', error.message)
  }

  // 示例3: 高级用法 - TypeScript支持
  console.log('\n🎯 示例3: TypeScript支持演示')
  const typescriptCode = `
    interface UserData {
      id: number
      name: string  
      email: string
      age: number
    }

    interface AnalysisResult {
      totalUsers: number
      averageAge: number
      emailDomains: string[]
      ageGroups: Record<string, number>
    }

    function advancedUserAnalysis(users: UserData[]): AnalysisResult {
      const totalUsers = users.length
      const averageAge = users.reduce((sum, user) => sum + user.age, 0) / totalUsers
      
      // 提取邮箱域名
      const emailDomains = [...new Set(
        users.map(user => user.email.split('@')[1])
      )]
      
      // 年龄分组
      const ageGroups = users.reduce((groups, user) => {
        const group = user.age < 25 ? 'young' : user.age < 50 ? 'middle' : 'senior'
        groups[group] = (groups[group] || 0) + 1
        return groups
      }, {} as Record<string, number>)
      
      return {
        totalUsers,
        averageAge: Math.round(averageAge * 100) / 100,
        emailDomains,
        ageGroups
      }
    }

    module.exports = { advancedUserAnalysis }
  `

  try {
    const userData = [
      { id: 1, name: 'Alice', email: 'alice@company.com', age: 28 },
      { id: 2, name: 'Bob', email: 'bob@startup.io', age: 24 },
      { id: 3, name: 'Carol', email: 'carol@company.com', age: 35 },
      { id: 4, name: 'David', email: 'david@freelance.net', age: 42 }
    ]

    const analysisResult = await executeFromCode(
      typescriptCode,
      'advancedUserAnalysis',
      [userData]
    )
    
    console.log('📊 高级用户分析结果:', analysisResult.result)

  } catch (error) {
    console.error('❌ TypeScript执行错误:', error.message)
  }

  console.log('\n✨ 快速开始演示完成!')
  console.log('\n💡 主要优势:')
  console.log('   • 支持从文件或代码字符串执行')
  console.log('   • 自动处理依赖关系，无需手动配置')
  console.log('   • 支持TypeScript接口和类型')
  console.log('   • 支持Node.js内置模块和npm包')
  console.log('   • 编译时错误检查和优化')

  // 关闭worker pool
  const { closeWorkerPool } = await import('../lib/workerPool')
  closeWorkerPool()
  
  console.log('\n🏁 Worker Pool已关闭')
}

// 运行演示
if (require.main === module) {
  quickStartDemo().catch(error => {
    console.error('演示失败:', error)
    process.exit(1)
  })
}

export { quickStartDemo }