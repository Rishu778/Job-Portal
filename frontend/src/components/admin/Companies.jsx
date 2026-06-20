import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '../../hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '../../redux/companySlice'
import { Plus, Search, Building } from 'lucide-react'
import { useSelector } from 'react-redux';

const Companies = () => {
    useGetAllCompanies()
    const [input, setInput] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { companies } = useSelector(store => store.company);

    useEffect(() => { dispatch(setSearchCompanyByText(input)) }, [input])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building size={18} color="#a855f7" />
                            </div>
                            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)' }}>Companies</h1>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage your registered companies</p>
                    </div>
                    <button onClick={() => navigate('/admin/companies/create')} className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', fontSize: '14px' }}>
                        <Plus size={16} /> New Company
                    </button>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '360px' }}>
                    <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        placeholder="Filter by company name..."
                        onChange={e => setInput(e.target.value)}
                        className="dark-input" style={{ paddingLeft: '42px' }}
                    />
                </div>

                <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <CompaniesTable />
                </div>
            </div>
        </div>
    )
}

export default Companies
