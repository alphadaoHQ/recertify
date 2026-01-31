import { NextRequest, NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';
import { cache } from '@/lib/cache';

/**
 * GET /api/metrics - Prometheus-compatible metrics endpoint
 * Provides application metrics for monitoring and alerting
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Check if request is from authorized monitoring service
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.METRICS_AUTH_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const format = req.nextUrl.searchParams.get('format') || 'prometheus';
    
    if (format === 'json') {
      return NextResponse.json(await getJSONMetrics());
    } else {
      const prometheusMetrics = await getPrometheusMetrics();
      return new NextResponse(prometheusMetrics, {
        headers: {
          'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
  } catch (error) {
    console.error('Metrics endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    );
  }
}

async function getJSONMetrics() {
  const performance = monitoring.getPerformanceMetrics();
  const cacheStats = cache.getStats();
  const uptime = monitoring.getUptime();
  
  // Get AI service metrics
  const aiMetrics = {
    feedback_requests: monitoring.getMetricSum('ai_operation_count', { service: 'feedback' }),
    adaptive_requests: monitoring.getMetricSum('ai_operation_count', { service: 'adaptive' }),
    fraud_checks: monitoring.getMetricSum('ai_operation_count', { service: 'fraud' }),
    avg_feedback_time: monitoring.getMetricAverage('ai_operation_duration', { service: 'feedback' }),
    avg_adaptive_time: monitoring.getMetricAverage('ai_operation_duration', { service: 'adaptive' }),
    avg_fraud_time: monitoring.getMetricAverage('ai_operation_duration', { service: 'fraud' }),
  };

  // Get API endpoint metrics
  const apiMetrics = {
    total_requests: performance.requestCount,
    total_errors: performance.errorCount,
    error_rate: performance.requestCount > 0 ? (performance.errorCount / performance.requestCount) * 100 : 0,
    avg_response_time: performance.responseTime,
  };

  // System metrics
  const systemMetrics = {
    memory_usage_mb: performance.memoryUsage,
    cpu_usage_percent: performance.cpuUsage,
    uptime_seconds: Math.floor(uptime / 1000),
  };

  // Cache metrics
  const cacheMetrics = {
    hit_rate_percent: performance.cacheHitRate,
    total_hits: cacheStats.hits,
    total_misses: cacheStats.misses,
    total_sets: cacheStats.sets,
    total_deletes: cacheStats.deletes,
    total_errors: cacheStats.errors,
  };

  return {
    timestamp: new Date().toISOString(),
    application: 'recertify-mini',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    metrics: {
      system: systemMetrics,
      api: apiMetrics,
      cache: cacheMetrics,
      ai: aiMetrics,
    },
  };
}

async function getPrometheusMetrics(): Promise<string> {
  const performance = monitoring.getPerformanceMetrics();
  const cacheStats = cache.getStats();
  const uptime = monitoring.getUptime();
  
  const metrics: string[] = [];
  
  // Add metric header
  metrics.push('# HELP recertify_info Application information');
  metrics.push('# TYPE recertify_info gauge');
  metrics.push(`recertify_info{version="${process.env.npm_package_version || '1.0.0'}",environment="${process.env.NODE_ENV || 'development'}"} 1`);
  
  // System metrics
  metrics.push('# HELP recertify_uptime_seconds Application uptime in seconds');
  metrics.push('# TYPE recertify_uptime_seconds counter');
  metrics.push(`recertify_uptime_seconds ${Math.floor(uptime / 1000)}`);
  
  metrics.push('# HELP recertify_memory_usage_bytes Memory usage in bytes');
  metrics.push('# TYPE recertify_memory_usage_bytes gauge');
  metrics.push(`recertify_memory_usage_bytes ${performance.memoryUsage * 1024 * 1024}`);
  
  // API metrics
  metrics.push('# HELP recertify_http_requests_total Total number of HTTP requests');
  metrics.push('# TYPE recertify_http_requests_total counter');
  metrics.push(`recertify_http_requests_total ${performance.requestCount}`);
  
  metrics.push('# HELP recertify_http_errors_total Total number of HTTP errors');
  metrics.push('# TYPE recertify_http_errors_total counter');
  metrics.push(`recertify_http_errors_total ${performance.errorCount}`);
  
  metrics.push('# HELP recertify_http_response_time_seconds Average HTTP response time in seconds');
  metrics.push('# TYPE recertify_http_response_time_seconds gauge');
  metrics.push(`recertify_http_response_time_seconds ${performance.responseTime / 1000}`);
  
  // Cache metrics
  metrics.push('# HELP recertify_cache_hit_rate_percent Cache hit rate percentage');
  metrics.push('# TYPE recertify_cache_hit_rate_percent gauge');
  metrics.push(`recertify_cache_hit_rate_percent ${performance.cacheHitRate}`);
  
  metrics.push('# HELP recertify_cache_operations_total Total cache operations');
  metrics.push('# TYPE recertify_cache_operations_total counter');
  metrics.push(`recertify_cache_operations_total{operation="hit"} ${cacheStats.hits}`);
  metrics.push(`recertify_cache_operations_total{operation="miss"} ${cacheStats.misses}`);
  metrics.push(`recertify_cache_operations_total{operation="set"} ${cacheStats.sets}`);
  metrics.push(`recertify_cache_operations_total{operation="delete"} ${cacheStats.deletes}`);
  
  // AI service metrics
  const aiFeedbackRequests = monitoring.getMetricSum('ai_operation_count', { service: 'feedback' });
  const aiAdaptiveRequests = monitoring.getMetricSum('ai_operation_count', { service: 'adaptive' });
  const aiFraudChecks = monitoring.getMetricSum('ai_operation_count', { service: 'fraud' });
  
  metrics.push('# HELP recertify_ai_requests_total Total AI service requests');
  metrics.push('# TYPE recertify_ai_requests_total counter');
  metrics.push(`recertify_ai_requests_total{service="feedback"} ${aiFeedbackRequests}`);
  metrics.push(`recertify_ai_requests_total{service="adaptive"} ${aiAdaptiveRequests}`);
  metrics.push(`recertify_ai_requests_total{service="fraud"} ${aiFraudChecks}`);
  
  const avgFeedbackTime = monitoring.getMetricAverage('ai_operation_duration', { service: 'feedback' });
  const avgAdaptiveTime = monitoring.getMetricAverage('ai_operation_duration', { service: 'adaptive' });
  const avgFraudTime = monitoring.getMetricAverage('ai_operation_duration', { service: 'fraud' });
  
  metrics.push('# HELP recertify_ai_response_time_seconds Average AI service response time in seconds');
  metrics.push('# TYPE recertify_ai_response_time_seconds gauge');
  metrics.push(`recertify_ai_response_time_seconds{service="feedback"} ${avgFeedbackTime / 1000}`);
  metrics.push(`recertify_ai_response_time_seconds{service="adaptive"} ${avgAdaptiveTime / 1000}`);
  metrics.push(`recertify_ai_response_time_seconds{service="fraud"} ${avgFraudTime / 1000}`);
  
  // Business metrics
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  const quizSubmissions = monitoring.getMetricSum('api_request_rate', { endpoint: '/api/quizzes/submit' }, oneHourAgo);
  const userRegistrations = monitoring.getMetricSum('api_request_rate', { endpoint: '/api/user/profile' }, oneHourAgo);
  
  metrics.push('# HELP recertify_quiz_submissions_total Total quiz submissions');
  metrics.push('# TYPE recertify_quiz_submissions_total counter');
  metrics.push(`recertify_quiz_submissions_total ${quizSubmissions}`);
  
  metrics.push('# HELP recertify_user_registrations_total Total user registrations');
  metrics.push('# TYPE recertify_user_registrations_total counter');
  metrics.push(`recertify_user_registrations_total ${userRegistrations}`);
  
  // Fraud detection metrics
  const fraudBlocked = monitoring.getMetricSum('ai_operation_count', { service: 'fraud', success: 'false' });
  const fraudPassed = monitoring.getMetricSum('ai_operation_count', { service: 'fraud', success: 'true' });
  
  metrics.push('# HELP recertify_fraud_checks_total Total fraud checks performed');
  metrics.push('# TYPE recertify_fraud_checks_total counter');
  metrics.push(`recertify_fraud_checks_total{result="blocked"} ${fraudBlocked}`);
  metrics.push(`recertify_fraud_checks_total{result="passed"} ${fraudPassed}`);
  
  return metrics.join('\n') + '\n';
}

/**
 * POST /api/metrics - Custom metric ingestion endpoint
 * Allows applications to send custom metrics
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, value, unit, tags } = await req.json();
    
    if (!name || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, value' },
        { status: 400 }
      );
    }
    
    monitoring.recordMetric(name, value, unit || 'count', tags);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Custom metric ingestion error:', error);
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    );
  }
}