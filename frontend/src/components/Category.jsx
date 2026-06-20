import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '../redux/jobSlice'
import { Code, Database, BarChart2, Palette, Layers, Cloud, Shield, Smartphone } from 'lucide-react'

const categories = [
    { label: "Frontend Developer", icon: <Code size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: "Backend Developer", icon: <Database size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: "Data Scientist", icon: <BarChart2 size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: "Graphic Designer", icon: <Palette size={20} />, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
    { label: "Full Stack Developer", icon: <Layers size={20} />, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    { label: "Cloud Engineer", icon: <Cloud size={20} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: "Cybersecurity", icon: <Shield size={20} />, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { label: "Mobile Developer", icon: <Smartphone size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
]

const Category = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query))
        navigate('/browse')
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '100px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a855f7', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Explore by Category
                </span>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '36px', color: 'var(--text-primary)' }}>
                    What are you <span className="gradient-text">looking for?</span>
                </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                {categories.map((cat, i) => (
                    <button key={i} onClick={() => searchJobHandler(cat.label)} style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '18px 20px', borderRadius: '16px', cursor: 'pointer',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-card)', transition: 'all 0.3s ease',
                        textAlign: 'left', width: '100%'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = cat.color + '60'
                        e.currentTarget.style.background = cat.bg
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = `0 8px 25px ${cat.color}20`
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                        e.currentTarget.style.background = 'var(--bg-card)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                    }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '12px',
                            background: cat.bg, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: cat.color, flexShrink: 0
                        }}>{cat.icon}</div>
                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Category
