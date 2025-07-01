// Database monitoring utilities for performance tracking
import { supabase } from "@/integrations/supabase/client";

export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

class DatabaseMonitor {
  private metrics: QueryMetrics[] = [];
  private isEnabled = process.env.NODE_ENV === "development";

  async trackQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) {
      return queryFn();
    }

    const startTime = performance.now();
    const timestamp = new Date();

    try {
      const result = await queryFn();
      const duration = performance.now() - startTime;

      this.metrics.push({
        query: queryName,
        duration,
        timestamp,
        success: true,
      });

      // Log slow queries (> 1000ms)
      if (duration > 1000) {
        console.warn(`🐌 Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.metrics.push({
        query: queryName,
        duration,
        timestamp,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      console.error(`❌ Query failed: ${queryName} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  getMetrics(): QueryMetrics[] {
    return [...this.metrics];
  }

  getSlowQueries(threshold = 1000): QueryMetrics[] {
    return this.metrics.filter((m) => m.duration > threshold);
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  getAverageQueryTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.metrics.length;
  }
}

export const dbMonitor = new DatabaseMonitor();

// Wrapper for Supabase queries
export async function monitoredQuery<T>(
  queryName: string,
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  return dbMonitor.trackQuery(queryName, queryFn);
}

// Example usage:
// const { data, error } = await monitoredQuery(
//   'loadCategories',
//   () => supabase.from('categories').select('*')
// );
