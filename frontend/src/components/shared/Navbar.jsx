import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant.js'
import { setUser } from '../../redux/authSlice'
import { Briefcase, LogOut, User, ChevronDown, Sparkles } from 'lucide-react'
import store from '../../redux/store'

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [dropOpen, setDropOpen] = useState(false)
    const [aiDropOpen, setAiDropOpen] = useState(false)

    const LogOutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
            if (res.data.success) { dispatch(setUser(null)); navigate('/'); toast.success(res.data.message) }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed')
        }
    }

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

    const aiTools = [
        { label: '🔍 Resume Parser', path: '/ai/resume-parser', desc: 'Extract info from resume' },
        { label: '📊 Resume Analyzer', path: '/ai/resume-analyzer', desc: 'ATS & quality scores' },
        { label: '⚡ Job Matcher', path: '/ai/job-matcher', desc: 'Resume vs job description' },
        { label: '🧠 Recommendations', path: '/ai/recommendations', desc: 'AI-curated job picks' },
    ]

    return (
        <nav className="navbar">
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '34px', height: '34px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(124,58,237,0.4)'
                    }}>
                        <Briefcase size={18} color="white" />
                    </div>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '20px', color: '#f0f0f8' }}>
                        Career<span style={{ color: '#a855f7' }}>Mate</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {user && user.role === 'recruiter' ? (
                        <>
                            <NavLink to="/admin/companies" active={isActive('/admin/companies')}>Companies</NavLink>
                            <NavLink to="/admin/jobs" active={isActive('/admin/jobs')}>Jobs</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
                            <NavLink to="/jobs" active={isActive('/jobs')}>Jobs</NavLink>
                            <NavLink to="/browse" active={isActive('/browse')}>Browse</NavLink>

                            {/* AI Tools Dropdown */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setAiDropOpen(!aiDropOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 14px', borderRadius: '8px', border: 'none',
                                        background: isActive('/ai') ? 'rgba(168,85,247,0.12)' : 'transparent',
                                        color: isActive('/ai') ? '#a855f7' : 'var(--text-secondary)',
                                        fontFamily: 'Syne, sans-serif', fontWeight: '500', fontSize: '14px',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}>
                                    <Sparkles size={14} />
                                    AI Tools
                                    <ChevronDown size={13} style={{ transform: aiDropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </button>

                                {aiDropOpen && (
                                    <div style={{
                                        position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                                        borderRadius: '16px', padding: '8px', minWidth: '240px',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200
                                    }}>
                                        <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                ✨ AI Career Tools
                                            </div>
                                        </div>
                                        {aiTools.map((tool) => (
                                            <button key={tool.path} onClick={() => { navigate(tool.path); setAiDropOpen(false) }} style={{
                                                display: 'flex', flexDirection: 'column', width: '100%',
                                                padding: '10px 12px', border: 'none', background: 'transparent',
                                                borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                                                transition: 'background 0.15s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{tool.label}</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>{tool.desc}</span>
                                            </button>
                                        ))}
                                        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '6px', paddingTop: '6px' }}>
                                            <button onClick={() => { navigate('/ai'); setAiDropOpen(false) }} style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                width: '100%', padding: '10px', border: 'none', borderRadius: '10px',
                                                background: 'rgba(124,58,237,0.1)', cursor: 'pointer',
                                                color: '#a855f7', fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '12px'
                                            }}>
                                                <Sparkles size={13} /> View All AI Tools
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Auth / User section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!user ? (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>Log In</button>
                            </Link>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>Sign Up</button>
                            </Link>
                        </>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setDropOpen(!dropOpen)} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                                borderRadius: '12px', padding: '6px 14px', cursor: 'pointer',
                                color: 'var(--text-primary)', transition: 'all 0.2s'
                            }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                                }}>
                                    {user?.profile?.profilePhoto
                                        ? <img src={user.profile.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <User size={14} color="white" />
                                    }
                                </div>
                                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '14px' }}>
                                    {user?.fullname?.split(' ')[0]}
                                </span>
                                <ChevronDown size={14} color="var(--text-secondary)" />
                            </button>

                            {dropOpen && (
                                <div style={{
                                    position: 'absolute', top: '110%', right: 0,
                                    background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                                    borderRadius: '14px', padding: '8px', minWidth: '200px',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200
                                }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{user?.fullname}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>{user?.email}</div>
                                    </div>
                                    {user.role === 'student' && (
                                        <DropItem icon={<User size={14} />} onClick={() => { navigate('/profile'); setDropOpen(false) }}>View Profile</DropItem>
                                    )}
                                    {user.role === 'student' && (
                                        <DropItem icon={<Sparkles size={14} />} onClick={() => { navigate('/ai'); setDropOpen(false) }}>AI Tools</DropItem>
                                    )}
                                    <DropItem icon={<LogOut size={14} />} onClick={() => { LogOutHandler(); setDropOpen(false) }} danger>Logout</DropItem>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

const NavLink = ({ to, active, children }) => (
    <Link to={to} style={{
        textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: '500',
        fontSize: '14px', padding: '8px 14px', borderRadius: '8px', transition: 'all 0.2s',
        color: active ? '#a855f7' : 'var(--text-secondary)',
        background: active ? 'rgba(168,85,247,0.1)' : 'transparent', display: 'block'
    }}>{children}</Link>
)

const DropItem = ({ icon, onClick, children, danger }) => (
    <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        padding: '10px 14px', border: 'none', background: 'transparent',
        color: danger ? '#f43f5e' : 'var(--text-primary)', cursor: 'pointer',
        borderRadius: '8px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
        transition: 'background 0.2s', textAlign: 'left'
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        {icon} {children}
    </button>
)

export default Navbar
