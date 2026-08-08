import React from 'react'
import { useSelector } from 'react-redux'
import { Calendar, Building, Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react'

const statusConfig = {
    accepted: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: <CheckCircle size={13} />, label: 'Accepted' },
    rejected: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.25)', icon: <XCircle size={13} />, label: 'Rejected' },
    pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: <Clock size={13} />, label: 'Pending' },
}

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job)

    if (!allAppliedJobs.length) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>You haven't applied to any jobs yet.</p>
            </div>
        )
    }

    return (
        <div className="ajt-scroll" style={{ overflowX: 'auto' }}>
            {/* Responsive adjustments only - all original styles/markup untouched.
                Columns keep a minimum width on small screens so the table scrolls
                horizontally instead of squashing its content. */}
            <style>{`
                @media (max-width: 640px) {
                    .ajt-scroll { margin: 0 -4px; padding: 0 4px; }
                    .ajt-header, .ajt-row { min-width: 560px; }
                }
            `}</style>

            {/* Header */}
            <div className="ajt-header" style={{
                display: 'grid', gridTemplateColumns: '120px 1fr 1fr 110px',
                gap: '16px', padding: '10px 16px', marginBottom: '8px',
                color: 'var(--text-secondary)', fontSize: '11px',
                fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px'
            }}>
                <span>Date</span>
                <span>Role</span>
                <span>Company</span>
                <span style={{ textAlign: 'right' }}>Status</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {allAppliedJobs.map((appliedJob) => {
                    const s = statusConfig[appliedJob.status] || statusConfig.pending
                    return (
                        <div key={appliedJob?._id} className="ajt-row" style={{
                            display: 'grid', gridTemplateColumns: '120px 1fr 1fr 110px',
                            gap: '16px', padding: '14px 16px', borderRadius: '12px',
                            background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                            alignItems: 'center', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                <Calendar size={12} /> {appliedJob.createdAt.split('T')[0]}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Briefcase size={13} color="#a855f7" />
                                </div>
                                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{appliedJob.job.title}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                <Building size={13} /> {appliedJob.job.company.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                    padding: '5px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '600',
                                    color: s.color, background: s.bg, border: `1px solid ${s.border}`,
                                    fontFamily: 'Syne, sans-serif'
                                }}>
                                    {s.icon} {s.label}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AppliedJobTable
