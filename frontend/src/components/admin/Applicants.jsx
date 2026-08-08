import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '../../utils/constant'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '../../redux/applicationSlice'
import { ArrowLeft, Users } from 'lucide-react'

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

const Applicants = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { applicants } = useSelector(store => store.application)
    const { isMobile } = useViewport()
    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true })
                if (res.data.success) dispatch(setAllApplicants(res.data.job))
            } catch (error) { console.log(error) }
        }
        fetchAllApplicants()
    }, [])

    // Responsive size values derived from breakpoint, everything else identical
    const containerPadding = isMobile ? '32px 16px' : '48px 24px'
    const headerFontSize = isMobile ? '22px' : '28px'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: containerPadding, position: 'relative', zIndex: 1 }}>
                <button onClick={() => navigate('/admin/jobs')} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
                    color: 'var(--text-secondary)', background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontFamily: 'Syne, sans-serif'
                }}>
                    <ArrowLeft size={16} /> Back to Jobs
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Users size={20} color="#10b981" />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: headerFontSize, color: 'var(--text-primary)' }}>Applicants</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            {applicants?.applications?.length || 0} candidate{applicants?.applications?.length !== 1 ? 's' : ''} applied
                        </p>
                    </div>
                </div>
                <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <ApplicantsTable />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Applicants
