const workerpool = require('workerpool');
const pl = require('nodejs-polars');
const path = require('path');

function complexCalculation(params) {
  const { iterations = 1000000, complexity = 1 } = params;
  const startTime = Date.now();
  
  let result = 0;
  let primeCount = 0;
  let fibonacciSum = 0;
  let data = [];
  
  function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }
  
  function fibonacci(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      let temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  }
  
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i) * complexity;
    
    if (i % 1000 === 0) {
      if (isPrime(i)) {
        primeCount++;
      }
      
      fibonacciSum += fibonacci(i % 20);
      
      data.push({
        iteration: i,
        value: result,
        timestamp: Date.now()
      });
    }
    
    if (i % 100000 === 0) {
      console.log(`Worker progress: ${((i / iterations) * 100).toFixed(2)}%`);
    }
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  return {
    result: Math.round(result * 100) / 100,
    statistics: {
      iterations,
      complexity,
      primeCount,
      fibonacciSum,
      duration,
      averageTimePerIteration: duration / iterations,
      dataPoints: data.length,
      memoryUsage: process.memoryUsage(),
      startTime,
      endTime
    },
    sampleData: data.slice(0, 10)
  };
}

function heavyMatrixCalculation(size = 100) {
  const startTime = Date.now();
  
  function createMatrix(rows, cols) {
    return Array(rows).fill().map(() => Array(cols).fill(0).map(() => Math.random() * 100));
  }
  
  function multiplyMatrices(a, b) {
    const result = Array(a.length).fill().map(() => Array(b[0].length).fill(0));
    
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    
    return result;
  }
  
  const matrix1 = createMatrix(size, size);
  const matrix2 = createMatrix(size, size);
  
  const result = multiplyMatrices(matrix1, matrix2);
  
  const sum = result.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0);
  const average = sum / (size * size);
  
  const endTime = Date.now();
  
  return {
    matrixSize: size,
    sum: Math.round(sum * 100) / 100,
    average: Math.round(average * 100) / 100,
    duration: endTime - startTime,
    memoryUsage: process.memoryUsage(),
    operationsCount: size * size * size
  };
}

