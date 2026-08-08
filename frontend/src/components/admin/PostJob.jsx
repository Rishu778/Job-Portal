import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { JOB_API_END_POINT } from '../../utils/constant'
import { useNavigate } from 'react-router-dom'
import { Loader2, Briefcase, FileText, MapPin, DollarSign, Clock, Award, Users, Building, ArrowLeft } from 'lucide-react'

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

const PostJob = () => {
    const [input, setInput] = useState({
        title: '', description: '', requirements: '', salary: '',
        location: '', jobType: '', experienceLevel: '', position: 0, companyId: ''
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { companies } = useSelector(store => store.company)
    const { isMobile } = useViewport()

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value })
    const selectChangeHandler = (e) => {
        const selected = companies.find(c => c.name.toLowerCase() === e.target.value)
        if (selected) setInput({ ...input, companyId: selected._id })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            console.log("INPUT:", input);
            if (!input.companyId) {
                toast.error("Please select a company");
                return;
            }
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: { 'Content-Type': 'application/json' }, withCredentials: true
            })
            if (res.data.success) { toast.success(res.data.message); navigate('/admin/jobs') }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post job')
        } finally { setLoading(false) }
    }

    const fields = [
        { label: 'Job Title', name: 'title', type: 'text', icon: <Briefcase size={15} />, placeholder: 'e.g. Senior React Developer', col: 2 },
        { label: 'Description', name: 'description', type: 'text', icon: <FileText size={15} />, placeholder: 'Describe the role...', col: 2 },
        { label: 'Requirements', name: 'requirements', type: 'text', icon: <Award size={15} />, placeholder: 'Skills & qualifications...', col: 2 },
        { label: 'Location', name: 'location', type: 'text', icon: <MapPin size={15} />, placeholder: 'e.g. Bangalore, Remote', col: 1 },
        { label: 'Salary (LPA)', name: 'salary', type: 'text', icon: <DollarSign size={15} />, placeholder: 'e.g. 12', col: 1 },
        { label: 'Job Type', name: 'jobType', type: 'text', icon: <Clock size={15} />, placeholder: 'Full Time / Part Time', col: 1 },
        { label: 'Experience (Years)', name: 'experienceLevel', type: 'text', icon: <Award size={15} />, placeholder: 'e.g. 2-4', col: 1 },
        { label: 'No. of Positions', name: 'position', type: 'number', icon: <Users size={15} />, placeholder: '1', col: 1 },
    ]

    // Responsive size values derived from breakpoint, everything else identical
    const containerPadding = isMobile ? '32px 16px' : '48px 24px'
    const cardPadding = isMobile ? '24px 20px' : '40px'
    const titleFontSize = isMobile ? '24px' : '32px'
    const gridColumns = isMobile ? '1fr' : '1fr 1fr'
    const fullSpan = isMobile ? 'span 1' : 'span 2'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: containerPadding, position: 'relative', zIndex: 1 }}>
                <button onClick={() => navigate('/admin/jobs')} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
                    color: 'var(--text-secondary)', background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontFamily: 'Syne, sans-serif'
                }}>
                    <ArrowLeft size={16} /> Back to Jobs
                </button>

                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: titleFontSize, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Post a <span className="gradient-text">New Job</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Fill in the details to attract the right candidates</p>
                </div>

                <div className="glass-card" style={{ borderRadius: '24px', padding: cardPadding }}>
                    <form onSubmit={submitHandler}>
                        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '16px', marginBottom: '16px' }}>
                            {fields.map(f => (
                                <div key={f.name} style={{ gridColumn: f.col === 2 ? fullSpan : 'span 1' }}>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>{f.icon}</div>
                                        <input type={f.type} name={f.name} value={input[f.name]} onChange={changeEventHandler}
                                            placeholder={f.placeholder} className="dark-input" style={{ paddingLeft: '42px' }} />
                                    </div>
                                </div>
                            ))}

                            {/* Company Select */}
                            {companies.length > 0 && (
                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company</label>
                                    <div style={{ position: 'relative' }}>
                                        <Building size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        <select onChange={selectChangeHandler} className="dark-input" style={{ paddingLeft: '42px', appearance: 'none', cursor: 'pointer' }}>
                                            <option value="">Select company</option>
                                            {companies.map(c => <option key={c._id} value={c.name.toLowerCase()}>{c.name}</option>)}
                                        </select>
                                        {/* <select  className="dark-input" style={{ paddingLeft: '42px', appearance: 'none', cursor: 'pointer'}}
                                            name="companyId"
                                            value={input.companyId}
                                            onChange={(e) =>
                                                setInput({
                                                    ...input,
                                                    companyId: e.target.value
                                                })
                                            }
                                        >
                                            <option value="">Select company</option>

                                            {companies.map((company) => (
                                                <option
                                                    key={company._id}
                                                    value={company._id}
                                                >
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select> */}
                                    </div>
                                </div>
                            )}
                        </div>

                        {companies.length === 0 && (
                            <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', marginBottom: '20px' }}>
                                <p style={{ color: '#f43f5e', fontSize: '13px', fontWeight: '500' }}>
                                    ⚠️ Please register a company first before posting a job.
                                </p>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary"
                            style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Posting...</> : '🚀 Post Job'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob
