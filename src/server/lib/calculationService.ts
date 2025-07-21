import { 
  CalculationParams, 
  CalculationResult, 
  MatrixCalculationResult
} from '../../shared/types/api'
import { executeFunction } from './workerPool'
import { DependencyManager } from './dependencyManager'

/**
 * 计算服务 - 协调业务处理器和Worker Pool（支持依赖注入）
 * 不包含具体业务逻辑，只负责调度
 */
export class CalculationService {
  
  static async executeComplexCalculation(params: CalculationParams): Promise<CalculationResult> {
    const processorName = 'math'
    const functionName = 'complexCalculation'
    
    const functionCode = DependencyManager.getFunctionCode(processorName, functionName)
    const dependencies = DependencyManager.getDependencies(processorName, functionName)
    const isAsync = DependencyManager.isAsync(processorName, functionName)
    
    return executeFunction<CalculationResult>(functionCode, functionName, [params], dependencies, isAsync)
  }

  static async executeMatrixCalculation(size: number): Promise<MatrixCalculationResult> {
    const processorName = 'math'
    const functionName = 'matrixCalculation'
    
    const functionCode = DependencyManager.getFunctionCode(processorName, functionName)
    const dependencies = DependencyManager.getDependencies(processorName, functionName)
    const isAsync = DependencyManager.isAsync(processorName, functionName)
    
    return executeFunction<MatrixCalculationResult>(functionCode, functionName, [size], dependencies, isAsync)
  }

  static async executeCalculation(
    type: string, 
    params: CalculationParams
  ): Promise<CalculationResult | MatrixCalculationResult> {
    switch (type) {
      case 'matrix':
        return this.executeMatrixCalculation(params.size || 50);
      
      default:
        return this.executeComplexCalculation({
          iterations: params.iterations,
          complexity: params.complexity
        });
    }
  }

  // 新增：数据分析功能
  static async executeDataAnalysis(analysisType: string, params: any) {
    const processorName = 'data'
    const functionName = analysisType
    
    const functionCode = DependencyManager.getFunctionCode(processorName, functionName)
    const dependencies = DependencyManager.getDependencies(processorName, functionName)
    const isAsync = DependencyManager.isAsync(processorName, functionName)
    
    return executeFunction(functionCode, functionName, [params], dependencies, isAsync)
  }
}