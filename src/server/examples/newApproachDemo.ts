/**
 * 新方案使用示例 - 基于编译入口的Worker Pool
 */
import { executeFromBundle } from '../lib/workerPool'
import path from 'path'

export async function testNewApproach() {
  console.log('🚀 测试新的基于编译入口的Worker Pool方案')
  console.log('=' .repeat(60))

  try {
    // 测试1: 复合数据处理（跨模块依赖）
    console.log('\n📊 测试1: 复合数据处理（使用跨模块依赖）')
    const complexResult = await executeFromBundle(
      path.join(process.cwd(), 'src', 'server', 'processors', 'dataProcessor.ts'),
      'complexDataProcessing',
      [{
        numbers: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30],
        emails: [
          'valid@example.com',
          'invalid-email',
          'another@test.org', 
          'not-email',
          'user@company.co.uk'
        ],
        fibonacciLength: 10
      }],
      { 
        format: 'cjs',
        external: ['fs', 'path'] // Node.js内置模块不需要打包
      }
    )
    
    console.log('✅ 复合数据处理结果:')
    console.log(`   - 数字平均值: ${complexResult.result.mathAnalysis.average.toFixed(2)}`)
    console.log(`   - 有效邮箱: ${complexResult.result.emailValidation.valid}/${complexResult.result.emailValidation.total}`)
    console.log(`   - 斐波那契和: ${complexResult.result.fibonacciAnalysis.sum}`)
    console.log(`   - 处理时间: ${complexResult.result.totalProcessingTime}ms`)

    // 测试2: 用户数据分析
    console.log('\n👥 测试2: 用户数据分析')
    const userData = [
      { email: 'user1@example.com', age: 25, name: 'Alice' },
      { email: 'user2@example.com', age: 30, name: 'Bob' },
      { email: 'invalid-email', age: 35, name: 'Charlie' },
      { email: 'user4@test.org', age: 22, name: 'Diana' },
      { email: 'user5@company.com', age: -5, name: 'Eve' }, // 无效年龄
      { email: 'user6@domain.net', age: 45, name: 'Frank' }
    ]

    const userAnalysisResult = await executeFromBundle(
      path.join(process.cwd(), 'src', 'server', 'processors', 'dataProcessor.ts'),
      'analyzeUserData',
      [userData]
    )

    console.log('✅ 用户数据分析结果:')
    console.log(`   - 总用户数: ${userAnalysisResult.result.totalUsers}`)
    console.log(`   - 有效用户数: ${userAnalysisResult.result.validUsers}`)
    console.log(`   - 平均年龄: ${userAnalysisResult.result.ageStatistics.average.toFixed(1)}岁`)
    console.log(`   - 年龄分布: 年轻人${userAnalysisResult.result.ageDistribution.young}人, 成年人${userAnalysisResult.result.ageDistribution.adult}人`)

    // 测试3: 数学序列分析
    console.log('\n🔢 测试3: 斐波那契序列分析')
    const mathResult = await executeFromBundle(
      path.join(process.cwd(), 'src', 'server', 'processors', 'dataProcessor.ts'),
      'analyzeMathSequence',
      [15]
    )

    console.log('✅ 数学序列分析结果:')
    console.log(`   - 序列长度: ${mathResult.result.fibonacciStats.length}`)
    console.log(`   - 序列和: ${mathResult.result.fibonacciStats.sum}`)
    console.log(`   - 最后一个值: ${mathResult.result.fibonacciStats.lastValue}`)
    console.log(`   - 标准差: ${mathResult.result.fibonacciStats.standardDeviation.toFixed(2)}`)

    console.log('\n🎉 所有测试完成！新方案的优势:')
    console.log('   ✅ 自动处理跨模块依赖，无需手动配置')
    console.log('   ✅ 支持TypeScript和现代ES模块语法')
    console.log('   ✅ 编译时错误检查，运行时更稳定')
    console.log('   ✅ 更接近正常的开发体验')

  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
  }
}

// 如果直接运行此文件
if (require.main === module) {
  testNewApproach()
}