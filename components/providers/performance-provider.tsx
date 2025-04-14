"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPerformanceMonitoring, trackPagePerformance, trackMetric, trackUserInteraction } from "@/lib/monitoring";

interface Props {
  children: React.ReactNode;
}

export default function PerformanceProvider({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef<string>("");
  const startTimeRef = useRef<number>(Date.now());

  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  // Track page navigation and performance
  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    
    if (currentPath !== lastPathRef.current) {
      const loadTime = Date.now() - startTimeRef.current;
      
      // Track page performance
      trackPagePerformance(currentPath, loadTime);
      
      // Track navigation event
      trackUserInteraction("page_navigation", {
        from: lastPathRef.current,
        to: currentPath,
        loadTime,
      });

      // Update refs
      lastPathRef.current = currentPath;
      startTimeRef.current = Date.now();
    }
  }, [pathname, searchParams]);

  // Track component mount performance
  useEffect(() => {
    const mountTime = Date.now() - startTimeRef.current;
    trackMetric("app.initial_load", mountTime);
  }, []);

  return <>{children}</>;
} 