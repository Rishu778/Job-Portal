import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Badge } from './ui/badge'
import { Mail, Phone, Edit2, FileText, Star, Award, TrendingUp, ExternalLink } from 'lucide-react'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import store from '../redux/store'
import useGetAppliedJob from '../hooks/useGetAppliedJob'

const Profile = () => {
    useGetAppliedJob()
    const [open, setOpen] = useState(false)
    const { user } = useSelector(store => store.auth)

    const profileCompletion = () => {
        let score = 0
        if (user?.fullname) score += 20
        if (user?.email) score += 20
        if (user?.phoneNumber) score += 20
        if (user?.profile?.skills?.length) score += 20
        if (user?.profile?.resume) score += 20
        return score
    }
    const completion = profileCompletion()
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
                {/* Profile Header */}
                <div className="glass-card" style={{ borderRadius: '24px', padding: '40px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                    {/* Decorative gradient */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.05))',
                        borderRadius: '24px 24px 0 0'
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {/* Avatar */}
                            <div style={{
                                width: '88px', height: '88px', borderRadius: '24px',
                                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', border: '3px solid rgba(124,58,237,0.4)',
                                boxShadow: '0 8px 25px rgba(124,58,237,0.3)', flexShrink: 0
                            }}>
                                {user?.profile?.profilePhoto
                                    ? <img src={user.profile.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '32px', color: 'white' }}>
                                        {user?.fullname?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                }
                            </div>
                            <div>
                                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '26px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                                    {user?.fullname}
                                </h1>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', lineHeight: '1.6' }}>
                                    {user?.profile?.bio || 'No bio added yet.'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(true)} className="btn-secondary" style={{
                            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '10px 18px'
                        }}>
                            <Edit2 size={14} /> Edit Profile
                        </button>
                    </div>

                    {/* Profile Completion */}
                    <div style={{ marginTop: '28px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>
                                Profile Completion
                            </span>
                            <span style={{ color: '#a855f7', fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px' }}>{completion}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: '100px',
                                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                                width: `${completion}%`, transition: 'width 0.8s ease'
                            }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Contact Info */}
                        <div className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                Contact
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Mail size={15} color="#a855f7" />
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Email</div>
                                        <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '500' }}>{user?.email || 'Not set'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone size={15} color="#10b981" />
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Phone</div>
                                        <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '500' }}>{user?.phoneNumber || 'Not set'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                <Star size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Skills
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {user?.profile?.skills?.length
                                    ? user.profile.skills.map((s, i) => (
                                        <span key={i} className="tag tag-violet">{s}</span>
                                    ))
                                    : <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No skills added</span>
                                }
                            </div>
                        </div>

                        {/* Resume */}
                        <div className="glass-card" style={{ borderRadius: '20px', padding: '24px' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                <FileText size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Resume
                            </h3>
                            {user?.profile?.resume
                                ? <a href={user.profile.resume} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a855f7', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
                                    <FileText size={16} /> {user.profile.resumeOriginalName || 'View Resume'} <ExternalLink size={12} />
                                </a>
                                : <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No resume uploaded</span>
                            }
                        </div>
                    </div>

                    {/* Applied Jobs */}
                    <div className="glass-card" style={{ borderRadius: '20px', padding: '28px' }}>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <TrendingUp size={18} color="#a855f7" /> Applied Jobs
                        </h2>
                        <AppliedJobTable />
                    </div>
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
