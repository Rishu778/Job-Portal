import React from 'react'
import { Briefcase, Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', marginTop: '80px', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Briefcase size={18} color="white" />
                            </div>
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '20px', color: 'var(--text-primary)' }}>
                                Career<span style={{ color: '#a855f7' }}>Mate</span>
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', maxWidth: '280px', marginBottom: '24px' }}>
                            Connecting ambitious professionals with their dream careers. Your future starts here.
                        </p>
                        {/* Newsletter */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input placeholder="Your email..." style={{
                                flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                                borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)',
                                fontSize: '13px', outline: 'none', fontFamily: 'DM Sans, sans-serif'
                            }} />
                            <button className="btn-primary" style={{ padding: '10px 14px', borderRadius: '10px' }}>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Company</h4>
                        {['About Us', 'Careers', 'Blog', 'Press'].map(link => (
                            <div key={link} style={{ marginBottom: '10px' }}>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#a855f7'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{link}</a>
                            </div>
                        ))}
                    </div>

                    {/* For Job Seekers */}
                    <div>
                        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Job Seekers</h4>
                        {['Browse Jobs', 'Career Advice', 'Resume Tips', 'Salary Guide'].map(link => (
                            <div key={link} style={{ marginBottom: '10px' }}>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#a855f7'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{link}</a>
                            </div>
                        ))}
                    </div>

                    {/* For Employers */}
                    <div>
                        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Employers</h4>
                        {['Post a Job', 'Find Talent', 'Pricing', 'Support'].map(link => (
                            <div key={link} style={{ marginBottom: '10px' }}>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#a855f7'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{link}</a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        © {new Date().getFullYear()} CareerMate. All rights reserved.
                    </span>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {[
                            { icon: <Github size={18} />, href: '#' },
                            { icon: <Twitter size={18} />, href: '#' },
                            { icon: <Linkedin size={18} />, href: '#' },
                            { icon: <Mail size={18} />, href: '#' },
                        ].map((s, i) => (
                            <a key={i} href={s.href} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>{s.icon}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
