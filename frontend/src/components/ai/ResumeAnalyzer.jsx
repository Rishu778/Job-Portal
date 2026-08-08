import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Upload, Sparkles, TrendingUp, AlertCircle, CheckCircle, XCircle, Lightbulb, Loader2, FileText, Target, Zap } from 'lucide-react'
import { toast } from 'sonner'
// import { extractPDFText } from "../../utils/pdfExtractor.js"
import { extractTextFromFile } from '../../utils/pdfReader'

const ScoreRing = ({ score, label, color, size = 110 }) => {
    const radius = (size - 16) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--bg-hover)" strokeWidth="8" />
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 6px ${color}60)` }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: size > 100 ? '22px' : '16px', color }}>{score}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>/100</span>
                </div>
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>{label}</span>
        </div>
    )
}

const ListSection = ({ icon, title, items, color, bgColor, borderColor }) => (
    <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: `1px solid ${borderColor}`, padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>{title}</h3>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items?.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, marginTop: '7px', flexShrink: 0 }} />
                    {item}
                </li>
            ))}
        </ul>
    </div>
)

export default function ResumeAnalyzer() {
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleFile = (e) => {
        const f = e.target.files?.[0]
        if (f) { setFile(f); setFileName(f.name); setAnalysis(null) }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const f = e.dataTransfer.files?.[0]
        if (f) { setFile(f); setFileName(f.name); setAnalysis(null) }
    }

    const analyzeResume = async () => {
        if (!file) return toast.error('Please upload a resume first')
        setLoading(true)
        setProgress(0)

        const progressInterval = setInterval(() => {
            setProgress(p => p < 88 ? p + Math.random() * 10 : p)
        }, 500)

        try {
            // const text = await new Promise((resolve, reject) => {
            //     const reader = new FileReader()
            //     reader.onload = (e) => resolve(e.target.result)
            //     reader.onerror = reject
            //     reader.readAsText(file)
            // })
            // let text = "";
            // if (file.type === "application/pdf") {
            //     text = await extractPDFText(file);
            // }
            // else {
            //     text = await file.text();
            // }
            const text = await extractTextFromFile(file)
            if (!text || text.trim().length < 50) {
                throw new Error('Could not extract text. Please use a text-based PDF or TXT file.')
            }
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
                        content: `You are an expert ATS (Applicant Tracking System) and resume analyst. Analyze this resume and respond ONLY with a JSON object (no markdown):
{
  "ats_score": <0-100>,
  "resume_score": <0-100>,
  "overall_rating": "<Excellent|Good|Average|Needs Work>",
  "strengths": ["up to 5 specific strengths"],
  "weaknesses": ["up to 5 specific weaknesses"],
  "missing_skills": ["skills commonly expected but missing"],
  "improvements": ["specific actionable improvement suggestions"],
  "keyword_density": "<High|Medium|Low>",
  "format_score": <0-100>,
  "summary": "<2-sentence overall assessment>"
}

Resume:
${text.slice(0, 8000)}`
                    }]
                })
            })

            const data = await response.json()
            clearInterval(progressInterval)
            setProgress(100)

            const raw = data.choices?.[0]?.message?.content || ''
            const match = raw.match(/\{[\s\S]*\}/)
            if (!match) throw new Error('Invalid response')
            setAnalysis(JSON.parse(match[0]))
            toast.success('Resume analyzed!')
        } catch (err) {
            clearInterval(progressInterval)
            toast.error('Analysis failed. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
            setTimeout(() => setProgress(0), 600)
        }
    }

    const ratingColor = (r) => ({ 'Excellent': '#10b981', 'Good': '#a855f7', 'Average': '#f59e0b', 'Needs Work': '#f43f5e' }[r] || '#a855f7')

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-2" />
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', marginBottom: '16px' }}>
                        <Target size={13} color="#f59e0b" />
                        <span style={{ color: '#f59e0b', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Powered</span>
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Resume <span className="gradient-text">Analyzer</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Get your ATS score, strengths, weaknesses, and AI-powered improvement suggestions</p>
                </div>

                {/* Upload + Action */}
                <div style={{ display: 'grid', gridTemplateColumns: analysis ? '320px 1fr' : '1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div
                            onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                            onClick={() => document.getElementById('analyzerFile').click()}
                            style={{
                                borderRadius: '20px', border: `2px dashed ${file ? 'rgba(245,158,11,0.5)' : 'var(--border-subtle)'}`,
                                background: file ? 'rgba(245,158,11,0.04)' : 'var(--bg-card)',
                                padding: '40px 28px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s'
                            }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: file ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '1px solid var(--border-subtle)' }}>
                                {file ? <FileText size={24} color="#f59e0b" /> : <Upload size={24} color="var(--text-secondary)" />}
                            </div>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                {file ? fileName : 'Upload Resume'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{file ? 'Click to change' : 'PDF or text file'}</p>
                            <input id="analyzerFile" type="file" accept=".pdf,.txt" onChange={handleFile} style={{ display: 'none' }} />
                        </div>

                        {loading && (
                            <div style={{ borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Analyzing resume...</span>
                                    <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600' }}>{Math.round(progress)}%</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #f59e0b, #f97316)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
                                </div>
                            </div>
                        )}

                        <button onClick={analyzeResume} disabled={!file || loading} className="btn-primary"
                            style={{ padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: !file ? 0.5 : 1, background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 4px 15px rgba(245,158,11,0.3)' }}>
                            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><Sparkles size={16} /> Analyze Resume</>}
                        </button>

                        {analysis && (
                            <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '18px' }}>
                                <div style={{ marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Quick Stats</div>
                                {[
                                    { label: 'Keyword Density', value: analysis.keyword_density },
                                    { label: 'Format Score', value: `${analysis.format_score}/100` },
                                    { label: 'Rating', value: analysis.overall_rating, color: ratingColor(analysis.overall_rating) },
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{s.label}</span>
                                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px', color: s.color || 'var(--text-primary)' }}>{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    {analysis && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Score rings */}
                            <div className="glass-card" style={{ borderRadius: '20px', padding: '28px' }}>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>Scores</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px' }}>
                                    <ScoreRing score={analysis.ats_score} label="ATS Score" color="#a855f7" size={120} />
                                    <ScoreRing score={analysis.resume_score} label="Resume Score" color="#f59e0b" size={120} />
                                    <ScoreRing score={analysis.format_score} label="Format Score" color="#10b981" size={120} />
                                </div>
                                {analysis.summary && (
                                    <div style={{ marginTop: '20px', padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.7' }}>{analysis.summary}</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <ListSection icon={<CheckCircle size={16} />} title="Strengths" items={analysis.strengths}
                                    color="#10b981" bgColor="rgba(16,185,129,0.12)" borderColor="rgba(16,185,129,0.2)" />
                                <ListSection icon={<XCircle size={16} />} title="Weaknesses" items={analysis.weaknesses}
                                    color="#f43f5e" bgColor="rgba(244,63,94,0.12)" borderColor="rgba(244,63,94,0.2)" />
                            </div>

                            {analysis.missing_skills?.length > 0 && (
                                <div style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid rgba(245,158,11,0.2)', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                                            <AlertCircle size={16} />
                                        </div>
                                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>Missing Skills</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {analysis.missing_skills.map((s, i) => <span key={i} className="tag tag-amber">{s}</span>)}
                                    </div>
                                </div>
                            )}

                            <ListSection icon={<Lightbulb size={16} />} title="Improvement Suggestions" items={analysis.improvements}
                                color="#a855f7" bgColor="rgba(168,85,247,0.12)" borderColor="rgba(168,85,247,0.2)" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
