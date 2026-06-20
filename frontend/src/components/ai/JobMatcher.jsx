import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Upload, Sparkles, CheckCircle, XCircle, Zap, Loader2, FileText, Target, ArrowRight, Star, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import store from '../../redux/store'

const MatchMeter = ({ score }) => {
    const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'
    const label = score >= 75 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Weak Match'
    const circumference = 2 * Math.PI * 70
    const offset = circumference - (score / 100) * circumference

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="90" cy="90" r="70" fill="none" stroke="var(--bg-hover)" strokeWidth="12" />
                    <circle cx="90" cy="90" r="70" fill="none" stroke={color} strokeWidth="12"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 10px ${color}70)` }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '38px', color, lineHeight: 1 }}>{score}%</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>Match</span>
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '100px', background: `${color}18`, border: `1px solid ${color}40` }}>
                    <Star size={13} color={color} fill={color} />
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color }}>{label}</span>
                </div>
            </div>
        </div>
    )
}

export default function JobMatcher() {
    const { user } = useSelector(store => store.auth)
    const [resumeFile, setResumeFile] = useState(null)
    const [resumeName, setResumeName] = useState('')
    const [jobDesc, setJobDesc] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [progress, setProgress] = useState(0)
    const [activeTab, setActiveTab] = useState('matching')

    const handleResume = (e) => {
        const f = e.target.files?.[0]
        if (f) { setResumeFile(f); setResumeName(f.name); setResult(null) }
    }

    const analyzeMatch = async () => {
        if (!resumeFile) return toast.error('Please upload your resume')
        if (!jobDesc.trim() || jobDesc.trim().length < 50) return toast.error('Please paste the full job description')

        setLoading(true)
        setProgress(0)

        const progressInterval = setInterval(() => {
            setProgress(p => p < 88 ? p + Math.random() * 11 : p)
        }, 450)

        try {
            const resumeText = await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = e => resolve(e.target.result)
                reader.onerror = reject
                reader.readAsText(resumeFile)
            })

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
                        content: `You are an expert recruiter and ATS system. Compare this resume against the job description and respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "match_percentage": <0-100 integer>,
  "recommendation_score": <0-10 float>,
  "verdict": "<Highly Recommended|Recommended|Borderline|Not Recommended>",
  "matching_skills": ["skills found in both resume and JD"],
  "missing_skills": ["skills required in JD but absent in resume"],
  "extra_skills": ["valuable skills in resume not required by JD"],
  "experience_match": "<Over-qualified|Perfect|Under-qualified>",
  "key_gaps": ["top 3 gaps that hurt the match"],
  "strengths": ["top 3 reasons this candidate is a good fit"],
  "recommendation": "<2 sentence personalized recommendation>",
  "interview_probability": "<High|Medium|Low>"
}

RESUME:
${resumeText.slice(0, 5000)}

