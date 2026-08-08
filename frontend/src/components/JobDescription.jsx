import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Badge } from './ui/badge'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '../utils/constant.js'
import { useDispatch, useSelector } from 'react-redux'
import { setSingleJob } from '../redux/jobSlice.js'
import store from '../redux/store.js'
import { toast } from 'sonner'
import { MapPin, Clock, DollarSign, Users, Calendar, Briefcase, CheckCircle, ArrowRight, Building } from 'lucide-react'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const isInitiallyApplied = singleJob?.applications?.some(app => app.applicant === user?._id) || false
    const [isApplied, setIsApplied] = useState(isInitiallyApplied)
    const { id: jobId } = useParams()
    const dispatch = useDispatch()

    const applyJobHandler = async () => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, { withCredentials: true })
            if (res.data.success) {
                setIsApplied(true)
                const updatedJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedJob))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Application failed')
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications.some(app => app.applicant === user?._id))
                }
            } catch (error) { console.log(error) }
        }
        fetchSingleJob()
    }, [jobId, dispatch, user?._id])

    const infoItems = [
        { icon: <Briefcase size={16} />, label: 'Role', value: singleJob?.title },
        { icon: <MapPin size={16} />, label: 'Location', value: singleJob?.location },
        { icon: <Clock size={16} />, label: 'Job Type', value: singleJob?.jobType },
        { icon: <DollarSign size={16} />, label: 'Salary', value: `${singleJob?.salary} LPA` },
        { icon: <Users size={16} />, label: 'Experience', value: `${singleJob?.experienceLevel} years` },
        { icon: <Users size={16} />, label: 'Applications', value: singleJob?.applications?.length },
        { icon: <Calendar size={16} />, label: 'Posted', value: singleJob?.createdAt?.split('T')[0] },
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />

            {/* Responsive adjustments only - all original styles/markup untouched */}
            <style>{`
                @media (max-width: 900px) {
                    .jd-container { padding: 36px 18px !important; }
                    .jd-grid { grid-template-columns: 1fr !important; }
                    .jd-sidebar { position: static !important; top: auto !important; }
                }

                @media (max-width: 560px) {
                    .jd-container { padding: 28px 14px !important; }
                    .jd-header-card { padding: 22px !important; }
                    .jd-header-top { flex-wrap: wrap; }
                    .jd-company-logo { width: 52px !important; height: 52px !important; }
                    .jd-title { font-size: 19px !important; }
                    .jd-req-card { padding: 20px !important; }
                    .jd-apply-card { padding: 20px !important; }
                    .jd-details-card { padding: 18px !important; }
                }
            `}</style>

            <div className="jd-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
                <div className="jd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div>
                        {/* Header Card */}
                        <div className="glass-card jd-header-card" style={{ borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
                            <div className="jd-header-top" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                <div className="jd-company-logo" style={{
                                    width: '64px', height: '64px', borderRadius: '16px',
                                    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                                }}>
                                    {singleJob?.company?.logo
                                        ? <img src={singleJob.company.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <Building size={28} color="#a855f7" />
                                    }
                                </div>
                                <div>
                                    <h2 className="jd-title" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '22px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                        {singleJob?.title}
                                    </h2>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Building size={13} /> {singleJob?.company?.name}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                <span className="tag tag-violet"><Users size={11} style={{ marginRight: '4px' }} /> {singleJob?.position} Positions</span>
                                <span className="tag tag-emerald"><Clock size={11} style={{ marginRight: '4px' }} /> {singleJob?.jobType}</span>
                                <span className="tag tag-amber"><DollarSign size={11} style={{ marginRight: '4px' }} /> {singleJob?.salary} LPA</span>
                            </div>

                            <div className="divider" />

                            <div style={{ marginTop: '24px' }}>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>About This Role</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '14px' }}>{singleJob?.description}</p>
                            </div>
                        </div>

                        {/* Requirements */}
                        {singleJob?.requirements && (
                            <div className="glass-card jd-req-card" style={{ borderRadius: '20px', padding: '28px' }}>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>Requirements</h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {(Array.isArray(singleJob.requirements) ? singleJob.requirements : [singleJob.requirements]).map((req, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            <CheckCircle size={16} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} /> {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="jd-sidebar" style={{ position: 'sticky', top: '88px' }}>
                        {/* Apply card */}
                        <div className="glass-card jd-apply-card" style={{ borderRadius: '20px', padding: '28px', marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                                {isApplied ? '✅ Applied' : 'Ready to Apply?'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                                {isApplied ? 'Your application has been submitted.' : 'Take the next step in your career journey.'}
                            </p>
                            <button onClick={isApplied ? null : applyJobHandler} disabled={isApplied}
                                className={isApplied ? 'btn-secondary' : 'btn-primary'}
                                style={{
                                    width: '100%', padding: '14px', fontSize: '15px', cursor: isApplied ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}>
                                {isApplied ? 'Already Applied' : <><span>Apply Now</span> <ArrowRight size={16} /></>}
                            </button>
                        </div>

                        {/* Job details */}
                        <div className="glass-card jd-details-card" style={{ borderRadius: '20px', padding: '24px' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Job Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {infoItems.map((item, i) => item.value && (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '34px', height: '34px', borderRadius: '10px',
                                            background: 'rgba(124,58,237,0.1)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', color: '#a855f7', flexShrink: 0
                                        }}>{item.icon}</div>
                                        <div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                                            <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500', fontFamily: 'Syne, sans-serif' }}>{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription
