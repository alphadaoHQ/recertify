import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting configurations
const rateLimits = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
  }),
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 auth attempts per minute
    analytics: true,
  }),
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 AI requests per minute
    analytics: true,
  }),
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const ip = request.ip ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? '';
  const origin = request.headers.get('origin');

  // Security Headers
  const securityHeaders = {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://telegram.org https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.telegram.org https://*.amazonaws.com wss:",
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; '),
    
    // HSTS (HTTP Strict Transport Security)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Permissions Policy
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', '),
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // CORS handling for API routes
  if (pathname.startsWith('/api/')) {
    const allowedOrigins = [
      'https://recertify-mini.vercel.app',
      'https://t.me',
      'https://web.telegram.org',
      ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
    ];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Telegram-Init-Data, X-Telegram-Hash, X-User-ID'
      );
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }
  }

  // Bot detection and blocking
  const suspiciousBots = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests'
  ];
  
  const isSuspiciousBot = suspiciousBots.some(bot => 
    userAgent.toLowerCase().includes(bot)
  ) && !userAgent.includes('TelegramBot');

  if (isSuspiciousBot && !pathname.startsWith('/api/health')) {
    return new Response('Access Denied', { status: 403 });
  }

  // Rate limiting based on route type
  let rateLimit;
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/telegram')) {
    rateLimit = rateLimits.auth;
  } else if (pathname.startsWith('/api/ai') || pathname.startsWith('/api/fraud')) {
    rateLimit = rateLimits.ai;
  } else if (pathname.startsWith('/api/')) {
    rateLimit = rateLimits.api;
  }

  if (rateLimit) {
    const { success, limit, reset, remaining } = await rateLimit.limit(ip);
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

    if (!success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: Math.round((reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.round((reset - Date.now()) / 1000).toString(),
            ...Object.fromEntries(response.headers.entries()),
          },
        }
      );
    }
  }

  // Telegram WebApp validation for API routes
  if (pathname.startsWith('/api/') && !pathname.includes('/health') && !pathname.includes('/telegram/webhook')) {
    const telegramInitData = request.headers.get('x-telegram-init-data');
    const telegramHash = request.headers.get('x-telegram-hash');
    
    // Skip validation for public endpoints
    const publicEndpoints = ['/api/quizzes', '/api/leaderboard'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      pathname.startsWith(endpoint) && request.method === 'GET'
    );

    if (!isPublicEndpoint && (!telegramInitData || !telegramHash)) {
      return new Response(
        JSON.stringify({ error: 'Telegram authentication required' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate Telegram signature (in production)
    if (!isPublicEndpoint && process.env.NODE_ENV === 'production') {
      try {
        const isValid = await validateTelegramSignature(telegramInitData!, telegramHash!);
        if (!isValid) {
          return new Response(
            JSON.stringify({ error: 'Invalid Telegram authentication' }),
            { 
              status: 401, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        }
      } catch (error) {
        console.error('Telegram validation error:', error);
        return new Response(
          JSON.stringify({ error: 'Authentication validation failed' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
    }
  }

  // Geo-blocking (if needed)
  const blockedCountries = process.env.BLOCKED_COUNTRIES?.split(',') || [];
  const country = request.geo?.country;
  
  if (country && blockedCountries.includes(country)) {
    return new Response('Service not available in your region', { status: 451 });
  }

  // Add security context headers
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Timestamp', new Date().toISOString());
  
  if (country) {
    response.headers.set('X-User-Country', country);
  }

  // Cache control for static assets
  if (pathname.startsWith('/_next/static/') || pathname.includes('.')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  return response;
}

async function validateTelegramSignature(initData: string, hash: string): Promise<boolean> {
  try {
    const crypto = await import('crypto');
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate expected hash
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(initData)
      .digest('hex');

    // Compare hashes
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  } catch (error) {
    console.error('Telegram signature validation error:', error);
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};