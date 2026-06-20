import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant.js'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/authSlice.js'
import { Loader2, Mail, Lock, User, Phone, Upload, ChevronRight, Briefcase } from 'lucide-react'

const Signup = () => {
    // Combined selectors and added a safe fallback (false) to prevent accidental truthy/undefined evaluations
    const { user, loading = false } = useSelector((state) => state.auth) || {}
    
    const [input, setInput] = useState({ fullname: '', email: '', phoneNumber: '', password: '', role: '', file: '' })
    const [fileName, setFileName] = useState('')
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value })
    
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0]
        if (file) { 
            setInput({ ...input, file })
            setFileName(file.name) 
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        
        // Basic validation before submission
        if (!input.role) {
            toast.error("Please select a role (Student or Recruiter)")
            return
        }

        const formData = new FormData()
        Object.entries(input).forEach(([k, v]) => { if (v) formData.append(k, v) })
        
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, 
                withCredentials: true,
            })
            if (res.data.success) { 
                navigate('/login')
                toast.success(res.data.message) 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed')
        } finally { 
            dispatch(setLoading(false)) 
        }
    }

    // Fixed dependency array to clear warning flags
    useEffect(() => { 
        if (user) navigate('/') 
    }, [user, navigate])

    const fieldStyle = { marginBottom: '16px' }
    const labelStyle = { display: 'block', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }
    const iconWrapper = { position: 'relative' }
    const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-2" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '100%', maxWidth: '480px' }}>
                    <div className="glass-card" style={{ borderRadius: '24px', padding: '48px 40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 16px', boxShadow: '0 8px 25px rgba(124,58,237,0.4)'
                            }}>
                                <Briefcase size={24} color="white" />
                            </div>
                            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>Create Account</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Start your career journey today</p>
                        </div>

                        <form onSubmit={submitHandler}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Full Name</label>
                                <div style={iconWrapper}>
                                    <User size={16} color="var(--text-secondary)" style={iconStyle} />
                                    <input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="John Doe" className="dark-input" style={{ paddingLeft: '42px' }} required />
                                </div>
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Email</label>
                                <div style={iconWrapper}>
                                    <Mail size={16} color="var(--text-secondary)" style={iconStyle} />
                                    <input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="you@example.com" className="dark-input" style={{ paddingLeft: '42px' }} required />
                                </div>
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Phone Number</label>
                                <div style={iconWrapper}>
                                    <Phone size={16} color="var(--text-secondary)" style={iconStyle} />
                                    <input type="number" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} placeholder="+91 99999 99999" className="dark-input" style={{ paddingLeft: '42px' }} required />
                                </div>
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Password</label>
                                <div style={iconWrapper}>
                                    <Lock size={16} color="var(--text-secondary)" style={iconStyle} />
                                    <input type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="••••••••" className="dark-input" style={{ paddingLeft: '42px' }} required />
                                </div>
                            </div>

                            {/* Role */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>I am a</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {['student', 'recruiter'].map(role => (
                                        <label key={role} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: '12px', borderRadius: '12px', cursor: 'pointer',
                                            border: `1px solid ${input.role === role ? 'rgba(124,58,237,0.6)' : 'var(--border-subtle)'}`,
                                            background: input.role === role ? 'rgba(124,58,237,0.1)' : 'var(--bg-secondary)',
                                            color: input.role === role ? '#a855f7' : 'var(--text-secondary)',
                                            fontFamily: 'Syne, sans-serif', fontWeight: '600',
                                            fontSize: '14px', transition: 'all 0.2s', textTransform: 'capitalize'
                                        }}>
                                            <input type="radio" name="role" value={role} checked={input.role === role} onChange={changeEventHandler} style={{ display: 'none' }} />
                                            {role}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Profile Photo */}
                            <div style={{ marginBottom: '28px' }}>
                                <label style={labelStyle}>Profile Photo (optional)</label>
                                <label htmlFor="fileUpload" style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                                    border: '1px dashed var(--border-subtle)', background: 'var(--bg-secondary)',
                                    transition: 'all 0.2s'
                                }}>
                                    <Upload size={16} color="var(--text-secondary)" />
                                    <span style={{ color: fileName ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '14px' }}>
                                        {fileName || 'Choose an image...'}
                                    </span>
                                </label>
                                <input id="fileUpload" type="file" accept="image/*" onChange={changeFileHandler} style={{ display: 'none' }} />
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary"
                                style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {loading ? (
                                    <>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> 
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup