import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import JobCard from './JobCard'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'
import useGetAllJobs from '../hooks/useGetAllJobs'
import { Search } from 'lucide-react'
const Browse = () => {
    useGetAllJobs()
    const { allJobs, searchedQuery } = useSelector(store => store.job)
    const dispatch = useDispatch()
    useEffect(() => {
        return () => { dispatch(setSearchedQuery('')) }
    }, [])
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-2" />

            {/* Responsive adjustments only - all original styles/markup untouched */}
            <style>{`
                @media (max-width: 640px) {
                    .browse-container { padding: 32px 16px !important; }
                    .browse-heading { font-size: 27px !important; }
                    .browse-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important; gap: 12px !important; }
                }

                @media (max-width: 420px) {
                    .browse-grid { grid-template-columns: 1fr !important; }
                    .browse-empty { padding: 56px 20px !important; }
                }
            `}</style>

            <div className="browse-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: '16px' }}>
                        <Search size={13} color="#a855f7" />
                        <span style={{ color: '#a855f7', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: '600' }}>Search Results</span>
                    </div>
                    <h1 className="browse-heading" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {searchedQuery ? <>Results for "<span className="gradient-text">{searchedQuery}</span>"</> : 'All Jobs'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                        {allJobs.length} positions available
                    </p>
                </div>
                {allJobs.length === 0 ? (
                    <div className="glass-card browse-empty" style={{ borderRadius: '20px', padding: '80px', textAlign: 'center' }}>
                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '22px', color: 'var(--text-primary)', marginBottom: '8px' }}>No jobs found</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Try a different search term.</p>
                    </div>
                ) : (
                    <div className="browse-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {allJobs.map((job, i) => (
                            <div key={job?._id} style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s forwards`, opacity: 0 }}>
                                <JobCard job={job} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
export default Browse
