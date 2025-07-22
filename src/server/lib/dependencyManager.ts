/**
 * 依赖管理器 - 管理业务函数的依赖声明
 */

export interface ProcessorConfig {
  dependencies?: string[]
  isAsync?: boolean
  description?: string
}

export interface ProcessorFunction {
  fn: Function
  config?: ProcessorConfig
}

/**
 * 依赖管理器类
 */
export class DependencyManager {
  private static processors = new Map<string, Map<string, ProcessorFunction>>()

  /**
   * 注册处理器
   */
  static register(processorName: string, functions: Record<string, Function | ProcessorFunction>) {
    if (!this.processors.has(processorName)) {
      this.processors.set(processorName, new Map())
    }

    const processorMap = this.processors.get(processorName)!

    for (const [name, fn] of Object.entries(functions)) {
      if (typeof fn === 'function') {
        processorMap.set(name, { fn, config: {} })
      } else {
        processorMap.set(name, fn)
      }
    }
  }

  /**
   * 获取函数代码
   */
  static getFunctionCode(processorName: string, functionName: string): string {
    const processor = this.processors.get(processorName)
    if (!processor) {
      throw new Error(`Processor ${processorName} not found`)
    }

    const fnData = processor.get(functionName)
    if (!fnData) {
      throw new Error(`Function ${functionName} not found in processor ${processorName}`)
    }

    return fnData.fn.toString()
  }

  /**
   * 获取函数依赖
   */
  static getDependencies(processorName: string, functionName: string): string[] {
    const processor = this.processors.get(processorName)
    if (!processor) return []

    const fnData = processor.get(functionName)
    return fnData?.config?.dependencies || []
  }

  /**
   * 检查函数是否为异步
   */
  static isAsync(processorName: string, functionName: string): boolean {
    const processor = this.processors.get(processorName)
    if (!processor) return true

    const fnData = processor.get(functionName)
    return fnData?.config?.isAsync !== false
  }
}

// 示例处理器注册
DependencyManager.register('math', {
  complexCalculation: {
    fn: function(params: { iterations?: number; complexity?: number }) {
      const { iterations = 1000000, complexity = 1 } = params;
      const startTime = Date.now();
      
      let result = 0;
      for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i) * Math.sin(i) * complexity;
      }
      
      return {
        result: Math.round(result * 100) / 100,
        duration: Date.now() - startTime,
        iterations,
        complexity
      };
    },
    config: {
      dependencies: [],
      isAsync: false,
      description: '复杂数学计算'
    }
  },

  matrixCalculation: {
    fn: function(size: number = 100) {
      const startTime = Date.now();
      
      const matrix1 = Array(size).fill(null).map(() => 
        Array(size).fill(null).map(() => Math.random() * 100)
      );
      const matrix2 = Array(size).fill(null).map(() => 
        Array(size).fill(null).map(() => Math.random() * 100)
      );
      
      const result = Array(size).fill(null).map(() => Array(size).fill(0));
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          for (let k = 0; k < size; k++) {
            result[i][j] += matrix1[i][k] * matrix2[k][j];
          }
        }
      }
      
      const sum = result.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0);
      
      return {
        matrixSize: size,
        sum: Math.round(sum * 100) / 100,
        average: Math.round(sum / (size * size) * 100) / 100,
        duration: Date.now() - startTime
      };
    },
    config: {
      dependencies: [],
      isAsync: false,
      description: '矩阵乘法计算'
    }
  }
})

// 数据分析处理器示例（需要依赖）
DependencyManager.register('data', {
  polarsAnalysis: {
    fn: async function(pl: any, path: any, params: any) {
      const { fileName = 'sales-data.parquet' } = params;
      const filePath = path.join(process.cwd(), 'src', 'data', fileName);
      
      const df = pl.readParquet(filePath);
      const stats = df.describe().toRecords();
      
      // 转换为二进制Buffer传输
      const serializedStats = Buffer.from(JSON.stringify(stats));
      
      return {
        fileName,
        rowCount: df.height,
        columnCount: df.width,
        statistics: serializedStats,
        processingTime: Date.now(),
        isBinary: true
      };
    },
    config: {
      dependencies: ['nodejs-polars', 'path'],
      isAsync: true,
      description: 'Polars数据分析'
    }
  },

  csvProcessor: {
    fn: async function(fs: any, path: any, params: any) {
      const { filePath } = params;
      const data = await fs.promises.readFile(filePath, 'utf8');
      const lines = data.split('\n').filter(line => line.trim());
      
      return {
        totalLines: lines.length,
        sampleData: lines.slice(0, 5),
        fileSize: Buffer.byteLength(data, 'utf8')
      };
    },
    config: {
      dependencies: ['fs', 'path'],
      isAsync: true,
      description: 'CSV文件处理'
    }
  }
})