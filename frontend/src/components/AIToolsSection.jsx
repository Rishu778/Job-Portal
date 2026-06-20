import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, FileText, Target, Zap, Brain, ArrowRight } from 'lucide-react'

const tools = [
    { icon: <FileText size={20} />, label: 'Resume Parser', desc: 'Auto-extract & fill', path: '/ai/resume-parser', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    { icon: <Target size={20} />, label: 'ATS Analyzer', desc: 'Score your resume', path: '/ai/resume-analyzer', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { icon: <Zap size={20} />, label: 'Job Matcher', desc: 'Resume vs JD', path: '/ai/job-matcher', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { icon: <Brain size={20} />, label: 'AI Picks', desc: 'Jobs curated for you', path: '/ai/recommendations', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
]

export default function AIToolsSection() {
    const navigate = useNavigate()
    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
            <div style={{ borderRadius: '28px', background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.05))', border: '1px solid rgba(124,58,237,0.15)', padding: '48px', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative orb inside card */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '36px' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', marginBottom: '14px' }}>
                            <Sparkles size={13} color="#a855f7" />
                            <span style={{ color: '#a855f7', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Career Tools</span>
                        </div>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '30px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Supercharge Your<br /><span className="gradient-text">Job Search with AI</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '380px', lineHeight: '1.7' }}>
                            Four powerful AI tools to parse resumes, analyze ATS scores, match jobs, and get personalized recommendations.
                        </p>
                    </div>
                    <button onClick={() => navigate('/ai')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', whiteSpace: 'nowrap' }}>
                        <Sparkles size={15} /> Explore All Tools <ArrowRight size={15} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                    {tools.map((tool, i) => (
                        <button key={i} onClick={() => navigate(tool.path)} style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '18px 20px', borderRadius: '16px', cursor: 'pointer',
                            border: '1px solid var(--border-subtle)', background: 'var(--bg-card)',
                            transition: 'all 0.3s ease', textAlign: 'left', width: '100%'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = tool.color + '50'
                            e.currentTarget.style.background = tool.bg
                            e.currentTarget.style.transform = 'translateY(-3px)'
                            e.currentTarget.style.boxShadow = `0 8px 25px ${tool.color}20`
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)'
                            e.currentTarget.style.background = 'var(--bg-card)'
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tool.color, flexShrink: 0 }}>
                                {tool.icon}
                            </div>
                            <div>
                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>{tool.label}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{tool.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
