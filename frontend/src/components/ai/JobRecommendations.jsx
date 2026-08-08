import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Sparkles, Brain, Loader2, MapPin, DollarSign, Users, ArrowRight, Briefcase, RefreshCw, TrendingUp, Star, Zap } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import store from '../../redux/store'

// Responsive breakpoint hook — tracks viewport width so layout can adapt
function useViewport() {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])
    return {
        width,
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
    }
}

const MatchBadge = ({ score }) => {
    const color = score >= 85 ? '#10b981' : score >= 70 ? '#a855f7' : score >= 55 ? '#f59e0b' : '#f43f5e'
    const label = score >= 85 ? 'Top Pick' : score >= 70 ? 'Great Fit' : score >= 55 ? 'Good Match' : 'Possible'
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '100px', background: `${color}15`, border: `1px solid ${color}35` }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}` }} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '11px', color }}>{score}% • {label}</span>
        </div>
    )
}

const RecommendedJobCard = ({ rec, allJobs, navigate }) => {
    const job = allJobs.find(j =>
        j.title?.toLowerCase().includes(rec.title?.toLowerCase()) ||
        rec.title?.toLowerCase().includes(j.title?.toLowerCase())
    )

    return (
        <div className="glass-card" style={{ borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '13px', flexShrink: 0,
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))',
                        border: '1px solid rgba(124,58,237,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Briefcase size={20} color="#a855f7" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {rec.title}
                        </h3>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={11} /> {rec.location || 'India'}
                        </div>
                    </div>
                </div>
                <MatchBadge score={rec.match_score} />
            </div>

            {/* Why recommended */}
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Brain size={13} color="#a855f7" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
                        {rec.reason}
                    </p>
                </div>
            </div>

            {/* Matching skills */}
            {rec.matching_skills?.length > 0 && (
                <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>Matching Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {rec.matching_skills.slice(0, 5).map((s, i) => (
                            <span key={i} style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '500', color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {rec.salary_range && <span className="tag tag-amber"><DollarSign size={10} style={{ marginRight: '3px' }} />{rec.salary_range}</span>}
                {rec.job_type && <span className="tag tag-violet">{rec.job_type}</span>}
                {rec.experience_required && <span className="tag tag-emerald">{rec.experience_required}</span>}
            </div>

            {/* Action */}
            <button
                onClick={() => job ? navigate(`/description/${job._id}`) : navigate('/jobs')}
                className="btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {job ? 'View Job' : 'Browse Similar'} <ArrowRight size={14} />
            </button>
        </div>
    )
}

export default function JobRecommendations() {
    const { user } = useSelector(store => store.auth)
    const { allJobs, allAppliedJobs } = useSelector(store => store.job)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [recommendations, setRecommendations] = useState([])
    const [insights, setInsights] = useState(null)
    const [progress, setProgress] = useState(0)
    const [generated, setGenerated] = useState(false)
    const [filter, setFilter] = useState('all')
    const { isMobile, isTablet } = useViewport()

    const buildUserProfile = () => {
        const skills = user?.profile?.skills?.join(', ') || 'Not specified'
        const bio = user?.profile?.bio || 'Not specified'
        const education = user?.profile?.education || 'Not specified'
        const experienceLevel = user?.profile?.experienceLevel || 'Not specified'
        const appliedTitles = allAppliedJobs?.map(a => a.job?.title).filter(Boolean).join(', ') || 'None'
        const availableJobs = allJobs.slice(0, 20).map(j => ({
            title: j.title, company: j.company?.name, salary: j.salary,
            location: j.location, type: j.jobType, experience: j.experienceLevel,
            description: j.description?.slice(0, 200)
        }))
        return { skills, bio, education, experienceLevel, appliedTitles, availableJobs }
    }

    const generateRecommendations = async () => {
        setLoading(true)
        setProgress(0)
        setRecommendations([])
        setInsights(null)

        const progressInterval = setInterval(() => {
            setProgress(p => p < 88 ? p + Math.random() * 10 : p)
        }, 500)

        try {
            const { skills, bio, education, experienceLevel, appliedTitles, availableJobs } = buildUserProfile()

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    max_tokens: 1000,
                    messages: [{
                        role: 'user',
                        content: `You are an intelligent career advisor and job recommendation engine. Based on this candidate's profile and available jobs, generate personalized recommendations.

CANDIDATE PROFILE:
- Name: ${user?.fullname || 'Candidate'}
- Skills: ${skills}
- Bio / Summary: ${bio}
- Education: ${education}
- Experience Level: ${experienceLevel}
- Previously Applied To: ${appliedTitles}

