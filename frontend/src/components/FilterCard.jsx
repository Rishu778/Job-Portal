import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'
import { MapPin, Briefcase, DollarSign, X } from 'lucide-react'

const filterData = [
    {
        filterType: 'Location',
        icon: <MapPin size={14} />,
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: 'Industry',
        icon: <Briefcase size={14} />,
        array: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist"]
    },
    {
        filterType: 'Salary',
        icon: <DollarSign size={14} />,
        array: ["0-40K", "42K-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('')
    const dispatch = useDispatch()

    const changeHandler = (value) => {
        setSelectedValue(prev => prev === value ? '' : value)
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue))
    }, [selectedValue])

    return (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '20px', padding: '24px', width: '260px', flexShrink: 0
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>
                    Filters
                </h2>
                {selectedValue && (
                    <button onClick={() => setSelectedValue('')} style={{
                        display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px',
                        color: '#f43f5e', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
                        borderRadius: '6px', padding: '3px 8px', cursor: 'pointer'
                    }}>
                        <X size={11} /> Clear
                    </button>
                )}
            </div>

            {filterData.map((data, index) => (
                <div key={index} style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                        {data.icon}
                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {data.filterType}
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {data.array.map((item, idx) => {
                            const isSelected = selectedValue === item
                            return (
                                <button key={idx} onClick={() => changeHandler(item)} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '9px 12px', borderRadius: '10px', cursor: 'pointer',
                                    border: `1px solid ${isSelected ? 'rgba(124,58,237,0.5)' : 'var(--border-subtle)'}`,
                                    background: isSelected ? 'rgba(124,58,237,0.1)' : 'var(--bg-secondary)',
                                    color: isSelected ? '#a855f7' : 'var(--text-secondary)',
                                    fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                                    transition: 'all 0.2s', textAlign: 'left', width: '100%'
                                }}>
                                    <div style={{
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        border: `2px solid ${isSelected ? '#a855f7' : 'var(--text-secondary)'}`,
                                        background: isSelected ? '#a855f7' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, transition: 'all 0.2s'
                                    }}>
                                        {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />}
                                    </div>
                                    {item}
                                </button>
                            )
                        })}
                    </div>
                    {index < filterData.length - 1 && <div className="divider" style={{ marginTop: '16px' }} />}
                </div>
            ))}
        </div>
    )
}

export default FilterCard
