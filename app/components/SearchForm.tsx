'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [type, setType] = useState(searchParams.get('type') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [distance, setDistance] = useState(searchParams.get('distance') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (type) params.set('type', type)
    if (location) params.set('location', location)
    if (distance) params.set('distance', distance)
    
    router.push(`/?${params.toString()}`)
  }

  const handleClear = () => {
    setType('')
    setLocation('')
    setDistance('')
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-row">
        <div className="search-field">
          <label htmlFor="type">Animal Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="search-input"
          >
            <option value="">All Types</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Horse">Horse</option>
            <option value="Small & Furry">Small & Furry</option>
            <option value="Scales, Fins & Other">Scales, Fins & Other</option>
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State or ZIP"
            className="search-input"
          />
        </div>

        <div className="search-field">
          <label htmlFor="distance">Distance (miles)</label>
          <input
            id="distance"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g. 25"
            min="1"
            max="500"
            className="search-input"
          />
        </div>
      </div>

      <div className="search-actions">
        <button type="submit" className="search-button">
          Search
        </button>
        {(type || location || distance) && (
          <button type="button" onClick={handleClear} className="clear-button">
            Clear Filters
          </button>
        )}
      </div>
    </form>
  )
}

