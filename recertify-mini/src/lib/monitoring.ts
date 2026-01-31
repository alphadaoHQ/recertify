import { NextRequest } from 'next/server';

interface MetricData {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  requestCount: number;
  errorCount: number;
  cacheHitRate: number;
}

class MonitoringService {
  private metrics: Map<string, MetricData[]> = new Map();
  private requestCounts: Map<string, number> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private startTime = Date.now();

  // Record a custom metric
  recordMetric(name: string, value: number, unit: string, tags?: Record<string, string>) {
    const metric: MetricData = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricArray = this.metrics.get(name)!;
    metricArray.push(metric);

    // Keep only last 1000 metrics per type
    if (metricArray.length > 1000) {
      metricArray.shift();
    }

    // Send to external monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(metric);
    }
  }

  // Record API request
  recordRequest(endpoint: string, method: string, statusCode: number, responseTime: number) {
    const key = `${method}:${endpoint}`;
    
    // Increment request count
    this.requestCounts.set(key, (this.requestCounts.get(key) || 0) + 1);
    
    // Record error if status code indicates error
    if (statusCode >= 400) {
      this.errorCounts.set(key, (this.errorCounts.get(key) || 0) + 1);
    }

    // Record response time
    this.recordMetric('api_response_time', responseTime, 'ms', {
      endpoint,
      method,
      status: statusCode.toString(),
    });

    // Record request rate
    this.recordMetric('api_request_rate', 1, 'count', {
      endpoint,
      method,
    });
  }

  // Record database query performance
  recordDatabaseQuery(query: string, duration: number, success: boolean) {
    this.recordMetric('db_query_duration', duration, 'ms', {
      query_type: this.getQueryType(query),
      success: success.toString(),
    });
  }

  // Record cache operations
  recordCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, duration?: number) {
    this.recordMetric('cache_operation', 1, 'count', {
      operation,
      key_type: this.getCacheKeyType(key),
    });

    if (duration !== undefined) {
      this.recordMetric('cache_operation_duration', duration, 'ms', {
        operation,
      });
    }
  }

  // Record AI service performance
  recordAIOperation(service: 'feedback' | 'adaptive' | 'fraud', duration: number, success: boolean) {
    this.recordMetric('ai_operation_duration', duration, 'ms', {
      service,
      success: success.toString(),
    });

    this.recordMetric('ai_operation_count', 1, 'count', {
      service,
      success: success.toString(),
    });
  }

  // Get performance summary
  getPerformanceMetrics(): PerformanceMetrics {
    const now = Date.now();
    const timeWindow = 5 * 60 * 1000; // 5 minutes
    const cutoff = now - timeWindow;

    // Calculate average response time
    const responseTimeMetrics = this.metrics.get('api_response_time') || [];
    const recentResponseTimes = responseTimeMetrics
      .filter(m => m.timestamp > cutoff)
      .map(m => m.value);
    
    const avgResponseTime = recentResponseTimes.length > 0 
      ? recentResponseTimes.reduce((a, b) => a + b, 0) / recentResponseTimes.length 
      : 0;

    // Calculate request and error counts
    const totalRequests = Array.from(this.requestCounts.values()).reduce((a, b) => a + b, 0);
    const totalErrors = Array.from(this.errorCounts.values()).reduce((a, b) => a + b, 0);

    // Get system metrics
    const memoryUsage = process.memoryUsage();
    const memoryMB = memoryUsage.heapUsed / 1024 / 1024;

    // Calculate cache hit rate
    const cacheHits = this.getMetricSum('cache_operation', { operation: 'hit' }, cutoff);
    const cacheMisses = this.getMetricSum('cache_operation', { operation: 'miss' }, cutoff);
    const cacheHitRate = (cacheHits + cacheMisses) > 0 ? (cacheHits / (cacheHits + cacheMisses)) * 100 : 0;

    return {
      responseTime: Math.round(avgResponseTime),
      memoryUsage: Math.round(memoryMB),
      cpuUsage: 0, // Would need additional monitoring for accurate CPU usage
      requestCount: totalRequests,
      errorCount: totalErrors,
      cacheHitRate: Math.round(cacheHitRate),
    };
  }

  // Get metrics for a specific time range
  getMetrics(name: string, startTime?: number, endTime?: number): MetricData[] {
    const metrics = this.metrics.get(name) || [];
    
    if (!startTime && !endTime) {
      return metrics;
    }

    return metrics.filter(metric => {
      if (startTime && metric.timestamp < startTime) return false;
      if (endTime && metric.timestamp > endTime) return false;
      return true;
    });
  }

  // Get aggregated metric value
  getMetricSum(name: string, tags?: Record<string, string>, since?: number): number {
    const metrics = this.getMetrics(name, since);
    
    const filteredMetrics = tags 
      ? metrics.filter(metric => this.matchesTags(metric.tags, tags))
      : metrics;

    return filteredMetrics.reduce((sum, metric) => sum + metric.value, 0);
  }

  getMetricAverage(name: string, tags?: Record<string, string>, since?: number): number {
    const metrics = this.getMetrics(name, since);
    
    const filteredMetrics = tags 
      ? metrics.filter(metric => this.matchesTags(metric.tags, tags))
      : metrics;

    if (filteredMetrics.length === 0) return 0;
    
    const sum = filteredMetrics.reduce((sum, metric) => sum + metric.value, 0);
    return sum / filteredMetrics.length;
  }

  // Get error rate for an endpoint
  getErrorRate(endpoint: string, method: string): number {
    const key = `${method}:${endpoint}`;
    const requests = this.requestCounts.get(key) || 0;
    const errors = this.errorCounts.get(key) || 0;
    
    return requests > 0 ? (errors / requests) * 100 : 0;
  }

  // Get uptime
  getUptime(): number {
    return Date.now() - this.startTime;
  }

  // Clear old metrics
  cleanup() {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    
    for (const [name, metrics] of this.metrics.entries()) {
      const filtered = metrics.filter(metric => metric.timestamp > cutoff);
      this.metrics.set(name, filtered);
    }
  }

  // Export metrics for external monitoring
  exportMetrics(): any {
    const metrics: any = {};
    
    for (const [name, metricArray] of this.metrics.entries()) {
      metrics[name] = metricArray.map(metric => ({
        value: metric.value,
        timestamp: metric.timestamp,
        tags: metric.tags,
      }));
    }

    return {
      metrics,
      requestCounts: Object.fromEntries(this.requestCounts),
      errorCounts: Object.fromEntries(this.errorCounts),
      uptime: this.getUptime(),
      performance: this.getPerformanceMetrics(),
    };
  }

  private matchesTags(metricTags?: Record<string, string>, filterTags?: Record<string, string>): boolean {
    if (!filterTags) return true;
    if (!metricTags) return false;

    return Object.entries(filterTags).every(([key, value]) => metricTags[key] === value);
  }

  private getQueryType(query: string): string {
    const lowerQuery = query.toLowerCase().trim();
    if (lowerQuery.startsWith('select')) return 'select';
    if (lowerQuery.startsWith('insert')) return 'insert';
    if (lowerQuery.startsWith('update')) return 'update';
    if (lowerQuery.startsWith('delete')) return 'delete';
    return 'other';
  }

  private getCacheKeyType(key: string): string {
    if (key.startsWith('quiz:')) return 'quiz';
    if (key.startsWith('user:')) return 'user';
    if (key.startsWith('leaderboard:')) return 'leaderboard';
    if (key.startsWith('ai:')) return 'ai';
    return 'other';
  }

  private async sendToExternalService(metric: MetricData) {
    try {
      // Send to CloudWatch, New Relic, DataDog, etc.
      if (process.env.CLOUDWATCH_ENABLED === 'true') {
        await this.sendToCloudWatch(metric);
      }
      
      if (process.env.NEW_RELIC_LICENSE_KEY) {
        await this.sendToNewRelic(metric);
      }
    } catch (error) {
      console.error('Failed to send metric to external service:', error);
    }
  }

  private async sendToCloudWatch(metric: MetricData) {
    // Implementation for CloudWatch
    // This would use AWS SDK to send custom metrics
  }

  private async sendToNewRelic(metric: MetricData) {
    // Implementation for New Relic
    // This would use New Relic API to send custom metrics
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

// Middleware wrapper for automatic request monitoring
export function withMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    name: string;
    tags?: Record<string, string>;
  }
): T {
  return (async (...args: any[]) => {
    const start = Date.now();
    let success = true;
    let error: Error | null = null;

    try {
      const result = await fn(...args);
      return result;
    } catch (err) {
      success = false;
      error = err as Error;
      throw err;
    } finally {
      const duration = Date.now() - start;
      
      monitoring.recordMetric(`${options.name}_duration`, duration, 'ms', {
        ...options.tags,
        success: success.toString(),
      });

      if (error) {
        monitoring.recordMetric(`${options.name}_error`, 1, 'count', {
          ...options.tags,
          error_type: error.constructor.name,
        });
      }
    }
  }) as T;
}

// Request timing decorator
export function timed(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    try {
      const result = await method.apply(this, args);
      const duration = Date.now() - start;
      
      monitoring.recordMetric(`method_${propertyName}_duration`, duration, 'ms', {
        class: target.constructor.name,
        success: 'true',
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      monitoring.recordMetric(`method_${propertyName}_duration`, duration, 'ms', {
        class: target.constructor.name,
        success: 'false',
      });
      
      throw error;
    }
  };
}

// Cleanup old metrics every hour
if (typeof window === 'undefined') {
  setInterval(() => {
    monitoring.cleanup();
  }, 60 * 60 * 1000);
}

export default monitoring;