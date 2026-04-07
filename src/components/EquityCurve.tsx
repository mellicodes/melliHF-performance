import { useEffect, useRef, useState } from 'react';
import { createChart, type IChartApi, type ISeriesApi, LineSeries, LineStyle } from 'lightweight-charts';
import type { PerformanceData, BenchmarksData } from '../types';

interface Props {
  data: PerformanceData;
  benchmarks: BenchmarksData;
}

export function EquityCurve({ data, benchmarks }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartApi = useRef<IChartApi | null>(null);
  const [activeBenchmark, setActiveBenchmark] = useState<string>('SPY');

  const portfolioRef = useRef<ISeriesApi<'Line'> | null>(null);
  const benchmarkRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

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
      rightPriceScale: {
        borderColor: '#2a2d38',
      },
      timeScale: {
        borderColor: '#2a2d38',
        timeVisible: false,
      },
      handleScale: { axisPressedMouseMove: true },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
    });

    chartApi.current = chart;

    const portfolioSeries = chart.addSeries(LineSeries, {
      color: '#10b981',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      title: 'melliHF',
    });

    const portfolioData = data.equity_curve.map(p => ({
      time: p.date as string,
      value: p.portfolio,
    }));
    portfolioSeries.setData(portfolioData);
    portfolioRef.current = portfolioSeries;

    const benchmarkSeries = chart.addSeries(LineSeries, {
      color: '#5a5e6b',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      priceLineVisible: false,
      lastValueVisible: true,
      title: activeBenchmark,
    });
    benchmarkRef.current = benchmarkSeries;

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
  }, []);

  useEffect(() => {
    if (!benchmarkRef.current) return;
    const series = benchmarks.benchmarks[activeBenchmark];
    if (series) {
      benchmarkRef.current.setData(
        series.map(p => ({ time: p.date as string, value: p.value }))
      );
      benchmarkRef.current.applyOptions({ title: activeBenchmark });
    } else {
      benchmarkRef.current.setData([]);
    }
  }, [activeBenchmark, benchmarks]);

  if (data.equity_curve.length === 0) {
    return (
      <div className="section">
        <div style={{
          height: 400,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--bg-elevated)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            Collecting performance data...
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            First data point arriving soon
          </p>
        </div>
      </div>
    );
  }

  const benchmarkNames = Object.keys(benchmarks.benchmarks);

  // Compute outperformance vs SPY
  const spyData = benchmarks.benchmarks['SPY'];
  const lastPortfolio = data.equity_curve[data.equity_curve.length - 1]?.portfolio ?? 100;
  const lastSpy = spyData?.[spyData.length - 1]?.value ?? 100;
  const outperformance = (lastPortfolio - 100) - (lastSpy - 100);

  return (
    <div className="section" style={{ paddingBottom: 0 }}>
      <h1 className="section-label">Performance</h1>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 20,
        fontWeight: 500,
        color: 'var(--text-primary)',
        lineHeight: 1.3,
        marginBottom: 'var(--space-lg)',
      }}>
        {data.summary.total_return_pct >= 0 ? '+' : ''}{data.summary.total_return_pct.toFixed(1)}% return
        {spyData && outperformance > 0 && (
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
            {' '}— outperforming SPY by {outperformance.toFixed(1)}pp
          </span>
        )}
      </p>
      <div style={{ position: 'relative' }}>
        <div ref={chartRef} style={{ height: 500, borderRadius: 'var(--radius-md)' }} />
        {benchmarkNames.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-md)',
            flexWrap: 'wrap',
          }}>
            {benchmarkNames.map(name => (
              <button
                key={name}
                onClick={() => setActiveBenchmark(name)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${activeBenchmark === name ? 'var(--accent)' : 'var(--border)'}`,
                  background: activeBenchmark === name ? 'var(--bg-elevated)' : 'transparent',
                  color: activeBenchmark === name ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  cursor: 'pointer',
                  minHeight: 44,
                }}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
