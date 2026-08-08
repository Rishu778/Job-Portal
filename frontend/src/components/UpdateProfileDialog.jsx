import React, { useState } from 'react'
import { X, Loader2, User, Mail, Phone, FileText, Upload, Star } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '../utils/constant.js'
import { setUser } from '../redux/authSlice.js'
import { toast } from 'sonner'
import store from '../redux/store'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(state => state.auth)
    const [fileName, setFileName] = useState('')
    const [input, setInput] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: user?.profile?.skills?.join(', ') || '',
        file: null,
    })
    const dispatch = useDispatch()

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value })
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0]
        if (file) { setInput({ ...input, file }); setFileName(file.name) }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('fullname', input.fullname)
        formData.append('email', input.email)
        formData.append('phoneNumber', input.phoneNumber)
        formData.append('bio', input.bio)
        formData.append('skills', input.skills)
        if (input.file) formData.append('file', input.file)
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    if (!open) return null

    const fields = [
        { label: 'Full Name', name: 'fullname', type: 'text', icon: <User size={15} />, placeholder: 'Your full name' },
        { label: 'Email', name: 'email', type: 'email', icon: <Mail size={15} />, placeholder: 'your@email.com' },
        { label: 'Phone', name: 'phoneNumber', type: 'text', icon: <Phone size={15} />, placeholder: '+91 99999 99999' },
        { label: 'Bio', name: 'bio', type: 'text', icon: <User size={15} />, placeholder: 'Tell us about yourself...' },
        { label: 'Skills', name: 'skills', type: 'text', icon: <Star size={15} />, placeholder: 'React, Node.js, Python...' },
    ]

    return (
        <div className="upd-overlay" style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
            {/* Responsive adjustments only - all original styles/markup untouched */}
            <style>{`
                @media (max-width: 560px) {
                    .upd-overlay { padding: 0 !important; align-items: flex-end !important; }
                    .upd-modal { border-radius: 20px 20px 0 0 !important; max-width: 100% !important; max-height: 92vh !important; padding: 26px !important; }
                }

                @media (max-width: 380px) {
                    .upd-modal { padding: 20px !important; }
                    .upd-modal-title { font-size: 19px !important; }
                }
            `}</style>

            <div className="upd-modal" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '500px',
                maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <div>
                        <h2 className="upd-modal-title" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '22px', color: 'var(--text-primary)', marginBottom: '4px' }}>Update Profile</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Keep your info up to date</p>
                    </div>
                    <button onClick={() => setOpen(false)} style={{
                        width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s'
                    }}>
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={submitHandler}>
                    {fields.map((f) => (
                        <div key={f.name} style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>{f.icon}</div>
                                <input type={f.type} name={f.name} value={input[f.name]} onChange={changeEventHandler}
                                    placeholder={f.placeholder} className="dark-input" style={{ paddingLeft: '42px' }} />
                            </div>
                        </div>
                    ))}

                    {/* Resume Upload */}
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resume (PDF)</label>
                        <label htmlFor="resumeUpload" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                            borderRadius: '12px', cursor: 'pointer', border: '1px dashed rgba(124,58,237,0.4)',
                            background: 'rgba(124,58,237,0.05)', transition: 'all 0.2s'
                        }}>
                            <Upload size={16} color="#a855f7" />
                            <span style={{ color: fileName ? '#a855f7' : 'var(--text-secondary)', fontSize: '13px' }}>
                                {fileName || 'Upload your resume...'}
                            </span>
                        </label>
                        <input id="resumeUpload" type="file" accept="application/pdf" onChange={fileChangeHandler} style={{ display: 'none' }} />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdateProfileDialog
