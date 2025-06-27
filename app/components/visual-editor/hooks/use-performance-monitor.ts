import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
}

export function usePerformanceMonitor(componentCount: number) {
  const renderStartTime = useRef<number>(0);
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;

    const metrics: PerformanceMetrics = {
      renderTime,
      componentCount,
    };

    // Add memory usage if available
    if ("memory" in performance) {
      const memory = (
        performance as unknown as { memory: { usedJSHeapSize: number } }
      ).memory;
      metrics.memoryUsage = memory.usedJSHeapSize;
    }

    metricsRef.current.push(metrics);

    // Keep only last 100 measurements
    if (metricsRef.current.length > 100) {
      metricsRef.current = metricsRef.current.slice(-100);
    }

    // Log performance warnings
    if (renderTime > 100) {
      console.warn(
        `Slow render detected: ${renderTime.toFixed(2)}ms for ${componentCount} components`,
      );
    }
  });

  const getAverageRenderTime = () => {
    if (metricsRef.current.length === 0) return 0;
    const total = metricsRef.current.reduce(
      (sum, metric) => sum + metric.renderTime,
      0,
    );
    return total / metricsRef.current.length;
  };

  const getMetrics = () => ({
    current: metricsRef.current[metricsRef.current.length - 1],
    average: getAverageRenderTime(),
    history: metricsRef.current.slice(),
  });

  return { getMetrics };
}

export function useComponentPerformance(componentName: string) {
  const mountTime = useRef<number>(0);
  const updateCount = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();

    return () => {
      const lifeTime = performance.now() - mountTime.current;
      console.debug(
        `Component ${componentName} unmounted after ${lifeTime.toFixed(2)}ms, ${updateCount.current} updates`,
      );
    };
  }, [componentName]);

  useEffect(() => {
    updateCount.current += 1;
  });

  return {
    getUpdateCount: () => updateCount.current,
    getLifeTime: () => performance.now() - mountTime.current,
  };
}
