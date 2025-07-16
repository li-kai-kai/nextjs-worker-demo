import { NextRequest } from 'next/server'
import { CalculationService } from '../../../server/lib/calculationService'
import { createSuccessResponse, handleApiError } from '../../../server/utils/apiHelpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = {
      type: searchParams.get('type') || 'complex',
      iterations: parseInt(searchParams.get('iterations') || '500000'),
      complexity: parseInt(searchParams.get('complexity') || '1'),
      size: parseInt(searchParams.get('size') || '50'),
      analysis: searchParams.get('analysis') as 'basic' | 'advanced' || 'basic',
      fileName: searchParams.get('fileName') || undefined
    }

    const result = await CalculationService.executeCalculation(params.type, params)
    
    return createSuccessResponse(result, params.type)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type = 'complex', ...params } = body

    const result = await CalculationService.executeCalculation(type, params)
    
    return createSuccessResponse(result, type)
  } catch (error) {
    return handleApiError(error)
  }
}