async function analyzeSalesData(params = {}) {
  const startTime = Date.now();
  
  try {
    const { fileName = 'sales-data.parquet', analysis = 'basic' } = params;
    const filePath = path.join(process.cwd(), 'data', fileName);
    
    console.log(`Reading parquet file: ${filePath}`);
    const df = pl.readParquet(filePath);
    
    console.log('Processing data with Polars...');
    
    let results = {};
    
    if (analysis === 'advanced') {
      // 高级分析
      const totalRevenue = df.select(pl.col('revenue').sum()).toRecords()[0].revenue;
      
      const productStats = df
        .groupBy('product')
        .agg([
          pl.col('revenue').sum().alias('total_revenue'),
          pl.col('quantity').sum().alias('total_quantity'),
          pl.col('price').mean().alias('avg_price'),
          pl.col('id').count().alias('transaction_count')
        ])
        .sort('total_revenue', { descending: true })
        .toRecords();
      
      const regionStats = df
        .groupBy('region')
        .agg([
          pl.col('revenue').sum().alias('total_revenue'),
          pl.col('revenue').mean().alias('avg_revenue'),
          pl.col('id').count().alias('transaction_count')
        ])
        .sort('total_revenue', { descending: true })
        .toRecords();
      
      const monthlyTrends = df
        .withColumn(pl.col('date').str.slice(0, 7).alias('month'))
        .groupBy('month')
        .agg([
          pl.col('revenue').sum().alias('monthly_revenue'),
          pl.col('id').count().alias('monthly_transactions')
        ])
        .sort('month')
        .toRecords();
      
      const topSalesReps = df
        .groupBy('sales_rep')
        .agg([
          pl.col('revenue').sum().alias('total_revenue'),
          pl.col('id').count().alias('deals_closed'),
          pl.col('revenue').mean().alias('avg_deal_size')
        ])
        .sort('total_revenue', { descending: true })
        .limit(10)
        .toRecords();
      
      results = {
        summary: {
          totalRecords: df.height,
          totalRevenue,
          avgTransactionValue: Math.round(totalRevenue / df.height * 100) / 100,
          dateRange: {
            earliest: df.select(pl.col('date').min()).toRecords()[0].date,
            latest: df.select(pl.col('date').max()).toRecords()[0].date
          }
        },
        productAnalysis: productStats,
        regionAnalysis: regionStats,
        monthlyTrends,
        topSalesReps,
        dataQuality: {
          nullValues: df.nullCount().toRecords()[0],
          duplicates: df.height - df.unique().height
        }
      };
    } else {
      // 基础分析
      const basicStats = df.describe().toRecords();
      const sampleData = df.limit(5).toRecords();
      
      results = {
        summary: {
          shape: [df.height, df.width],
          columns: df.columns,
          dtypes: df.dtypes
        },
        statistics: basicStats,
        sampleData,
        memoryInfo: {
          estimatedSizeBytes: df.height * df.width * 8,
          rowCount: df.height,
          columnCount: df.width
        }
      };
    }
    
    const endTime = Date.now();
    
    return {
      success: true,
      analysisType: analysis,
      fileName,
      processingTime: endTime - startTime,
      results,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    const endTime = Date.now();
    return {
      success: false,
      error: error.message,
      processingTime: endTime - startTime,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }
}

async function analyzeUserData(params = {}) {
  const startTime = Date.now();
  
  try {
    const { fileName = 'user-data.parquet', segmentation = 'basic' } = params;
    const filePath = path.join(process.cwd(), 'data', fileName);
    
    console.log(`Analyzing user data: ${filePath}`);
    const df = pl.readParquet(filePath);
    
    let results = {};
    
    if (segmentation === 'advanced') {
      const subscriptionStats = df
        .groupBy('subscription_type')
        .agg([
          pl.col('user_id').count().alias('user_count'),
          pl.col('monthly_spend').mean().alias('avg_spend'),
          pl.col('monthly_spend').sum().alias('total_spend'),
          pl.col('age').mean().alias('avg_age')
        ])
        .toRecords();
      
      const countryStats = df
        .groupBy('country')
        .agg([
          pl.col('user_id').count().alias('user_count'),
          pl.col('monthly_spend').mean().alias('avg_spend')
        ])
        .sort('user_count', { descending: true })
        .toRecords();
      
      const ageGroups = df
        .withColumn(
          pl.when(pl.col('age').lt(25)).then(pl.lit('18-24'))
          .when(pl.col('age').lt(35)).then(pl.lit('25-34'))
          .when(pl.col('age').lt(45)).then(pl.lit('35-44'))
          .when(pl.col('age').lt(55)).then(pl.lit('45-54'))
          .otherwise(pl.lit('55+'))
          .alias('age_group')
        )
        .groupBy('age_group')
        .agg([
          pl.col('user_id').count().alias('user_count'),
          pl.col('monthly_spend').mean().alias('avg_spend')
        ])
        .toRecords();
      
      const spendingDistribution = df
        .select([
          pl.col('monthly_spend').quantile(0.25).alias('q25'),
          pl.col('monthly_spend').quantile(0.5).alias('median'),
          pl.col('monthly_spend').quantile(0.75).alias('q75'),
          pl.col('monthly_spend').quantile(0.9).alias('q90'),
          pl.col('monthly_spend').min().alias('min'),
          pl.col('monthly_spend').max().alias('max')
        ])
        .toRecords()[0];
      
      results = {
        summary: {
          totalUsers: df.height,
          avgAge: Math.round(df.select(pl.col('age').mean()).toRecords()[0].age * 100) / 100,
          totalMonthlyRevenue: df.select(pl.col('monthly_spend').sum()).toRecords()[0].monthly_spend
        },
        subscriptionAnalysis: subscriptionStats,
        geographicDistribution: countryStats,
        demographicAnalysis: ageGroups,
        spendingDistribution,
        cohortAnalysis: {
          signupYears: df
            .withColumn(pl.col('signup_date').str.slice(0, 4).alias('signup_year'))
            .groupBy('signup_year')
            .agg(pl.col('user_id').count().alias('signups'))
            .sort('signup_year')
            .toRecords()
        }
      };
    } else {
      const basicStats = df.describe().toRecords();
      const sampleData = df.limit(3).toRecords();
      
      results = {
        summary: {
          shape: [df.height, df.width],
          columns: df.columns
        },
        statistics: basicStats,
        sampleData
      };
    }
    
    const endTime = Date.now();
    
    return {
      success: true,
      analysisType: segmentation,
      fileName,
      processingTime: endTime - startTime,
      results,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    const endTime = Date.now();
    return {
      success: false,
      error: error.message,
      processingTime: endTime - startTime,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }
}

workerpool.worker({
  complexCalculation,
  heavyMatrixCalculation,
  analyzeSalesData,
  analyzeUserData
});