JOB DESCRIPTION:
${jobDesc.slice(0, 3000)}`
                    }]
                })
            })

            const data = await response.json()
            clearInterval(progressInterval)
            setProgress(100)

            const raw = data.choices?.[0]?.message?.content || ''
            const match = raw.match(/\{[\s\S]*\}/)
            if (!match) throw new Error('Invalid response format')
            setResult(JSON.parse(match[0]))
            toast.success('Match analysis complete!')
        } catch (err) {
            clearInterval(progressInterval)
            toast.error('Analysis failed. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
            setTimeout(() => setProgress(0), 600)
        }
    }

    const verdictColor = (v) => ({
        'Highly Recommended': '#10b981',
        'Recommended': '#a855f7',
        'Borderline': '#f59e0b',
        'Not Recommended': '#f43f5e'
    }[v] || '#a855f7')

    const interviewColor = (p) => ({ 'High': '#10b981', 'Medium': '#f59e0b', 'Low': '#f43f5e' }[p] || '#f59e0b')

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: '16px' }}>
                        <Zap size={13} color="#10b981" />
                        <span style={{ color: '#10b981', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Powered</span>
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Job <span className="gradient-text">Matcher</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Compare your resume against any job description and get an instant compatibility score</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: result ? '380px 1fr' : '1fr 1fr', gap: '24px' }}>
                    {/* Input Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Resume Upload */}
                        <div className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                                Step 1 — Your Resume
                            </h3>
                            <div
                                onClick={() => document.getElementById('matcherResume').click()}
                                style={{
                                    borderRadius: '14px', border: `2px dashed ${resumeFile ? 'rgba(16,185,129,0.5)' : 'var(--border-subtle)'}`,
                                    background: resumeFile ? 'rgba(16,185,129,0.05)' : 'var(--bg-secondary)',
                                    padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s'
                                }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: resumeFile ? 'rgba(16,185,129,0.15)' : 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', border: '1px solid var(--border-subtle)' }}>
                                    {resumeFile ? <FileText size={20} color="#10b981" /> : <Upload size={20} color="var(--text-secondary)" />}
                                </div>
                                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: resumeFile ? '#10b981' : 'var(--text-primary)', marginBottom: '3px' }}>
                                    {resumeFile ? resumeName : 'Upload Resume'}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{resumeFile ? 'Click to change' : 'PDF or text'}</p>
                                <input id="matcherResume" type="file" accept=".pdf,.txt" onChange={handleResume} style={{ display: 'none' }} />
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                                Step 2 — Job Description
                            </h3>
                            <textarea
                                value={jobDesc}
                                onChange={e => setJobDesc(e.target.value)}
                                placeholder="Paste the full job description here...&#10;&#10;Include requirements, responsibilities, and preferred qualifications for the most accurate match."
                                style={{
                                    width: '100%', minHeight: '180px', background: 'var(--bg-secondary)',
                                    border: `1px solid ${jobDesc.length > 50 ? 'rgba(16,185,129,0.4)' : 'var(--border-subtle)'}`,
                                    borderRadius: '12px', padding: '14px', color: 'var(--text-primary)',
                                    fontFamily: 'DM Sans, sans-serif', fontSize: '13px', lineHeight: '1.7',
                                    resize: 'vertical', outline: 'none', transition: 'border-color 0.2s'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{jobDesc.length} chars</span>
                            </div>
                        </div>

                        {/* Progress */}
                        {loading && (
                            <div style={{ borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Analyzing match...</span>
                                    <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>{Math.round(progress)}%</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
                                </div>
                            </div>
                        )}

                        <button onClick={analyzeMatch} disabled={!resumeFile || !jobDesc.trim() || loading}
                            style={{
                                padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                borderRadius: '12px', border: 'none', cursor: (!resumeFile || !jobDesc.trim()) ? 'not-allowed' : 'pointer',
                                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: '700',
                                boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                                opacity: (!resumeFile || !jobDesc.trim()) ? 0.5 : 1,
                                transition: 'all 0.2s'
                            }}>
                            {loading
                                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
                                : <><Sparkles size={16} /> Analyze Match <ArrowRight size={16} /></>}
                        </button>
                    </div>

                    {/* Results */}
                    {result && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Score + Verdict */}
                            <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <MatchMeter score={result.match_percentage} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                                        {[
                                            { label: 'Recommendation Score', value: `${result.recommendation_score}/10`, color: '#a855f7' },
                                            { label: 'Experience Match', value: result.experience_match, color: '#f59e0b' },
                                            { label: 'Interview Probability', value: result.interview_probability, color: interviewColor(result.interview_probability) },
                                        ].map((s, i) => (
                                            <div key={i}>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</div>
                                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '18px', color: s.color }}>{s.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Verdict */}
                                <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        background: verdictColor(result.verdict),
                                        boxShadow: `0 0 8px ${verdictColor(result.verdict)}`
                                    }} />
                                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: verdictColor(result.verdict) }}>
                                        {result.verdict}
                                    </span>
                                    {result.recommendation && (
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>— {result.recommendation}</span>
                                    )}
                                </div>
                            </div>

                            {/* Skills Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                {/* Matching Skills */}
                                <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.2)', padding: '18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <CheckCircle size={16} color="#10b981" />
                                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>Matching Skills</span>
                                        <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '100px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '11px', fontWeight: '700' }}>
                                            {result.matching_skills?.length || 0}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {result.matching_skills?.map((s, i) => (
                                            <span key={i} style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '500', color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid rgba(244,63,94,0.2)', padding: '18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <XCircle size={16} color="#f43f5e" />
                                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>Missing Skills</span>
                                        <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '100px', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', fontSize: '11px', fontWeight: '700' }}>
                                            {result.missing_skills?.length || 0}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {result.missing_skills?.map((s, i) => (
                                            <span key={i} style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '500', color: '#f43f5e', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Extra skills */}
                            {result.extra_skills?.length > 0 && (
                                <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid rgba(168,85,247,0.2)', padding: '18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <TrendingUp size={16} color="#a855f7" />
                                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>Bonus Skills You Bring</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {result.extra_skills.map((s, i) => <span key={i} className="tag tag-violet">{s}</span>)}
                                    </div>
                                </div>
                            )}

                            {/* Key Gaps + Strengths */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid rgba(245,158,11,0.2)', padding: '18px' }}>
                                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px' }}>⚠️ Key Gaps</div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {result.key_gaps?.map((g, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.5' }}>
                                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f59e0b', marginTop: '6px', flexShrink: 0 }} />
                                                {g}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.2)', padding: '18px' }}>
                                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px' }}>✅ Why You Fit</div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {result.strengths?.map((s, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.5' }}>
                                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', marginTop: '6px', flexShrink: 0 }} />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder when no result */}
                    {!result && (
                        <div className="glass-card" style={{ borderRadius: '20px', padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(16,185,129,0.2)' }}>
                                <Target size={32} color="#10b981" />
                            </div>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '10px' }}>
                                Ready to Match?
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', maxWidth: '280px' }}>
                                Upload your resume and paste a job description to get an instant compatibility score and personalized gap analysis.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {['Match %', 'Skill Gaps', 'Interview Chances', 'Recommendations'].map((f, i) => (
                                    <span key={i} style={{ padding: '6px 14px', borderRadius: '100px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Syne, sans-serif' }}>
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
