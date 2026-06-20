import React from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'

const LatestJobs = () => {
    const navigate = useNavigate()
    const { allJobs } = useSelector(store => store.job)

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '14px' }}>
                        <TrendingUp size={13} color="#f59e0b" />
                        <span style={{ color: '#f59e0b', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hot Openings</span>
                    </div>
                    <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '36px', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                        Latest & Top<br />
                        <span className="gradient-text">Job Openings</span>
                    </h2>
                </div>
                <button onClick={() => navigate('/jobs')} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                    border: '1px solid var(--border-subtle)', background: 'var(--bg-card)',
                    color: 'var(--text-secondary)', fontSize: '14px', fontFamily: 'Syne, sans-serif', fontWeight: '600',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.color = '#a855f7' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                    View All Jobs <ArrowRight size={15} />
                </button>
            </div>

            {allJobs.length === 0 ? (
                <div className="glass-card" style={{ borderRadius: '20px', padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>No jobs available right now. Check back soon!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
                    {allJobs.slice(0, 6).map((job, i) => (
                        <div key={job._id} style={{ animation: `fadeUp 0.5s ease ${i * 0.08}s forwards`, opacity: 0 }}>
                            <LatestJobCards job={job} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LatestJobs
