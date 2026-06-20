import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '../../utils/constant.js'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '../../redux/companySlice'
import { Building, ArrowLeft, ArrowRight } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate()
    const [companyName, setCompanyName] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const registerNewCompany = async () => {
        if (!companyName.trim()) return toast.error('Please enter a company name')
        try {
            setLoading(true)
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { name: companyName }, {
                headers: { 'Content-Type': 'application/json' }, withCredentials: true
            })
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company))
                toast.success(res.data.message)
                navigate(`/admin/companies/${res?.data?.company?._id}`)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed')
        } finally { setLoading(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '100%', maxWidth: '500px' }}>
                    <button onClick={() => navigate('/admin/companies')} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
                        color: 'var(--text-secondary)', background: 'transparent', border: 'none',
                        cursor: 'pointer', fontSize: '14px', fontFamily: 'Syne, sans-serif'
                    }}>
                        <ArrowLeft size={16} /> Back to Companies
                    </button>

                    <div className="glass-card" style={{ borderRadius: '24px', padding: '48px 40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 16px', boxShadow: '0 8px 25px rgba(124,58,237,0.4)'
                            }}>
                                <Building size={24} color="white" />
                            </div>
                            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '26px', color: 'var(--text-primary)', marginBottom: '8px' }}>Register a Company</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                                What would you like to name your company? You can always change it later.
                            </p>
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company Name</label>
                            <input type="text" placeholder="e.g. Google, Microsoft, Startup Inc." value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && registerNewCompany()}
                                className="dark-input" />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => navigate('/admin/companies')} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                            <button onClick={registerNewCompany} disabled={loading} className="btn-primary"
                                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {loading ? 'Creating...' : <>Continue <ArrowRight size={15} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate
