import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, MapPin, Clock, DollarSign, Users, ArrowRight } from 'lucide-react'

const JobCard = ({ job }) => {
    const navigate = useNavigate()
    const [saved, setSaved] = useState(false)

    const dayAgoFunction = (mongodbTime) => {
        const diff = new Date() - new Date(mongodbTime)
        const days = Math.floor(diff / (1000 * 24 * 60 * 60))
        return days === 0 ? 'Today' : `${days}d ago`
    }

    const typeColors = {
        'Full Time': { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
        'Part Time': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
        'Contract': { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.25)' },
        'Remote': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
    }
    const tc = typeColors[job?.jobType] || typeColors['Full Time']

    return (
        <div className="glass-card" style={{
            borderRadius: '20px', padding: '24px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: '16px',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Company logo */}
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                    }}>
                        {job?.company?.logo
                            ? <img src={job.company.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '18px', color: '#a855f7' }}>
                                {job?.company?.name?.[0] || 'C'}
                            </span>
                        }
                    </div>
                    <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '15px' }}>{job?.company?.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>
                            <MapPin size={11} /> India
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{dayAgoFunction(job?.createdAt)}</span>
                    <button onClick={(e) => { e.stopPropagation(); setSaved(!saved) }} style={{
                        width: '34px', height: '34px', borderRadius: '10px',
                        border: '1px solid var(--border-subtle)', background: saved ? 'rgba(124,58,237,0.1)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        color: saved ? '#a855f7' : 'var(--text-secondary)', transition: 'all 0.2s'
                    }}>
                        <Bookmark size={15} fill={saved ? '#a855f7' : 'none'} />
                    </button>
                </div>
            </div>

            {/* Job title & desc */}
            <div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '17px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {job?.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job?.description}
                </p>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '500', color: tc.color, background: tc.bg, border: `1px solid ${tc.border}` }}>
                    {job?.jobType}
                </span>
                <span className="tag tag-violet">
                    <Users size={11} style={{ marginRight: '4px' }} />{job?.position} Positions
                </span>
                <span className="tag tag-amber">
                    <DollarSign size={11} style={{ marginRight: '4px' }} />{job?.salary} LPA
                </span>
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate(`/description/${job?._id}`)} className="btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    View Details <ArrowRight size={14} />
                </button>
                <button onClick={() => navigate(`/description/${job?._id}`)} className="btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '13px' }}>
                    Save
                </button>
            </div>
        </div>
    )
}

export default JobCard
