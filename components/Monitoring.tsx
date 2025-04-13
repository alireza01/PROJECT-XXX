'use client';

import React from 'react';
import { trackMetric, trackUserInteraction } from '@/lib/monitoring';

export const Monitoring: React.FC = () => {
  React.useEffect(() => {
    trackMetric('monitoring.component.mounted', 1);
    trackUserInteraction('monitoring.view');
  }, []);

  return (
    <div className="monitoring-wrapper" data-testid="monitoring">
      <h2>Monitoring</h2>
      <p>System monitoring is active</p>
    </div>
  );
}; 