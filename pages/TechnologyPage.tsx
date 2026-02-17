import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { Layers, Zap, Shield, Cpu, Activity, BarChart3, ChevronRight } from 'lucide-react';

const METRICS_STATS = [
  {
    label: 'Energy return',
    value: 85,
    unit: '%',
    bar: 85,
    color: 'cyan',
    icon: Zap,
    copy: 'Kinetic energy returned to your stride vs standard EVA.'
  },
  {
    label: 'Durability',
    value: 2,
    unit: 'x',
    bar: 100,
    color: 'lime',
    icon: Layers,
    copy: 'Outlasts competitor insoles without losing shape or arch support.'
  },
  {
    label: 'Impact reduction',
    value: -40,
    unit: '%',
    bar: 40,
    color: 'orange',
    icon: BarChart3,
    copy: 'Reduction in ground reaction force on joints and lower back.'
  }
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface TechnologyPageProps {
  onShopNow: () => void;
}

type AnatomyIndex = 0 | 1 | 2 | null;

const ANATOMY_ITEMS = [
  {
    id: '01',
    title: 'Carbon Stabilizer Cap',
    desc: 'Aerospace-grade carbon fiber composite for lightweight rigidity, torsion control, and skeletal alignment.',
    icon: Shield,
    accent: 'cyan' as const,
    zone: 'forefoot' as const // top of insole
  },
  {
    id: '02',
    title: 'AeroFoam™ Core',
    desc: 'Nitrogen-injected foam matrix for a trampoline effect — energy return with every strike.',
    icon: Zap,
    accent: 'lime' as const,
    zone: 'core' as const // middle
  },
  {
    id: '03',
    title: 'Heel Impact Zone',
    desc: 'Deep heel cup cradles the fat pad. 40% impact reduction vs standard EVA.',
    icon: Activity,
    accent: 'orange' as const,
    zone: 'heel' as const // bottom
  }
];

const METRICS_DURATION_MS = 1200;

export const TechnologyPage: React.FC<TechnologyPageProps> = ({ onShopNow }) => {
  const [hoveredAnatomy, setHoveredAnatomy] = useState<AnatomyIndex>(null);
  const metricsSectionRef = useRef<HTMLElement>(null);
  const [metricsInView, setMetricsInView] = useState(false);
  const [displayValues, setDisplayValues] = useState<number[]>([0, 0, 0]);
  const [barWidths, setBarWidths] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const el = metricsSectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMetricsInView(true);
      },
      { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!metricsInView) return;
    const targets = METRICS_STATS.map(s => (s.unit === '%' && s.value < 0 ? s.value : s.value));
    const barTargets = METRICS_STATS.map(s => s.bar);
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / METRICS_DURATION_MS, 1);
      const eased = easeOutCubic(t);
      setDisplayValues(
        targets.map((target, i) => {
          const start = 0;
          return Math.round(start + (target - start) * eased);
        })
      );
      setBarWidths(barTargets.map(w => w * eased));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [metricsInView]);

  return (
    <div className="animate-in fade-in duration-500 bg-[#0a0a0f] text-slate-100 min-h-screen">
      {/* Hero — terminal / HUD vibe */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 border-b border-white/[0.06]">
        {/* Background: fine grid + gradient mesh */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] via-transparent to-brand-orange/[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-cyan-400/30 bg-cyan-400/5 font-mono text-[11px] uppercase tracking-widest text-cyan-300 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AeroFoam™ Engine v2.0
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.95]">
            <span className="text-white">The Science</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-lime to-brand-orange">
              Of Speed.
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed">
            Engineered biomechanical propulsion. 85% kinetic energy return — lab-verified.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-cyan-500 text-[#0a0a0f] hover:bg-cyan-400 border-0 font-semibold tracking-tight transition-all shadow-[0_0_30px_rgba(34,211,238,0.25)]"
              onClick={onShopNow}
            >
              Experience AeroTouch
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">
              Lab-tested · Independent studies
            </span>
          </div>
        </div>
      </section>

      {/* 01 — Anatomy: spec panels */}
      <section className="relative py-24 border-b border-white/[0.06]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
            <div className="lg:w-2/5">
              <span className="font-mono text-cyan-400/90 text-sm uppercase tracking-widest mb-4 block">
                01 — Anatomy
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-10">
                Performance by design
              </h2>

              <div className="space-y-6">
                {ANATOMY_ITEMS.map((item, index) => {
                  const Icon = item.icon;
                  const accentClass =
                    item.accent === 'cyan'
                      ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                      : item.accent === 'lime'
                        ? 'border-brand-lime/50 text-brand-lime bg-brand-lime/10'
                        : 'border-brand-orange/50 text-brand-orange bg-brand-orange/10';
                  const isHovered = hoveredAnatomy === index;
                  return (
                    <div
                      key={item.id}
                      className="group relative pl-5 border-l-2 border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                      onMouseEnter={() => setHoveredAnatomy(index as AnatomyIndex)}
                      onMouseLeave={() => setHoveredAnatomy(null)}
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-sm border border-white/20 bg-[#0a0a0f] flex items-center justify-center">
                        <span className={`font-mono text-[10px] font-bold transition-colors ${isHovered ? 'text-white' : 'text-slate-500'}`}>
                          {item.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${accentClass}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed pl-12">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:w-3/5 relative">
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden aspect-[4/3] min-h-[340px] flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34,211,238,0.08) 0%, transparent 60%)`
                  }}
                />
                {/* Insole image with zone overlays — positions match forefoot (top), core (middle), heel (bottom) */}
                <div className="relative z-10 w-full max-w-md aspect-[3/5] flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
                    alt="Insole technology layers"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                  {/* Zone overlays: only the active one is visible */}
                  {/* Forefoot — top ~32% of insole */}
                  <div
                    className={`absolute left-[15%] right-[15%] top-0 h-[32%] rounded-b-xl border-2 transition-all duration-300 ${
                      hoveredAnatomy === 0
                        ? 'opacity-100 border-cyan-400 bg-cyan-400/20'
                        : 'opacity-0 border-transparent bg-transparent'
                    }`}
                  >
                    {hoveredAnatomy === 0 && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 whitespace-nowrap">
                        Carbon Stabilizer Cap
                      </span>
                    )}
                  </div>
                  {/* Core — middle ~36% */}
                  <div
                    className={`absolute left-[10%] right-[10%] top-[32%] h-[36%] rounded-lg border-2 transition-all duration-300 ${
                      hoveredAnatomy === 1
                        ? 'opacity-100 border-brand-lime bg-brand-lime/20'
                        : 'opacity-0 border-transparent bg-transparent'
                    }`}
                  >
                    {hoveredAnatomy === 1 && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-lime whitespace-nowrap">
                        AeroFoam™ Core
                      </span>
                    )}
                  </div>
                  {/* Heel — bottom ~32% */}
                  <div
                    className={`absolute left-[18%] right-[18%] bottom-0 h-[32%] rounded-t-xl border-2 transition-all duration-300 ${
                      hoveredAnatomy === 2
                        ? 'opacity-100 border-brand-orange bg-brand-orange/20'
                        : 'opacity-0 border-transparent bg-transparent'
                    }`}
                  >
                    {hoveredAnatomy === 2 && (
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-orange whitespace-nowrap">
                        Heel Impact Zone
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4 font-mono text-[10px] text-slate-500 uppercase tracking-wider border border-white/10 rounded px-2 py-1 bg-black/40">
                  {hoveredAnatomy !== null ? ANATOMY_ITEMS[hoveredAnatomy].title : 'Layer view'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — By the numbers: HUD-style stats */}
      <section
        ref={metricsSectionRef}
        className="relative py-24 border-b border-white/[0.06]"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-cyan-400/90 text-sm uppercase tracking-widest mb-4 block">
              02 — Metrics
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-3">
              By the numbers
            </h2>
            <p className="text-slate-500 text-sm font-medium">Lab-verified. Independent testing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {METRICS_STATS.map((stat, index) => {
              const Icon = stat.icon;
              const barColor =
                stat.color === 'cyan'
                  ? 'bg-cyan-500'
                  : stat.color === 'lime'
                    ? 'bg-brand-lime'
                    : 'bg-brand-orange';
              const textColor =
                stat.color === 'cyan'
                  ? 'text-cyan-400'
                  : stat.color === 'lime'
                    ? 'text-brand-lime'
                    : 'text-brand-orange';
              const displayVal = displayValues[index] ?? 0;
              const barW = barWidths[index] ?? 0;
              const displayStr = stat.value < 0 ? `${displayVal}` : String(displayVal);
              const staggerMs = 120 * index;
              return (
                <div
                  key={stat.label}
                  className="relative rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-500"
                  style={{
                    opacity: metricsInView ? 1 : 0,
                    transform: metricsInView ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${staggerMs}ms`
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-6 h-6 ${textColor}`} />
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <div className="font-mono text-4xl md:text-5xl font-black text-white mb-1">
                    {displayStr}
                    <span className={`text-xl ${textColor}`}>{stat.unit}</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{stat.copy}</p>
                  <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-none duration-300`}
                      style={{ width: `${barW}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — launch block */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/[0.04] to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <span className="font-mono text-cyan-400/90 text-sm uppercase tracking-widest mb-4 block">
            03 — Launch
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Ready to upgrade?
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            Join athletes who've switched to the future of foot support.
          </p>
          <Button
            size="lg"
            onClick={onShopNow}
            className="bg-cyan-500 text-[#0a0a0f] hover:bg-cyan-400 font-semibold shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all"
          >
            Shop AeroTouch Insoles
            <ChevronRight className="w-4 h-4 ml-1 inline" />
          </Button>
        </div>
      </section>
    </div>
  );
};