AVAILABLE JOBS (pick best matches):
${JSON.stringify(availableJobs, null, 1)}

Respond ONLY with valid JSON (no markdown):
{
  "recommendations": [
    {
      "title": "<job title>",
      "location": "<location>",
      "salary_range": "<e.g. 8-12 LPA>",
      "job_type": "<Full Time|Part Time|Remote>",
      "experience_required": "<e.g. 2-4 years>",
      "match_score": <50-100 integer>,
      "reason": "<1-2 sentence personalized explanation why this fits the candidate based on their skills, education, and experience>",
      "matching_skills": ["skill1", "skill2"],
      "missing_skills": ["skill3"]
    }
  ],
  "career_insights": {
    "strongest_area": "<candidate's strongest domain based on skills and education>",
    "recommended_path": "<suggested career trajectory>",
    "skill_to_learn": "<single most impactful skill to add>",
    "market_demand": "<High|Medium|Low> for their profile",
    "tip": "<1 actionable career tip>"
  }
}

Generate exactly 6 recommendations sorted by match_score descending.`
                    }]
                })
            })

            const data = await response.json()
            clearInterval(progressInterval)
            setProgress(100)

            const raw = data.choices?.[0]?.message?.content || ''
            const match = raw.match(/\{[\s\S]*\}/)
            if (!match) throw new Error('Invalid response')

            const parsed = JSON.parse(match[0])
            setRecommendations(parsed.recommendations || [])
            setInsights(parsed.career_insights || null)
            setGenerated(true)
            toast.success('Recommendations generated!')
        } catch (err) {
            clearInterval(progressInterval)
            toast.error('Could not generate recommendations. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
            setTimeout(() => setProgress(0), 600)
        }
    }

    const filteredRecs = recommendations.filter(r => {
        if (filter === 'all') return true
        if (filter === 'top') return r.match_score >= 80
        if (filter === 'remote') return r.job_type?.toLowerCase().includes('remote')
        return true
    })

    const hasProfile = user?.profile?.skills?.length > 0 || user?.profile?.bio

    // Responsive size values derived from breakpoint, everything else identical
    const containerPadding = isMobile ? '32px 16px' : '48px 24px'
    const headerFontSize = isMobile ? '26px' : '36px'
    const mainGridColumns = isMobile || isTablet ? '1fr' : '1fr 320px'
    const emptyStatePadding = isMobile ? '40px 20px' : '80px'
    const emptyStateFeatureColumns = isMobile ? '1fr' : 'repeat(2, 1fr)'
    const progressStepsWrap = isMobile ? 'wrap' : 'nowrap'
    const sidebarSticky = isMobile || isTablet ? 'static' : 'sticky'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: containerPadding, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '36px' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', marginBottom: '16px' }}>
                            <Brain size={13} color="#3b82f6" />
                            <span style={{ color: '#3b82f6', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Powered</span>
                        </div>
                        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: headerFontSize, color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Job <span className="gradient-text">Recommendations</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '500px' }}>
                            AI analyzes your skills, experience, and history to surface the most relevant opportunities just for you
                        </p>
                    </div>

                    <button onClick={generateRecommendations} disabled={loading}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', fontSize: '15px', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                        {loading
                            ? <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                            : <><RefreshCw size={17} /> {generated ? 'Refresh' : 'Generate'} Recommendations</>}
                    </button>
                </div>

                {/* Profile completeness warning */}
                {!hasProfile && !generated && (
                    <div style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Zap size={18} color="#f59e0b" />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                                Better recommendations with a complete profile
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Add your skills and bio in your{' '}
                                <span onClick={() => navigate('/profile')} style={{ color: '#a855f7', cursor: 'pointer', fontWeight: '600' }}>profile</span>
                                {' '}for personalized results.
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress bar */}
                {loading && (
                    <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '20px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <Brain size={18} color="#3b82f6" />
                            <div>
                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>AI is analyzing your profile...</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Matching your skills against {allJobs.length} available positions</div>
                            </div>
                            <span style={{ marginLeft: isMobile ? '0' : 'auto', color: '#3b82f6', fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px' }}>{Math.round(progress)}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--bg-hover)', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #3b82f6, #06b6d4)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: progressStepsWrap, gap: isMobile ? '10px' : '20px', marginTop: '12px' }}>
                            {['Reading profile', 'Analyzing skills', 'Scoring jobs', 'Generating insights'].map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        background: progress > (i + 1) * 22 ? '#10b981' : 'var(--bg-hover)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'background 0.3s', border: '1px solid var(--border-subtle)'
                                    }}>
                                        {progress > (i + 1) * 22 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />}
                                    </div>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main content after generation */}
                {generated && !loading && (
                    <div style={{ display: 'grid', gridTemplateColumns: mainGridColumns, gap: '24px', alignItems: 'start' }}>
                        {/* Jobs Grid */}
                        <div>
                            {/* Filter tabs */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                {[
                                    { key: 'all', label: `All (${recommendations.length})` },
                                    { key: 'top', label: '🔥 Top Picks' },
                                    { key: 'remote', label: '🌐 Remote' },
                                ].map(tab => (
                                    <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                                        padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
                                        fontFamily: 'Syne, sans-serif', fontWeight: '600', transition: 'all 0.2s', border: 'none',
                                        background: filter === tab.key ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)',
                                        color: filter === tab.key ? '#a855f7' : 'var(--text-secondary)',
                                        border: `1px solid ${filter === tab.key ? 'rgba(124,58,237,0.4)' : 'var(--border-subtle)'}`
                                    }}>{tab.label}</button>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                {filteredRecs.map((rec, i) => (
                                    <div key={i} style={{ animation: `fadeUp 0.5s ease ${i * 0.08}s forwards`, opacity: 0 }}>
                                        <RecommendedJobCard rec={rec} allJobs={allJobs} navigate={navigate} />
                                    </div>
                                ))}
                            </div>

                            {filteredRecs.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                                    <p>No jobs match this filter. Try "All".</p>
                                </div>
                            )}
                        </div>

                        {/* Career Insights sidebar */}
                        {insights && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: sidebarSticky, top: '88px' }}>
                                <div className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <TrendingUp size={18} color="#3b82f6" />
                                        </div>
                                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>Career Insights</h3>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        {[
                                            { label: 'Strongest Area', value: insights.strongest_area, color: '#a855f7' },
                                            { label: 'Market Demand', value: insights.market_demand, color: insights.market_demand === 'High' ? '#10b981' : insights.market_demand === 'Medium' ? '#f59e0b' : '#f43f5e' },
                                        ].map((item, i) => (
                                            <div key={i} style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>{item.label}</div>
                                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: item.color }}>{item.value}</div>
                                            </div>
                                        ))}

                                        {insights.recommended_path && (
                                            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Career Path</div>
                                                <div style={{ color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.5' }}>{insights.recommended_path}</div>
                                            </div>
                                        )}

                                        {insights.skill_to_learn && (
                                            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                                                    <Star size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                                    Learn Next
                                                </div>
                                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: '#f59e0b' }}>{insights.skill_to_learn}</div>
                                            </div>
                                        )}

                                        {insights.tip && (
                                            <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                                <div style={{ color: '#10b981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', marginBottom: '6px' }}>💡 Pro Tip</div>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.7', margin: 0 }}>{insights.tip}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button onClick={() => navigate('/jobs')} className="btn-secondary"
                                    style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
                                    Browse All Jobs <ArrowRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Initial empty state */}
                {!generated && !loading && (
                    <div className="glass-card" style={{ borderRadius: '24px', padding: emptyStatePadding, textAlign: 'center' }}>
                        <div style={{
                            width: '88px', height: '88px', borderRadius: '24px',
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.1))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px', border: '1px solid rgba(124,58,237,0.2)'
                        }}>
                            <Brain size={40} color="#a855f7" />
                        </div>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>
                            Your Personal Job AI
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '420px', margin: '0 auto 32px', lineHeight: '1.7' }}>
                            Click <strong style={{ color: 'var(--text-primary)' }}>Generate Recommendations</strong> and our AI will analyze your profile and handpick the best opportunities for you.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: emptyStateFeatureColumns, gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
                            {[
                                { icon: '🧠', title: 'Profile Analysis', desc: 'Reads your skills & bio' },
                                { icon: '🎯', title: 'Smart Matching', desc: 'Scores every available job' },
                                { icon: '📊', title: 'Career Insights', desc: 'Personalized career advice' },
                                { icon: '⚡', title: 'Instant Results', desc: 'Ready in seconds' },
                            ].map((f, i) => (
                                <div key={i} style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                                    <div style={{ fontSize: '22px', marginBottom: '8px' }}>{f.icon}</div>
                                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '3px' }}>{f.title}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{f.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
