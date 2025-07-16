import { NextRequest, NextResponse } from 'next/server'
import workerpool from 'workerpool'
import path from 'path'

let pool: workerpool.Pool | null = null

function getWorkerPool() {
  if (!pool) {
    pool = workerpool.pool(path.join(process.cwd(), 'workers', 'calculation-worker.js'), {
      minWorkers: 1,
      maxWorkers: 4,
      workerType: 'process'
    })
  }
  return pool
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'complex'
  const iterations = parseInt(searchParams.get('iterations') || '500000')
  const complexity = parseInt(searchParams.get('complexity') || '1')
  const matrixSize = parseInt(searchParams.get('size') || '50')
  const analysis = searchParams.get('analysis') || 'basic'
  const fileName = searchParams.get('fileName') || null

  try {
    const workerPool = getWorkerPool()
    let result

    if (type === 'matrix') {
      result = await workerPool.exec('heavyMatrixCalculation', [matrixSize])
    } else if (type === 'sales') {
      result = await workerPool.exec('analyzeSalesData', [{ 
        fileName: fileName || 'sales-data.parquet', 
        analysis 
      }])
    } else if (type === 'users') {
      result = await workerPool.exec('analyzeUserData', [{ 
        fileName: fileName || 'user-data.parquet', 
        segmentation: analysis 
      }])
    } else {
      result = await workerPool.exec('complexCalculation', [{ iterations, complexity }])
    }

    return NextResponse.json({
      success: true,
      type,
      data: result,
      worker: {
        poolStats: workerPool.stats(),
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Worker calculation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Calculation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type = 'complex', ...params } = body

    const workerPool = getWorkerPool()
    let result

    if (type === 'matrix') {
      result = await workerPool.exec('heavyMatrixCalculation', [params.size || 50])
    } else if (type === 'sales') {
      result = await workerPool.exec('analyzeSalesData', [params])
    } else if (type === 'users') {
      result = await workerPool.exec('analyzeUserData', [params])
    } else {
      result = await workerPool.exec('complexCalculation', [params])
    }

    return NextResponse.json({
      success: true,
      type,
      data: result,
      worker: {
        poolStats: workerPool.stats(),
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Worker calculation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Calculation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}