import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import JobCard from './JobCard'
import Footer from './Footer'
import { useSelector } from 'react-redux'
import { Search, SlidersHorizontal } from 'lucide-react'

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job)
    const [filterJobs, setFilterJobs] = useState(allJobs)
    const [showFilter, setShowFilter] = useState(true)

    useEffect(() => {
        if (searchedQuery) {
            const filtered = allJobs.filter(job =>
                job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            )
            setFilterJobs(filtered)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />

            {/* Responsive adjustments only - all original styles/markup untouched */}
            <style>{`
                @media (max-width: 900px) {
                    .jobs-page-container { padding: 32px 18px !important; }
                    .jobs-layout { flex-direction: column !important; }
                }

                @media (max-width: 640px) {
                    .jobs-page-container { padding: 24px 14px !important; }
                    .jobs-header-title { font-size: 26px !important; }
                    .jobs-toolbar { flex-wrap: wrap; gap: 10px; }
                    .jobs-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important; gap: 12px !important; }
                }

                @media (max-width: 420px) {
                    .jobs-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <div className="jobs-page-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
                {/* Page Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 className="jobs-header-title" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Browse <span className="gradient-text">Jobs</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                        {filterJobs.length} opportunities found
                        {searchedQuery && <span> for "<span style={{ color: '#a855f7' }}>{searchedQuery}</span>"</span>}
                    </p>
                </div>

                <div className="jobs-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    {/* Filter sidebar */}
                    {showFilter && <FilterCard />}

                    {/* Jobs Grid */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Toolbar */}
                        <div className="jobs-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <button onClick={() => setShowFilter(!showFilter)} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
                                border: '1px solid var(--border-subtle)', background: showFilter ? 'rgba(124,58,237,0.1)' : 'var(--bg-card)',
                                color: showFilter ? '#a855f7' : 'var(--text-secondary)', fontSize: '13px',
                                fontFamily: 'Syne, sans-serif', fontWeight: '600', transition: 'all 0.2s'
                            }}>
                                <SlidersHorizontal size={14} /> {showFilter ? 'Hide Filters' : 'Show Filters'}
                            </button>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{filterJobs.length} results</span>
                        </div>

                        {filterJobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>No jobs found</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search query.</p>
                            </div>
                        ) : (
                            <div className="jobs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                {filterJobs.map(job => (
                                    <div key={job?._id} style={{ animation: 'fadeUp 0.4s ease forwards' }}>
                                        <JobCard job={job} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Jobs
