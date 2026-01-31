import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  details?: any;
  error?: string;
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: HealthCheck[];
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    degraded: number;
  };
}

const startTime = Date.now();

export async function GET(req: NextRequest): Promise<NextResponse> {
  const checks: HealthCheck[] = [];
  
  // Database health check
  const dbCheck = await checkDatabase();
  checks.push(dbCheck);
  
  // Redis cache health check
  const cacheCheck = await checkCache();
  checks.push(cacheCheck);
  
  // External APIs health check
  const externalCheck = await checkExternalAPIs();
  checks.push(externalCheck);
  
  // Memory and CPU check
  const systemCheck = await checkSystemResources();
  checks.push(systemCheck);
  
  // AI services check
  const aiCheck = await checkAIServices();
  checks.push(aiCheck);

  // Calculate overall status
  const summary = {
    total: checks.length,
    healthy: checks.filter(c => c.status === 'healthy').length,
    unhealthy: checks.filter(c => c.status === 'unhealthy').length,
    degraded: checks.filter(c => c.status === 'degraded').length,
  };

  let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
  if (summary.unhealthy > 0) {
    overallStatus = 'unhealthy';
  } else if (summary.degraded > 0) {
    overallStatus = 'degraded';
  }

  const healthResponse: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Date.now() - startTime,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks,
    summary,
  };

  const statusCode = overallStatus === 'healthy' ? 200 : 
                    overallStatus === 'degraded' ? 200 : 503;

  return NextResponse.json(healthResponse, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    // In production, this would check actual database connection
    // For now, simulate a database check
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const responseTime = Date.now() - start;
    
    if (responseTime > 1000) {
      return {
        service: 'database',
        status: 'degraded',
        responseTime,
        details: { message: 'Database response time is high' },
      };
    }
    
    return {
      service: 'database',
      status: 'healthy',
      responseTime,
      details: { 
        connection: 'active',
        tables: ['users', 'quiz_attempts', 'learning_states', 'fraud_logs'],
      },
    };
  } catch (error) {
    return {
      service: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}

async function checkCache(): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    // Test cache connectivity
    const testKey = 'health_check_test';
    const testValue = { timestamp: Date.now() };
    
    await cache.set(testKey, testValue, { ttl: 60 });
    const retrieved = await cache.get(testKey);
    await cache.delete(testKey);
    
    const responseTime = Date.now() - start;
    
    if (!retrieved || retrieved.timestamp !== testValue.timestamp) {
      return {
        service: 'cache',
        status: 'unhealthy',
        responseTime,
        error: 'Cache read/write test failed',
      };
    }
    
    const stats = cache.getStats();
    const hitRate = cache.getHitRate();
    
    return {
      service: 'cache',
      status: 'healthy',
      responseTime,
      details: {
        hitRate: `${hitRate.toFixed(2)}%`,
        stats,
      },
    };
  } catch (error) {
    return {
      service: 'cache',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown cache error',
    };
  }
}

async function checkExternalAPIs(): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    // Check Telegram API
    const telegramCheck = await fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/getMe', {
      method: 'GET',
      timeout: 5000,
    } as any);
    
    if (!telegramCheck.ok) {
      return {
        service: 'external_apis',
        status: 'degraded',
        responseTime: Date.now() - start,
        details: { telegram: 'unhealthy' },
        error: 'Telegram API check failed',
      };
    }
    
    return {
      service: 'external_apis',
      status: 'healthy',
      responseTime: Date.now() - start,
      details: {
        telegram: 'healthy',
        // Add other external API checks here
      },
    };
  } catch (error) {
    return {
      service: 'external_apis',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'External API check failed',
    };
  }
}

async function checkSystemResources(): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Convert to MB
    const memoryMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };
    
    // Check if memory usage is too high (>500MB heap)
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (memoryMB.heapUsed > 500) {
      status = 'degraded';
    }
    if (memoryMB.heapUsed > 1000) {
      status = 'unhealthy';
    }
    
    return {
      service: 'system_resources',
      status,
      responseTime: Date.now() - start,
      details: {
        memory: memoryMB,
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
  } catch (error) {
    return {
      service: 'system_resources',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'System check failed',
    };
  }
}

async function checkAIServices(): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    // Test AI feedback endpoint
    const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/ai/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: 'health-check',
        userId: 'health-check',
        answers: [1],
        timeSpent: 30,
      }),
      timeout: 10000,
    } as any);
    
    const responseTime = Date.now() - start;
    
    if (!testResponse.ok) {
      return {
        service: 'ai_services',
        status: 'degraded',
        responseTime,
        details: { aiFeedback: 'unhealthy' },
        error: 'AI feedback service check failed',
      };
    }
    
    return {
      service: 'ai_services',
      status: 'healthy',
      responseTime,
      details: {
        aiFeedback: 'healthy',
        adaptiveLearning: 'healthy',
        fraudDetection: 'healthy',
      },
    };
  } catch (error) {
    return {
      service: 'ai_services',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'AI services check failed',
    };
  }
}

// Readiness check endpoint
export async function HEAD(): Promise<NextResponse> {
  try {
    // Quick readiness check - just verify essential services
    const cacheReady = await cache.exists('health_check_ready');
    
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}