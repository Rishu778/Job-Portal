import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant.js'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '../../redux/authSlice.js'
import store from '../../redux/store.js'
import { Loader2, Mail, Lock, Briefcase, ChevronRight } from 'lucide-react'

const Login = () => {
    const { user } = useSelector(store => store.auth)
    const [input, setInput] = useState({ email: '', password: '', role: '' })
    const { loading } = useSelector(store => store.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value })

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                navigate('/')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            dispatch(setLoading(false))
        }
    }

    useEffect(() => { if (user) navigate('/') }, [])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="orb orb-1" />
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 'calc(100vh - 64px)', padding: '40px 24px', position: 'relative', zIndex: 1
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    {/* Card */}
                    <div className="glass-card" style={{ borderRadius: '24px', padding: '48px 40px' }}>
                        {/* Icon */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 16px', boxShadow: '0 8px 25px rgba(124,58,237,0.4)'
                            }}>
                                <Briefcase size={24} color="white" />
                            </div>
                            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                                Welcome back
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign in to continue your journey</p>
                        </div>

                        <form onSubmit={submitHandler}>
                            {/* Email */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input type="email" name="email" value={input.email} onChange={changeEventHandler}
                                        placeholder="you@example.com" className="dark-input" style={{ paddingLeft: '42px' }} />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input type="password" name="password" value={input.password} onChange={changeEventHandler}
                                        placeholder="••••••••" className="dark-input" style={{ paddingLeft: '42px' }} />
                                </div>
                            </div>

                            {/* Role selector */}
                            <div style={{ marginBottom: '28px' }}>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>I am a</label>
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
                                            <input type="radio" name="role" value={role}
                                                checked={input.role === role} onChange={changeEventHandler}
                                                style={{ display: 'none' }} />
                                            {role}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary"
                                style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : <>Sign In <ChevronRight size={16} /></>}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Don't have an account?{' '}
                            <Link to="/signup" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: '600' }}>Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
