import React, { useState } from 'react';
import { Smartphone, Server, Layers, Database, Activity, ShieldCheck } from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  category: string;
  tech: string[];
  metrics: string;
  status: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
  description: string;
}

export const HolographicArchitecture: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('microservices');

  const nodes: ArchNode[] = [
    {
      id: 'frontend',
      name: 'FRONTEND',
      category: 'Reactive Client Tier',
      tech: ['React 19', 'Angular 17', 'TypeScript', 'Tailwind CSS', 'Responsive UI'],
      metrics: '60 FPS • <0.8s FCP',
      status: 'OPTIMAL',
      color: '#00e5ff',
      glowColor: 'rgba(0, 229, 255, 0.45)',
      icon: <Smartphone size={16} className="text-[#00e5ff]" />,
      description: 'Dynamic reactive frontends, state management, and real-time dashboard visualization.',
    },
    {
      id: 'gateway',
      name: 'API GATEWAY',
      category: 'Routing & Security',
      tech: ['REST APIs', 'Spring Cloud Gateway', 'JWT Authentication', 'Rate Limiting', 'CORS'],
      metrics: '12ms Latency • TLS 1.3',
      status: 'SECURE',
      color: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.45)',
      icon: <Server size={16} className="text-[#38bdf8]" />,
      description: 'High-throughput reverse proxy, API contract validation, and unified security gateway.',
    },
    {
      id: 'microservices',
      name: 'MICROSERVICES',
      category: 'Enterprise Backend & ERP',
      tech: ['Java 21', 'Spring Boot 3', 'ERP Architecture', 'Microservices', 'Docker', 'Kafka'],
      metrics: '4,500 RPS • 99.9% Uptime',
      status: 'HIGH LOAD READY',
      color: '#ff5500',
      glowColor: 'rgba(255, 85, 0, 0.55)',
      icon: <Layers size={16} className="text-[#ff5500]" />,
      description: 'Mission-critical ERP business modules, Spring Boot microservices, and event-driven distributed architecture.',
    },
    {
      id: 'database',
      name: 'DATABASE',
      category: 'Persistence & Cache',
      tech: ['MySQL 8', 'Redis Cache', 'Hibernate / JPA', 'Connection Pooling', 'ACID Transactions'],
      metrics: '100% Integrity • <3ms Query',
      status: 'REPLICATED',
      color: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      icon: <Database size={16} className="text-[#10b981]" />,
      description: 'Relational MySQL database cluster with Redis low-latency caching and automated transactions.',
    },
  ];

  const currentNode = nodes.find((n) => n.id === activeNode) || nodes[2];

  return (
    <div className="relative w-full rounded-2xl p-3 sm:p-4 bg-slate-950/25 hover:bg-slate-950/35 border border-[#00e5ff]/35 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.4)] text-left space-y-3 pointer-events-auto transition-colors">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-white uppercase">
            SYSTEM ARCHITECTURE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-300">
          <ShieldCheck size={11} className="text-[#00e5ff]" />
          <span>ENTERPRISE ERP</span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-400 font-semibold">TLS 1.3</span>
        </div>
      </div>

      {/* 4 Pipeline Steps: Frontend → API Gateway → Microservices → Database */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-0.5">
        {nodes.map((node, idx) => {
          const isSelected = node.id === activeNode;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveNode(node.id)}
              className={`relative flex flex-col p-2.5 rounded-xl border transition-all text-left duration-300 group cursor-pointer backdrop-blur-sm ${isSelected
                  ? 'bg-slate-900/60 border-opacity-100 shadow-md scale-[1.02]'
                  : 'bg-slate-950/20 border-white/10 hover:border-white/30 hover:bg-slate-900/40'
                }`}
              style={{
                borderColor: isSelected ? node.color : undefined,
                boxShadow: isSelected ? `0 0 15px ${node.glowColor}` : undefined,
              }}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="p-1 rounded-lg bg-black/60 border border-white/10">
                  {node.icon}
                </span>
                <span className="text-[9px] font-mono font-bold text-white/50">
                  0{idx + 1}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-white tracking-wider truncate">
                {node.name}
              </span>
              <span className="text-[9px] font-mono text-white/55 line-clamp-1 mt-0.5">
                {node.category}
              </span>

              {/* Status Indicator */}
              <div className="mt-1.5 flex items-center justify-between">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
                <span className="text-[8px] font-mono text-white/60 font-medium">
                  {node.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Animated Pipeline Flow Connector Bar */}
      <div className="relative py-0.5 flex items-center justify-center overflow-hidden">
        <div className="w-full h-1 bg-gradient-to-r from-[#00e5ff]/25 via-[#ff5500]/40 to-[#10b981]/25 rounded-full relative">
          <div className="absolute top-1/2 -translate-y-1/2 w-10 h-1.5 rounded-full bg-gradient-to-r from-[#00e5ff] via-white to-[#ff5500] blur-[1px] animate-[pipelineFlow_4s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Active Node Detail Card */}
      <div
        className="p-2.5 rounded-xl bg-slate-950/30 backdrop-blur-md border transition-all duration-300 space-y-1.5"
        style={{ borderColor: `${currentNode.color}50` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${currentNode.color}20`,
                color: currentNode.color,
                border: `1px solid ${currentNode.color}60`,
              }}
            >
              {currentNode.name}
            </span>
            <span className="text-[10px] font-mono text-white/70">
              {currentNode.category}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-white">
            <Activity size={11} style={{ color: currentNode.color }} className="animate-pulse" />
            <span>{currentNode.metrics}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug font-sans">
          {currentNode.description}
        </p>

        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          {currentNode.tech.map((t) => (
            <span
              key={t}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
