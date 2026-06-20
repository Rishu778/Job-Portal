import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, TrendingUp, Users, Briefcase } from 'lucide-react'

const stats = [
    { icon: <Briefcase size={18} />, value: '12K+', label: 'Active Jobs' },
    { icon: <Users size={18} />, value: '3M+', label: 'Professionals' },
    { icon: <TrendingUp size={18} />, value: '94%', label: 'Success Rate' },
]

const trendingSearches = ['React Developer', 'Product Manager', 'Data Scientist', 'UX Designer', 'DevOps']

const HeroSection = () => {
    const [query, setQuery] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query))
        navigate('/browse')
    }

    return (
        <div style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden', zIndex: 1 }}>
            {/* Decorative orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            {/* Badge */}
            <div className="fade-up" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 18px', borderRadius: '100px',
                background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
                marginBottom: '28px'
            }}>
                <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#a855f7', display: 'inline-block',
                    animation: 'pulse 2s ease-in-out infinite'
                }} />
                <span style={{ color: '#a855f7', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: '600' }}>
                    #1 Job Platform for Professionals
                </span>
            </div>

            {/* Headline */}
            <h1 className="fade-up fade-up-delay-1" style={{
                fontSize: 'clamp(36px, 6vw, 76px)',
                fontFamily: 'Syne, sans-serif', fontWeight: '800',
                lineHeight: '1.1', letterSpacing: '-2px',
                color: 'var(--text-primary)', marginBottom: '20px'
            }}>
                Find Your Next<br />
                <span className="gradient-text">Dream Career</span>
            </h1>

            <p className="fade-up fade-up-delay-2" style={{
                color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '520px',
                margin: '0 auto 48px', lineHeight: '1.7'
            }}>
                Connect with top companies. Discover opportunities that match your ambitions and skills.
            </p>

            {/* Search Box */}
            <div className="fade-up fade-up-delay-2" style={{
                display: 'flex', alignItems: 'center', maxWidth: '580px',
                margin: '0 auto 20px',
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: '16px', padding: '8px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
            }}>
                <Search size={18} color="var(--text-secondary)" style={{ marginLeft: '12px', flexShrink: 0 }} />
                <input
                    type="text"
                    placeholder="Job title, keyword, or company..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && searchJobHandler()}
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        padding: '10px 16px', color: 'var(--text-primary)',
                        fontFamily: 'DM Sans, sans-serif', fontSize: '15px'
                    }}
                />
                <button onClick={searchJobHandler} className="btn-primary" style={{
                    padding: '10px 24px', borderRadius: '10px', display: 'flex',
                    alignItems: 'center', gap: '8px', fontSize: '14px'
                }}>
                    Search <ArrowRight size={16} />
                </button>
            </div>

            {/* Trending searches */}
            <div className="fade-up fade-up-delay-3" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Trending:</span>
                {trendingSearches.map(term => (
                    <button key={term} onClick={() => { dispatch(setSearchedQuery(term)); navigate('/browse') }}
                        style={{
                            padding: '4px 14px', borderRadius: '100px', border: '1px solid var(--border-subtle)',
                            background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px',
                            cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
                        }}
                        onMouseEnter={e => { e.target.style.borderColor = '#a855f7'; e.target.style.color = '#a855f7'; }}
                        onMouseLeave={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.color = 'var(--text-secondary)'; }}
                    >{term}</button>
                ))}
            </div>

            {/* Stats */}
            <div style={{
                display: 'flex', justifyContent: 'center', gap: '16px',
                flexWrap: 'wrap', marginTop: '64px'
            }}>
                {stats.map((s, i) => (
                    <div key={i} className="glass-card" style={{
                        padding: '20px 32px', borderRadius: '16px',
                        display: 'flex', alignItems: 'center', gap: '14px'
                    }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'rgba(124,58,237,0.15)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: '#a855f7'
                        }}>{s.icon}</div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '22px', color: 'var(--text-primary)' }}>{s.value}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HeroSection
