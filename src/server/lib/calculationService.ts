import { 
  CalculationParams, 
  DataAnalysisParams, 
  CalculationResult, 
  MatrixCalculationResult,
  DataAnalysisResult 
} from '../../shared/types/api'
import { executeInWorker } from './workerPool'

export class CalculationService {
  static async executeComplexCalculation(params: CalculationParams): Promise<CalculationResult> {
    return executeInWorker<CalculationResult>('complexCalculation', [params])
  }

  static async executeMatrixCalculation(size: number): Promise<MatrixCalculationResult> {
    return executeInWorker<MatrixCalculationResult>('heavyMatrixCalculation', [size])
  }

  static async executeSalesAnalysis(params: DataAnalysisParams): Promise<DataAnalysisResult> {
    return executeInWorker<DataAnalysisResult>('analyzeSalesData', [params])
  }

  static async executeUserAnalysis(params: DataAnalysisParams): Promise<DataAnalysisResult> {
    return executeInWorker<DataAnalysisResult>('analyzeUserData', [params])
  }

  static async executeCalculation(
    type: string, 
    params: CalculationParams & DataAnalysisParams
  ): Promise<CalculationResult | MatrixCalculationResult | DataAnalysisResult> {
    switch (type) {
      case 'matrix':
        return this.executeMatrixCalculation(params.size || 50)
      
      case 'sales':
        return this.executeSalesAnalysis({
          fileName: params.fileName || 'sales-data.parquet',
          analysis: params.analysis
        })
      
      case 'users':
        return this.executeUserAnalysis({
          fileName: params.fileName || 'user-data.parquet',
          segmentation: params.segmentation || params.analysis
        })
      
      default:
        return this.executeComplexCalculation({
          iterations: params.iterations,
          complexity: params.complexity
        })
    }
  }
}