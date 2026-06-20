import React from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import { Sparkles, FileText, Target, Brain, Zap, ArrowRight, CheckCircle } from 'lucide-react'

const aiFeatures = [
    {
        icon: <FileText size={28} />,
        emoji: '🔍',
        title: 'Resume Parser',
        subtitle: 'Extract & Auto-Fill',
        description: 'Upload your resume and let AI instantly extract your name, email, skills, experience, education, and projects — then auto-populate your profile.',
        color: '#a855f7',
        bg: 'rgba(168,85,247,0.1)',
        border: 'rgba(168,85,247,0.25)',
        path: '/ai/resume-parser',
        perks: ['Extract all key fields', 'Auto-fill your profile', 'Instant results'],
    },
    {
        icon: <Target size={28} />,
        emoji: '📊',
        title: 'Resume Analyzer',
        subtitle: 'ATS & Quality Score',
        description: 'Get a detailed ATS score, resume quality score, strengths, weaknesses, missing skills, and actionable suggestions to land more interviews.',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.1)',
        border: 'rgba(245,158,11,0.25)',
        path: '/ai/resume-analyzer',
        perks: ['ATS score', 'Quality analysis', 'Improvement tips'],
    },
    {
        icon: <Zap size={28} />,
        emoji: '⚡',
        title: 'Job Matcher',
        subtitle: 'Resume vs Job Description',
        description: 'Paste any job description and compare it against your resume. Get a match percentage, skill gap analysis, and interview probability instantly.',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.1)',
        border: 'rgba(16,185,129,0.25)',
        path: '/ai/job-matcher',
        perks: ['Match percentage', 'Skill gap analysis', 'Interview chances'],
    },
    {
        icon: <Brain size={28} />,
        emoji: '🧠',
        title: 'Job Recommendations',
        subtitle: 'AI-Curated For You',
        description: "Our AI reads your profile, skills, experience, and application history to recommend the most relevant jobs from our database — personalized just for you.",
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.1)',
        border: 'rgba(59,130,246,0.25)',
        path: '/ai/recommendations',
        perks: ['Profile-based matching', 'Career insights', 'Instant generation'],
    },
]

export default function AIHub() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '100px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', marginBottom: '20px' }}>
                        <Sparkles size={14} color="#a855f7" />
                        <span style={{ color: '#a855f7', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Powered by Claude AI
                        </span>
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.1', letterSpacing: '-1px' }}>
                        Your AI Career<br /><span className="gradient-text">Toolkit</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
                        Four powerful AI tools to supercharge your job search — from parsing your resume to landing interviews.
                    </p>

                    {/* Stats row */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', flexWrap: 'wrap' }}>
                        {[
                            { value: '4', label: 'AI Tools' },
                            { value: '< 5s', label: 'Response Time' },
                            { value: '100%', label: 'Free to Use' },
                        ].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #a855f7, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '20px' }}>
                    {aiFeatures.map((feature, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(feature.path)}
                            style={{
                                borderRadius: '24px', padding: '32px',
                                background: 'var(--bg-card)', border: `1px solid ${feature.border}`,
                                cursor: 'pointer', transition: 'all 0.3s ease',
                                position: 'relative', overflow: 'hidden',
                                animation: `fadeUp 0.5s ease ${i * 0.1}s forwards`, opacity: 0
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.boxShadow = `0 20px 50px ${feature.color}20`
                                e.currentTarget.style.background = feature.bg
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                                e.currentTarget.style.background = 'var(--bg-card)'
                            }}
                        >
                            {/* Decorative gradient */}
                            <div style={{
                                position: 'absolute', top: '-40px', right: '-40px',
                                width: '140px', height: '140px', borderRadius: '50%',
                                background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
                                pointerEvents: 'none'
                            }} />

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                                {/* Icon */}
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '18px', flexShrink: 0,
                                    background: feature.bg, border: `1px solid ${feature.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: feature.color, fontSize: '28px'
                                }}>
                                    {feature.icon}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '20px', color: 'var(--text-primary)' }}>{feature.title}</h2>
                                        <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', color: feature.color, background: feature.bg, border: `1px solid ${feature.border}` }}>
                                            {feature.subtitle}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '18px' }}>
                                        {feature.description}
                                    </p>

                                    {/* Perks */}
                                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                        {feature.perks.map((perk, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <CheckCircle size={12} color={feature.color} />
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{perk}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: feature.color, fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px' }}>
                                        Try it now <ArrowRight size={15} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div style={{ textAlign: 'center', marginTop: '64px', padding: '48px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.05))', border: '1px solid rgba(124,58,237,0.15)' }}>
                    <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)', marginBottom: '10px' }}>
                        Ready to land your dream job?
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '28px' }}>
                        Start with parsing your resume, then analyze it, match it to jobs, and let AI recommend the best fits.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/ai/resume-parser')} className="btn-primary" style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={16} /> Start with Resume Parser
                        </button>
                        <button onClick={() => navigate('/jobs')} className="btn-secondary" style={{ padding: '12px 24px' }}>
                            Browse All Jobs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
