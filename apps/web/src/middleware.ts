import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOLDOWN_SECONDS = process.env.EVAL_COOLDOWN_SECONDS ? parseInt(process.env.EVAL_COOLDOWN_SECONDS) : 60; // default 1 minute

export async function middleware(request: NextRequest) {
  // Only apply to evaluate endpoint
  if (!request.nextUrl.pathname.startsWith('/api/evaluate')) {
    return NextResponse.next();
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] ?? realIp ?? 'unknown';
  const lastEvalKey = `last-eval-${ip}`;
  
  // Get last evaluation time from cookies
  const lastEval = request.cookies.get(lastEvalKey)?.value;
  const now = Date.now();
  
  if (lastEval) {
    const timeSinceLastEval = now - parseInt(lastEval);
    if (timeSinceLastEval < COOLDOWN_SECONDS * 1000) {
      const remainingTime = Math.ceil((COOLDOWN_SECONDS * 1000 - timeSinceLastEval) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded', remainingSeconds: remainingTime },
        { status: 429 }
      );
    }
  }
  
  // Allow the request and set the cookie
  const response = NextResponse.next();
  response.cookies.set(lastEvalKey, now.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOLDOWN_SECONDS
  });
  
  return response;
}

export const config = {
  matcher: '/api/evaluate'
} 