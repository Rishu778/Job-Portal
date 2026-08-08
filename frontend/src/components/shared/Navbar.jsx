import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant.js'
import { setUser } from '../../redux/authSlice'
import { Briefcase, LogOut, User, ChevronDown, Sparkles, Menu, X } from 'lucide-react'
import store from '../../redux/store'

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [dropOpen, setDropOpen] = useState(false)
    const [aiDropOpen, setAiDropOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileAiOpen, setMobileAiOpen] = useState(false)

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

    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
        setMobileAiOpen(false)
    }

    return (
        <nav className="navbar">
            {/* Responsive breakpoints - only affects layout at smaller widths, desktop look is untouched */}
            <style>{`
                .navbar-desktop-links { display: flex; }
                .navbar-desktop-auth { display: flex; }
                .navbar-mobile-toggle-btn { display: none; }
                .navbar-mobile-panel { display: none; }
                .navbar-brand-text { font-size: 20px; }

                @media (max-width: 900px) {
                    .navbar-inner-container { padding: 0 16px !important; }
                }

                @media (max-width: 768px) {
                    .navbar-desktop-links { display: none !important; }
                    .navbar-desktop-auth { display: none !important; }
                    .navbar-mobile-toggle-btn { display: flex !important; }
                    .navbar-mobile-panel.open { display: block; }
                    .navbar-inner-container { height: 60px; padding: 0 14px !important; }
                }

                @media (max-width: 420px) {
                    .navbar-brand-text { font-size: 17px; }
                }
            `}</style>

            <div className="navbar-inner-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                {/* Logo */}
                <Link to="/" onClick={closeMobileMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '34px', height: '34px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
                        flexShrink: 0
                    }}>
                        <Briefcase size={18} color="white" />
                    </div>
                    <span className="navbar-brand-text" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', color: '#f0f0f8', whiteSpace: 'nowrap' }}>
                        Career<span style={{ color: '#a855f7' }}>Mate</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="navbar-desktop-links" style={{ alignItems: 'center', gap: '4px' }}>
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

                {/* Auth / User section (desktop) */}
                <div className="navbar-desktop-auth" style={{ alignItems: 'center', gap: '12px' }}>
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

                {/* Mobile hamburger toggle */}
                <button
                    className="navbar-mobile-toggle-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    style={{
                        alignItems: 'center', justifyContent: 'center',
                        width: '38px', height: '38px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-card)', cursor: 'pointer', color: 'var(--text-primary)'
                    }}>
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile panel */}
            <div className={`navbar-mobile-panel${mobileMenuOpen ? ' open' : ''}`} style={{
                borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-card)', padding: '12px 16px'
            }}>
                {user && user.role === 'recruiter' ? (
                    <>
                        <MobileLink to="/admin/companies" active={isActive('/admin/companies')} onClick={closeMobileMenu}>Companies</MobileLink>
                        <MobileLink to="/admin/jobs" active={isActive('/admin/jobs')} onClick={closeMobileMenu}>Jobs</MobileLink>
                    </>
                ) : (
                    <>
                        <MobileLink to="/" active={location.pathname === '/'} onClick={closeMobileMenu}>Home</MobileLink>
                        <MobileLink to="/jobs" active={isActive('/jobs')} onClick={closeMobileMenu}>Jobs</MobileLink>
                        <MobileLink to="/browse" active={isActive('/browse')} onClick={closeMobileMenu}>Browse</MobileLink>

                        <button
                            onClick={() => setMobileAiOpen(!mobileAiOpen)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                padding: '10px 8px', border: 'none', background: 'transparent',
                                color: isActive('/ai') ? '#a855f7' : 'var(--text-secondary)',
                                fontFamily: 'Syne, sans-serif', fontWeight: '500', fontSize: '14px', cursor: 'pointer'
                            }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={14} /> AI Tools</span>
                            <ChevronDown size={13} style={{ transform: mobileAiOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        {mobileAiOpen && (
                            <div style={{ paddingLeft: '12px', marginBottom: '6px' }}>
                                {aiTools.map((tool) => (
                                    <button key={tool.path} onClick={() => { navigate(tool.path); closeMobileMenu() }} style={{
                                        display: 'flex', flexDirection: 'column', width: '100%',
                                        padding: '10px 8px', border: 'none', background: 'transparent',
                                        borderRadius: '10px', cursor: 'pointer', textAlign: 'left'
                                    }}>
                                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{tool.label}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>{tool.desc}</span>
                                    </button>
                                ))}
                                <button onClick={() => { navigate('/ai'); closeMobileMenu() }} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    width: '100%', padding: '10px', border: 'none', borderRadius: '10px',
                                    background: 'rgba(124,58,237,0.1)', cursor: 'pointer',
                                    color: '#a855f7', fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '12px', marginTop: '4px'
                                }}>
                                    <Sparkles size={13} /> View All AI Tools
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '10px', paddingTop: '10px' }}>
                    {!user ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/login" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
                                <button className="btn-secondary" style={{ width: '100%', padding: '10px', fontSize: '14px' }}>Log In</button>
                            </Link>
                            <Link to="/signup" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
                                <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '14px' }}>Sign Up</button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 8px 12px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                                }}>
                                    {user?.profile?.profilePhoto
                                        ? <img src={user.profile.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <User size={14} color="white" />
                                    }
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{user?.fullname}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{user?.email}</div>
                                </div>
                            </div>
                            {user.role === 'student' && (
                                <DropItem icon={<User size={14} />} onClick={() => { navigate('/profile'); closeMobileMenu() }}>View Profile</DropItem>
                            )}
                            {user.role === 'student' && (
                                <DropItem icon={<Sparkles size={14} />} onClick={() => { navigate('/ai'); closeMobileMenu() }}>AI Tools</DropItem>
                            )}
                            <DropItem icon={<LogOut size={14} />} onClick={() => { LogOutHandler(); closeMobileMenu() }} danger>Logout</DropItem>
                        </>
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

const MobileLink = ({ to, active, children, onClick }) => (
    <Link to={to} onClick={onClick} style={{
        textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: '500',
        fontSize: '14px', padding: '10px 8px', borderRadius: '8px', transition: 'all 0.2s',
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
