import React, { useEffect, useState } from 'react'
import { Edit2, Building, Calendar, MoreHorizontal } from 'lucide-react'
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

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company)
    const [filterCompany, setFilterCompany] = useState([])
    const navigate = useNavigate()
    const { isMobile, isTablet } = useViewport()

    useEffect(() => {
        const filtered = companies.filter(c =>
            !searchCompanyByText || c?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
        )
        setFilterCompany(filtered)
    }, [companies, searchCompanyByText])

    const headerStyle = { color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '12px 20px' }

    // Responsive grid: collapse the "Registered" column on small screens, keep everything else identical.
    // A min-width is applied on mobile so the table scrolls horizontally within its overflow-x wrapper
    // instead of squashing the Company column.
    const gridColumns = isMobile ? '52px 1fr auto' : isTablet ? '56px 1fr 1fr auto' : '60px 1fr 1fr auto'
    const rowMinWidth = isMobile ? '480px' : 'auto'
    const cellPadding = isMobile ? '14px 14px' : '16px 20px'

    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: rowMinWidth }}>
                <div style={{ display: 'grid', gridTemplateColumns: gridColumns, borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ ...headerStyle, padding: cellPadding }}>Logo</div>
                    <div style={{ ...headerStyle, padding: cellPadding }}>Company</div>
                    {!isMobile && <div style={{ ...headerStyle, padding: cellPadding }}>Registered</div>}
                    <div style={{ ...headerStyle, padding: cellPadding, textAlign: 'right' }}>Action</div>
                </div>

                {filterCompany.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Building size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p>No companies found</p>
                    </div>
                ) : filterCompany.map((company, i) => (
                    <div key={company._id} style={{
                        display: 'grid', gridTemplateColumns: gridColumns,
                        alignItems: 'center', minWidth: rowMinWidth,
                        borderBottom: i < filterCompany.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ padding: cellPadding }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {company?.logo
                                    ? <img src={company.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '14px', color: '#a855f7' }}>{company?.name?.[0]}</span>
                                }
                            </div>
                        </div>
                        <div style={{ padding: cellPadding }}>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{company?.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>{company?.location || 'No location set'}</div>
                        </div>
                        {!isMobile && (
                            <div style={{ padding: cellPadding, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                <Calendar size={13} /> {company.createdAt?.split('T')[0]}
                            </div>
                        )}
                        <div style={{ padding: cellPadding }}>
                            <button onClick={() =>{ navigate(`/admin/companies/${company._id}`);}  } style={{
                                display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
                                borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent',
                                color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer',
                                fontFamily: 'Syne, sans-serif', fontWeight: '500', transition: 'all 0.2s'
                            }}  
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.color = '#a855f7' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                                <Edit2 size={13} /> Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CompaniesTable
