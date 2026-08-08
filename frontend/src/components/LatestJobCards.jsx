import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, Users, ArrowRight } from 'lucide-react'
const LatestJobCards = ({ job }) => {
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(`/description/${job._id}`)}
            className="glass-card latestjobcard-root"
            style={{ borderRadius: '18px', padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Responsive adjustments only - all original styles/markup untouched */}
            <style>{`
                @media (max-width: 480px) {
                    .latestjobcard-root { padding: 16px !important; border-radius: 14px !important; }
                    .latestjobcard-logo { width: 38px !important; height: 38px !important; }
                    .latestjobcard-title { font-size: 14px !important; }
                }

                @media (max-width: 360px) {
                    .latestjobcard-company-name { font-size: 13px !important; }
                    .latestjobcard-tags span { font-size: 10px !important; }
                }
            `}</style>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="latestjobcard-logo" style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                }}>
                    {job?.company?.logo
                        ? <img src={job.company.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '16px', color: '#a855f7' }}>{job?.company?.name?.[0]}</span>
                    }
                </div>
                <div>
                    <div className="latestjobcard-company-name" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{job?.company?.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        <MapPin size={10} /> India
                    </div>
                </div>
            </div>
            <div>
                <h3 className="latestjobcard-title" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px' }}>{job?.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job?.description}</p>
            </div>
            <div className="latestjobcard-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span className="tag tag-violet"><Users size={10} style={{ marginRight: '3px' }} />{job?.position} Positions</span>
                <span className="tag tag-emerald">{job?.jobType}</span>
                <span className="tag tag-amber"><DollarSign size={10} style={{ marginRight: '3px' }} />{job?.salary} LPA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: '600' }}>
                View Job <ArrowRight size={13} />
            </div>
        </div>
    )
}
export default LatestJobCards
