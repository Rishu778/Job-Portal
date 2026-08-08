import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { ArrowLeft, Loader2, Building, Globe, MapPin, FileText, Upload } from 'lucide-react'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '../../utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '../../hooks/useGetCompanyById'

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

const CompanySetup = () => {
    const params = useParams()
    useGetCompanyById(params.id)
    const [input, setInput] = useState({ name: '', description: '', website: '', location: '', file: null })
    const [logoName, setLogoName] = useState('')
    const { singleCompany } = useSelector(store => store.company)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { isMobile } = useViewport()

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value })
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0]
        if (file) { setInput({ ...input, file }); setLogoName(file.name) }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        Object.entries(input).forEach(([k, v]) => { if (v) formData.append(k === 'file' ? 'file' : k, v) })
        try {
            setLoading(true)
            const res = await axios.post(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
            })
            if (res.data.success) { toast.success(res.data.message); navigate('/admin/companies') }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed')
        } finally { setLoading(false) }
    }

    useEffect(() => {
        if (!singleCompany) return;
        setInput({
            name: singleCompany.name || '',
            description: singleCompany.description || '',
            website: singleCompany.website || '',
            location: singleCompany.location || '',
            file: null
        })
    }, [singleCompany])

    const fields = [
        { label: 'Company Name', name: 'name', icon: <Building size={15} />, placeholder: 'Company name' },
        { label: 'Description', name: 'description', icon: <FileText size={15} />, placeholder: 'About the company...' },
        { label: 'Website', name: 'website', icon: <Globe size={15} />, placeholder: 'https://yourcompany.com' },
        { label: 'Location', name: 'location', icon: <MapPin size={15} />, placeholder: 'City, Country' },
    ]

    // Responsive size values derived from breakpoint, everything else identical
    const containerPadding = isMobile ? '32px 16px' : '48px 24px'
    const cardPadding = isMobile ? '24px 20px' : '36px'
    const titleFontSize = isMobile ? '22px' : '28px'
    const fieldsGridColumns = isMobile ? '1fr' : '1fr 1fr'
    const fullSpan = isMobile ? 'span 1' : 'span 2'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-2" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: containerPadding, position: 'relative', zIndex: 1 }}>
                <button onClick={() => navigate('/admin/companies')} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
                    color: 'var(--text-secondary)', background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontFamily: 'Syne, sans-serif'
                }}>
                    <ArrowLeft size={16} /> Back to Companies
                </button>

                <div style={{ marginBottom: '28px' }}>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: titleFontSize, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Company <span className="gradient-text">Setup</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Update your company profile information</p>
                </div>

                <div className="glass-card" style={{ borderRadius: '24px', padding: cardPadding }}>
                    <form onSubmit={submitHandler}>
                        <div style={{ display: 'grid', gridTemplateColumns: fieldsGridColumns, gap: '16px', marginBottom: '16px' }}>
                            {fields.map(f => (
                                <div key={f.name} style={{ gridColumn: f.name === 'description' ? fullSpan : 'span 1' }}>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>{f.icon}</div>
                                        <input type="text" name={f.name} value={input[f.name]} onChange={changeEventHandler}
                                            placeholder={f.placeholder} className="dark-input" style={{ paddingLeft: '42px' }} />
                                    </div>
                                </div>
                            ))}

                            {/* Logo upload */}
                            <div style={{ gridColumn: fullSpan }}>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company Logo</label>
                                <label htmlFor="logoUpload" style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                                    borderRadius: '12px', cursor: 'pointer', border: '1px dashed rgba(124,58,237,0.4)',
                                    background: 'rgba(124,58,237,0.05)'
                                }}>
                                    <Upload size={16} color="#a855f7" />
                                    <span style={{ color: logoName ? '#a855f7' : 'var(--text-secondary)', fontSize: '13px', wordBreak: 'break-word' }}>
                                        {logoName || 'Upload logo image...'}
                                    </span>
                                </label>
                                <input id="logoUpload" type="file" accept="image/*" onChange={changeFileHandler} style={{ display: 'none' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary"
                            style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanySetup
