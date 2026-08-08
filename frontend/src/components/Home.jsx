import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import Category from './Category'
import LatestJobs from './LatestJobs'
import AIToolsSection from './AIToolsSection'
import Footer from './Footer'
import useGetAllJobs from '../hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import store from '../redux/store'

const Home = () => {
    useGetAllJobs()
    const { user } = useSelector(store => store.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (user?.role === 'recruiter') navigate('/admin/companies')
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
            <style>{`
                @media (max-width: 768px) {
                    .home-divider {
                        margin: 0 16px !important;
                        max-width: 100% !important;
                    }
                }
            `}</style>

            <Navbar />
            <HeroSection />
            <div className="divider home-divider" style={{ margin: '0 auto', maxWidth: '1100px' }} />
            <Category />
            <div className="divider home-divider" style={{ margin: '0 auto', maxWidth: '1100px' }} />
            <AIToolsSection />
            <div className="divider home-divider" style={{ margin: '0 auto', maxWidth: '1100px' }} />
            <LatestJobs />
            <Footer />
        </div>
    )
}

export default Home
