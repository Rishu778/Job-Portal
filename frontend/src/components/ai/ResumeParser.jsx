import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Upload, Sparkles, User, Mail, Phone, Code, Briefcase, GraduationCap, FolderOpen, CheckCircle, Loader2, FileText, ArrowRight, Copy, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant.js'
import { toast } from 'sonner'
import store from '../../redux/store'
import { extractTextFromFile } from '../../utils/pdfReader.js'

const sectionConfig = [
    { key: 'name',       label: 'Full Name',   icon: <User size={15} />,          color: '#a855f7' },
    { key: 'email',      label: 'Email',       icon: <Mail size={15} />,          color: '#3b82f6' },
    { key: 'phone',      label: 'Phone',       icon: <Phone size={15} />,         color: '#10b981' },
    { key: 'skills',     label: 'Skills',      icon: <Code size={15} />,          color: '#f59e0b' },
    { key: 'experience', label: 'Experience',  icon: <Briefcase size={15} />,     color: '#f43f5e' },
    { key: 'education',  label: 'Education',   icon: <GraduationCap size={15} />, color: '#8b5cf6' },
    { key: 'projects',   label: 'Projects',    icon: <FolderOpen size={15} />,    color: '#06b6d4' },
]

function safeParseJSON(raw) {
    try {
        let cleaned = raw
            .replace(/```json/gi, '')
            .replace(/```/gi, '')
            .trim()
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (!match) return null
        return JSON.parse(match[0])
    } catch (error) {
        console.error("safeParseJSON failed:", error)
        return null
    }
}

