import { evaluate } from '@evalkit/core';
import { NextResponse } from 'next/server';
import { examples } from '@/lib/examples';

export async function POST(request: Request) {
  try {
    const { exampleId } = await request.json();
    const example = examples.find(e => e.id === exampleId);
    
    if (!example) {
      return NextResponse.json({ error: 'Invalid example ID' }, { status: 400 });
    }

    // @ts-expect-error - We know this is safe because we've matched the params with the metrics
    const result = await evaluate(example.params, example.metrics);
    return NextResponse.json({ ...result, code: example.code });
  } catch (error) {
    console.error('Evaluation failed:', error);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
} 