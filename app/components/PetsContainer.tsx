'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import LazyLoadPets from './LazyLoadPets'
import type { PetfinderAnimal } from '@/lib/petfinder'

interface PetsContainerProps {
  initialPets: PetfinderAnimal[]
  initialHasMore: boolean
}

export default function PetsContainer({ initialPets, initialHasMore }: PetsContainerProps) {
  const searchParams = useSearchParams()
  const [pets, setPets] = useState<PetfinderAnimal[]>(initialPets)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const prevParamsRef = useRef<string>('')

  const type = searchParams.get('type') || undefined
  const location = searchParams.get('location') || undefined
  const distance = searchParams.get('distance') || undefined

  const searchFilters = {
    type,
    location,
    distance,
  }

  const searchParamsString = JSON.stringify(searchFilters)

  useEffect(() => {
    const currentParamsString = JSON.stringify({
      type: searchParams.get('type') || undefined,
      location: searchParams.get('location') || undefined,
      distance: searchParams.get('distance') || undefined,
    })

    if (prevParamsRef.current === '') {
      prevParamsRef.current = currentParamsString
      return
    }

    if (prevParamsRef.current === currentParamsString) {
      return
    }

    prevParamsRef.current = currentParamsString
    
    const fetchNewPets = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams()
        if (type) params.append('type', type)
        if (location) params.append('location', location)
        if (distance) params.append('distance', distance)
        params.append('page', '1')

        const response = await fetch(`/api/pets?${params.toString()}`)
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setPets([])
          setHasMore(false)
        } else {
          setPets(data.pets || [])
          setHasMore(data.hasMore || false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pets')
        setPets([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    fetchNewPets()
  }, [searchParams, type, location, distance])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading pets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        Error loading pets: {error}
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="no-pets">
        No pets available at this time. Try adjusting your search filters.
      </div>
    )
  }

  return (
    <LazyLoadPets 
      initialPets={pets} 
      initialHasMore={hasMore}
      searchParams={searchFilters}
    />
  )
}

