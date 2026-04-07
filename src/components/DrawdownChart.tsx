import { useEffect, useRef } from 'react';
import { createChart, AreaSeries, LineStyle } from 'lightweight-charts';
import type { PerformanceData } from '../types';

interface Props {
  data: PerformanceData;
}

export function DrawdownChart({ data }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.drawdowns.length === 0) return;

    const chart = createChart(chartRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#8b8f9a',
        fontSize: 12,
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: '#1e2028' },
        horzLines: { color: '#1e2028' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: '#5a5e6b', width: 1, style: LineStyle.Dashed },
        horzLine: { color: '#5a5e6b', width: 1, style: LineStyle.Dashed },
      },
      rightPriceScale: { borderColor: '#2a2d38' },
      timeScale: { borderColor: '#2a2d38' },
    });

    const series = chart.addSeries(AreaSeries, {
      topColor: 'rgba(239, 68, 68, 0.3)',
      bottomColor: 'rgba(239, 68, 68, 0.02)',
      lineColor: '#ef4444',
      lineWidth: 1,
      priceLineVisible: false,
    });

    series.setData(
      data.drawdowns.map(d => ({
        time: d.date as string,
        value: d.drawdown_pct,
      }))
    );

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartRef.current) {
        chart.applyOptions({ width: chartRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  if (data.drawdowns.length === 0) return null;

  return (
    <div className="section">
      <div className="section-label">Drawdown History</div>
      <div ref={chartRef} style={{ height: 250, borderRadius: 'var(--radius-md)' }} />
    </div>
  );
}
