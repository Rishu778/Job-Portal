import React from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '../../utils/constant'
import { toast } from 'sonner'
import { FileText, Mail, Phone, Calendar, CheckCircle, XCircle, ExternalLink, User } from 'lucide-react'

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application)

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true })
            if (res.data.success) toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Status update failed')
        }
    }

    const headerStyle = { color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '12px 20px' }

    if (!applicants?.applications?.length) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>No applicants yet for this position.</p>
            </div>
        )
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 1fr 120px 140px', borderBottom: '1px solid var(--border-subtle)', minWidth: '900px' }}>
                {['Name', 'Email', 'Phone', 'Resume', 'Applied', 'Action'].map((h, i) => (
                    <div key={h} style={{ ...headerStyle, textAlign: i === 5 ? 'center' : 'left' }}>{h}</div>
                ))}
            </div>

            {applicants.applications.map((item, i) => (
                <div key={item._id} style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 140px 1fr 120px 140px',
                    alignItems: 'center', minWidth: '900px',
                    borderBottom: i < applicants.applications.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <User size={14} color="white" />
                        </div>
                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px' }}>{item?.applicant?.fullname}</span>
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        <Mail size={12} /> {item?.applicant?.email}
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        <Phone size={12} /> {item?.applicant?.phoneNumber}
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                        {item?.applicant?.profile?.resume
                            ? <a href={item.applicant.profile.resume} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
                                <FileText size={13} /> {item.applicant.profile.resumeOriginalName || 'Resume'} <ExternalLink size={11} />
                            </a>
                            : <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Not uploaded</span>
                        }
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        <Calendar size={12} /> {item?.applicant?.createdAt?.split('T')[0]}
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => statusHandler('Accepted', item?._id)} style={{
                            display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px',
                            borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)',
                            color: '#10b981', fontSize: '11px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: '600',
                            transition: 'all 0.2s'
                        }}>
                            <CheckCircle size={12} /> Accept
                        </button>
                        <button onClick={() => statusHandler('Rejected', item?._id)} style={{
                            display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px',
                            borderRadius: '8px', border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.08)',
                            color: '#f43f5e', fontSize: '11px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: '600',
                            transition: 'all 0.2s'
                        }}>
                            <XCircle size={12} /> Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ApplicantsTable
