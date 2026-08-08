import React, { useEffect, useState } from 'react'
import { Edit2, Eye, Calendar, Building } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

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

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job)
    const [filterJobs, setFilterJobs] = useState(allAdminJobs)
    const navigate = useNavigate()
    const { isMobile, isTablet } = useViewport()

    useEffect(() => {
        const filtered = allAdminJobs.filter(job =>
            !searchJobByText ||
            job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
            job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
        )
        setFilterJobs(filtered)
    }, [allAdminJobs, searchJobByText])

    const headerStyle = { color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '12px 20px' }

    // Responsive grid: collapse the "Posted" column on small/tablet screens, keep everything else identical.
    // A min-width is applied on small screens so the table scrolls horizontally within its overflow-x wrapper
    // instead of squashing content.
    const gridColumns = isMobile ? '1fr 1fr auto' : isTablet ? '1fr 1fr 120px auto' : '1fr 1fr 140px auto'
    const rowMinWidth = isMobile ? '600px' : isTablet ? '700px' : 'auto'
    const cellPadding = isMobile ? '14px 14px' : '16px 20px'
    const headerCellPadding = isMobile ? '12px 14px' : '12px 20px'

    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: rowMinWidth }}>
                <div style={{ display: 'grid', gridTemplateColumns: gridColumns, borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ ...headerStyle, padding: headerCellPadding }}>Company</div>
                    <div style={{ ...headerStyle, padding: headerCellPadding }}>Role</div>
                    {!isMobile && <div style={{ ...headerStyle, padding: headerCellPadding }}>Posted</div>}
                    <div style={{ ...headerStyle, padding: headerCellPadding, textAlign: 'right' }}>Actions</div>
                </div>

                {filterJobs.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>No jobs found</p>
                    </div>
                ) : filterJobs.map((job, i) => (
                    <div key={job._id} style={{
                        display: 'grid', gridTemplateColumns: gridColumns,
                        alignItems: 'center',
                        borderBottom: i < filterJobs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ padding: cellPadding, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Building size={14} color="#a855f7" />
                            </div>
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{job?.company?.name}</span>
                        </div>
                        <div style={{ padding: cellPadding }}>
                            <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{job?.title}</span>
                            {job?.jobType && <div style={{ marginTop: '3px' }}><span className="tag tag-emerald" style={{ fontSize: '11px' }}>{job.jobType}</span></div>}
                        </div>
                        {!isMobile && (
                            <div style={{ padding: cellPadding, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                <Calendar size={13} /> {job?.createdAt?.split('T')[0]}
                            </div>
                        )}
                        <div style={{ padding: cellPadding, display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <button onClick={() => navigate(`/admin/companies/${job.company._id}`)} style={{
                                display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px',
                                borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent',
                                color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.color = '#a855f7' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                                <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} style={{
                                display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px',
                                borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)',
                                color: '#10b981', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                <Eye size={12} /> Applicants
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminJobsTable
