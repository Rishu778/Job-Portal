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
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            <style>{`
                .aihub-wrapper {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 60px 24px;
                    position: relative;
                    zIndex: 1;
                }
                .aihub-header {
                    text-align: center;
                    margin-bottom: 64px;
                }
                .aihub-stats {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    margin-top: 40px;
                    flex-wrap: wrap;
                }
                .aihub-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
                    gap: 20px;
                }
                .aihub-feature-card {
                    border-radius: 24px;
                    padding: 32px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .aihub-card-inner {
                    display: flex;
                    align-items: flex-start;
                    gap: 18px;
                }
                .aihub-cta {
                    text-align: center;
                    margin-top: 64px;
                    padding: 48px;
                    border-radius: 24px;
                    background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.05));
                    border: 1px solid rgba(124,58,237,0.15);
                }
                .aihub-cta-buttons {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                @media (max-width: 768px) {
                    .aihub-wrapper {
                        padding: 36px 16px !important;
                    }
                    .aihub-header {
                        margin-bottom: 36px !important;
                    }
                    .aihub-stats {
                        gap: 24px !important;
                    }
                    .aihub-cards-grid {
                        grid-template-columns: 1fr !important;
                        gap: 14px !important;
                    }
                    .aihub-feature-card {
                        padding: 22px !important;
                        border-radius: 18px !important;
                    }
                    .aihub-cta {
                        margin-top: 36px !important;
                        padding: 28px 20px !important;
                        border-radius: 18px !important;
                    }
                }

                @media (max-width: 480px) {
                    .aihub-wrapper {
                        padding: 24px 12px !important;
                    }
                    .aihub-card-inner {
                        flex-direction: column !important;
                        gap: 14px !important;
                    }
                    .aihub-icon-box {
                        width: 48px !important;
                        height: 48px !important;
                        border-radius: 14px !important;
                    }
                    .aihub-feature-title {
                        font-size: 17px !important;
                    }
                    .aihub-cta-title {
                        font-size: 20px !important;
                    }
                    .aihub-cta-buttons button {
                        width: 100% !important;
                        justify-content: center !important;
                    }
                    .aihub-stats {
                        gap: 16px !important;
                    }
                }
            `}</style>

            <div className="aihub-wrapper">
                {/* Header */}
                <div className="aihub-header">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '100px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', marginBottom: '20px' }}>
                        <Sparkles size={14} color="#a855f7" />
                        <span style={{ color: '#a855f7', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Powered by Groq AI
                        </span>
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: 'clamp(28px, 5vw, 56px)', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.1', letterSpacing: '-1px' }}>
                        Your AI Career<br /><span className="gradient-text">Toolkit</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(14px, 2vw, 17px)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7', padding: '0 8px' }}>
                        Four powerful AI tools to supercharge your job search — from parsing your resume to landing interviews.
                    </p>

                    {/* Stats row */}
                    <div className="aihub-stats">
                        {[
                            { value: '4', label: 'AI Tools' },
                            { value: '< 5s', label: 'Response Time' },
                            { value: '100%', label: 'Free to Use' },
                        ].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: 'clamp(22px, 4vw, 28px)', background: 'linear-gradient(135deg, #a855f7, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="aihub-cards-grid">
                    {aiFeatures.map((feature, i) => (
                        <div
                            key={i}
                            className="aihub-feature-card"
                            onClick={() => navigate(feature.path)}
                            style={{
                                background: 'var(--bg-card)',
                                border: `1px solid ${feature.border}`,
                                animation: `fadeUp 0.5s ease ${i * 0.1}s forwards`,
                                opacity: 0
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

                            <div className="aihub-card-inner">
                                {/* Icon */}
                                <div className="aihub-icon-box" style={{
                                    width: '60px', height: '60px', borderRadius: '18px', flexShrink: 0,
                                    background: feature.bg, border: `1px solid ${feature.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: feature.color
                                }}>
                                    {feature.icon}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                        <h2 className="aihub-feature-title" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '20px', color: 'var(--text-primary)' }}>
                                            {feature.title}
                                        </h2>
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
                <div className="aihub-cta">
                    <h2 className="aihub-cta-title" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)', marginBottom: '10px' }}>
                        Ready to land your dream job?
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '28px' }}>
                        Start with parsing your resume, then analyze it, match it to jobs, and let AI recommend the best fits.
                    </p>
                    <div className="aihub-cta-buttons">
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