export default function ResumeParser() {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [loading, setLoading] = useState(false)
    const [parsed, setParsed] = useState(null)
    const [copiedKey, setCopiedKey] = useState(null)
    const [autoFilled, setAutoFilled] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleFile = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f); setFileName(f.name); setParsed(null); setAutoFilled(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const f = e.dataTransfer.files?.[0]
        if (f) { setFile(f); setFileName(f.name); setParsed(null); setAutoFilled(false) }
    }

    const parseResume = async () => {
        if (!file) return toast.error('Please upload a resume first')
        setLoading(true); setProgress(0)
        const progressInterval = setInterval(() => {
            setProgress(p => p < 85 ? p + Math.random() * 12 : p)
        }, 400)
        try {
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
                    model: 'openai/gpt-oss-120b',
                    max_tokens: 2000,
                    messages: [{
                        role: 'user',
                        content: `You are a professional resume parser. Extract structured information from this resume text. IMPORTANT: Respond with RAW JSON only — absolutely no markdown, no code fences, no backticks, no explanation. Start your response directly with {
{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": [{"company": "","role": "","duration": "","description": ""}],
  "education": [{"institution": "","degree": "","year": ""}],
  "projects": [{"name": "","description": "","tech": ""}]
}

Resume Text:
${text.slice(0, 8000)}`
                    }]
                })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error?.message || "Groq API Error")
            const rawText = data?.choices?.[0]?.message?.content || ""
            clearInterval(progressInterval)
            setProgress(100)
            const result = safeParseJSON(rawText)
            if (!result) throw new Error('Could not extract structured data')
            setParsed(result)
            toast.success('Resume parsed successfully!')
        } catch (err) {
            clearInterval(progressInterval)
            toast.error('Parsing failed. Make sure the resume is readable text.')
            console.error(err)
        } finally {
            setLoading(false)
            setTimeout(() => setProgress(0), 600)
        }
    }

    const autoFillProfile = async () => {
        if (!parsed) return
        try {
            const formData = new FormData()
            if (parsed.name) formData.append('fullname', parsed.name)
            if (parsed.email) formData.append('email', parsed.email)
            if (parsed.phone) formData.append('phoneNumber', parsed.phone)
            if (parsed.skills?.length) formData.append('skills', parsed.skills.join(', '))
            const roleStr = parsed.experience?.[0]?.role || ''
            const companyStr = parsed.experience?.[0]?.company ? `at ${parsed.experience[0].company}` : ''
            const degreeStr = parsed.education?.[0]?.degree || ''
            const institutionStr = parsed.education?.[0]?.institution ? `from ${parsed.education[0].institution}` : ''
            const skillsStr = parsed.skills?.slice(0, 4).join(', ') || ''
            const projectCount = parsed.projects?.length || 0
            let bio = ''
            if (roleStr) bio += `${roleStr}${companyStr ? ' ' + companyStr : ''}. `
            if (degreeStr) bio += `${degreeStr}${institutionStr ? ' ' + institutionStr : ''}. `
            if (skillsStr) bio += `Skilled in ${skillsStr}. `
            if (projectCount > 0) bio += `${projectCount} notable project${projectCount > 1 ? 's' : ''} on record.`
            if (!bio) bio = `Professional with expertise in ${skillsStr || 'various technologies'}.`
            formData.append('bio', bio.trim())
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user)); setAutoFilled(true)
                toast.success('Profile auto-filled successfully!')
            }
        } catch (err) { toast.error('Could not auto-fill profile') }
    }

    const copyValue = (key, val) => {
        navigator.clipboard.writeText(Array.isArray(val) ? val.join(', ') : val)
        setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000)
    }

    const renderValue = (key, value) => {
        if (!value || (Array.isArray(value) && !value.length))
            return <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Not found</span>
        if (key === 'skills' && Array.isArray(value))
            return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {value.map((s, i) => <span key={i} className="tag tag-violet">{s}</span>)}
            </div>
        if (key === 'experience' && Array.isArray(value))
            return <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                {value.map((e, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px' }}>{e.role} {e.company && `@ ${e.company}`}</div>
                        {e.duration && <div style={{ color: '#a855f7', fontSize: '12px', marginTop: '2px' }}>{e.duration}</div>}
                        {e.description && <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>{e.description}</div>}
                    </div>
                ))}
            </div>
        if (key === 'education' && Array.isArray(value))
            return <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                {value.map((e, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px' }}>{e.degree}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{e.institution} {e.year && `• ${e.year}`}</div>
                    </div>
                ))}
            </div>
        if (key === 'projects' && Array.isArray(value))
            return <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                {value.map((p, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px' }}>{p.name}</div>
                        {p.tech && <div style={{ color: '#f59e0b', fontSize: '12px', marginTop: '2px' }}>{p.tech}</div>}
                        {p.description && <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>{p.description}</div>}
                    </div>
                ))}
            </div>
        return <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{String(value)}</span>
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
            <Navbar />
            <div className="orb orb-1" />

            <style>{`
                .parser-wrapper {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 48px 24px;
                    position: relative;
                    z-index: 1;
                }
                .parser-title {
                    font-size: 36px;
                }
                .parser-main-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                .parser-main-grid-single {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                }
                .parser-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                .parser-dropzone {
                    padding: 48px 32px;
                }
                @media (max-width: 768px) {
                    .parser-wrapper {
                        padding: 32px 16px !important;
                    }
                    .parser-title {
                        font-size: 26px !important;
                    }
                    .parser-main-grid {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    .parser-dropzone {
                        padding: 32px 20px !important;
                    }
                }
                @media (max-width: 480px) {
                    .parser-wrapper {
                        padding: 24px 12px !important;
                    }
                    .parser-title {
                        font-size: 22px !important;
                    }
                    .parser-info-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 8px !important;
                    }
                    .parser-dropzone {
                        padding: 24px 16px !important;
                    }
                }
            `}</style>

            <div className="parser-wrapper">
                {/* Header */}
                <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', marginBottom: '16px' }}>
                        <Sparkles size={13} color="#a855f7" />
                        <span style={{ color: '#a855f7', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Powered</span>
                    </div>
                    <h1 className="parser-title" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Resume <span className="gradient-text">Parser</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Upload your resume and let AI extract all key information automatically</p>
                </div>

                <div className={parsed ? 'parser-main-grid' : 'parser-main-grid-single'}>
                    {/* Left Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Drop Zone */}
                        <div
                            className="parser-dropzone"
                            onDrop={handleDrop}
                            onDragOver={e => e.preventDefault()}
                            onClick={() => document.getElementById('resumeFileInput').click()}
                            style={{
                                borderRadius: '20px',
                                border: `2px dashed ${file ? 'rgba(124,58,237,0.6)' : 'var(--border-subtle)'}`,
                                background: file ? 'rgba(124,58,237,0.05)' : 'var(--bg-card)',
                                textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s'
                            }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: file ? 'rgba(124,58,237,0.15)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--border-subtle)' }}>
                                {file ? <FileText size={28} color="#a855f7" /> : <Upload size={28} color="var(--text-secondary)" />}
                            </div>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                                {file ? fileName : 'Drop your resume here'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                                {file ? 'Click to change file' : 'PDF or text file — click to browse'}
                            </p>
                            <input id="resumeFileInput" type="file" accept=".pdf,.txt,.doc" onChange={handleFile} style={{ display: 'none' }} />
                        </div>

                        {/* Progress Bar */}
                        {loading && (
                            <div style={{ borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Parsing resume...</span>
                                    <span style={{ color: '#a855f7', fontSize: '12px', fontWeight: '600' }}>{Math.round(progress)}%</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
                                </div>
                            </div>
                        )}

                        {/* Parse Button */}
                        <button onClick={parseResume} disabled={!file || loading} className="btn-primary"
                            style={{ padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: !file ? 0.5 : 1, width: '100%', boxSizing: 'border-box' }}>
                            {loading ? <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Parsing...</> : <><Sparkles size={17} /> Parse Resume</>}
                        </button>

                        {/* Auto Fill Button */}
                        {parsed && (
                            <button onClick={autoFillProfile} disabled={autoFilled}
                                style={{
                                    padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    borderRadius: '12px', border: `1px solid ${autoFilled ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.3)'}`,
                                    background: autoFilled ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)',
                                    color: '#10b981', cursor: autoFilled ? 'default' : 'pointer',
                                    fontFamily: 'Syne, sans-serif', fontWeight: '600', transition: 'all 0.2s',
                                    width: '100%', boxSizing: 'border-box'
                                }}>
                                {autoFilled ? <><CheckCircle size={17} /> Profile Updated!</> : <><ArrowRight size={17} /> Auto-Fill My Profile</>}
                            </button>
                        )}

                        {/* Info Cards */}
                        <div className="parser-info-grid">
                            {[
                                { icon: '🔒', title: 'Private', desc: 'Your data stays secure' },
                                { icon: '⚡', title: 'Instant', desc: 'Results in seconds' },
                                { icon: '🎯', title: 'Accurate', desc: 'AI-powered extraction' },
                                { icon: '🔄', title: 'Auto-Fill', desc: 'Populate your profile' }
                            ].map((c, i) => (
                                <div key={i} style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>{c.icon}</div>
                                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{c.title}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{c.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel — Results */}
                    {parsed && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '80vh', overflowY: 'auto', paddingRight: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <CheckCircle size={18} color="#10b981" />
                                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>Extracted Information</span>
                            </div>
                            {sectionConfig.map(({ key, label, icon, color }) => (
                                <div key={key} style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
                                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                                        </div>
                                        {parsed[key] && !Array.isArray(parsed[key]) && (
                                            <button onClick={() => copyValue(key, parsed[key])} style={{ width: '28px', height: '28px', borderRadius: '7px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                                {copiedKey === key ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                                            </button>
                                        )}
                                    </div>
                                    {renderValue(key, parsed[key])}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
