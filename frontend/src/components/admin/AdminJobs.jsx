import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '../../hooks/UseGetAllAdminJobs'
import { setSearchJobByText } from '../../redux/jobSlice'
import { Plus, Search, Briefcase } from 'lucide-react'

const AdminJobs = () => {
    useGetAllAdminJobs()
    const [input, setInput] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => { dispatch(setSearchJobByText(input)) }, [input])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-2" />
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Briefcase size={18} color="#f59e0b" />
                            </div>
                            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)' }}>Posted Jobs</h1>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage your job listings</p>
                    </div>
                    <button onClick={() => navigate('/admin/jobs/create')} className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', fontSize: '14px' }}>
                        <Plus size={16} /> Post New Job
                    </button>
                </div>

                <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '360px' }}>
                    <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input placeholder="Filter by name or role..." onChange={e => setInput(e.target.value)} className="dark-input" style={{ paddingLeft: '42px' }} />
                </div>

                <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <AdminJobsTable />
                </div>
            </div>
        </div>
    )
}

export default AdminJobs
