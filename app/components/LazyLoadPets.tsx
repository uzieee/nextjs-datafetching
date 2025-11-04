'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { PetfinderAnimal } from '@/lib/petfinder'

interface LazyLoadPetsProps {
  initialPets: PetfinderAnimal[]
  initialHasMore: boolean
  searchParams: {
    type?: string
    location?: string
    distance?: string
  }
}

export default function LazyLoadPets({ initialPets, initialHasMore, searchParams }: LazyLoadPetsProps) {
  const [pets, setPets] = useState<PetfinderAnimal[]>(initialPets)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(2)
  const observerTarget = useRef<HTMLDivElement>(null)
  const searchParamsRef = useRef(searchParams)

  useEffect(() => {
    const currentParams = JSON.stringify(searchParams)
    const prevParams = JSON.stringify(searchParamsRef.current)
    
    if (currentParams !== prevParams) {
      const uniquePets = initialPets.filter((pet, index, self) => 
        index === self.findIndex(p => p.id === pet.id)
      )
      setPets(uniquePets)
      setHasMore(initialHasMore)
      setPage(2)
      searchParamsRef.current = searchParams
    }
  }, [initialPets, initialHasMore, searchParams])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchParams.type) params.append('type', searchParams.type)
      if (searchParams.location) params.append('location', searchParams.location)
      if (searchParams.distance) params.append('distance', searchParams.distance)
      params.append('page', page.toString())

      const response = await fetch(`/api/pets?${params.toString()}`)
      const data = await response.json()

      if (data.error) {
        console.error('Error loading pets:', data.error)
        setHasMore(false)
        return
      }

      if (data.pets && data.pets.length > 0) {
        setPets((prev) => {
          const existingIds = new Set(prev.map((pet: PetfinderAnimal) => pet.id))
          const newPets = data.pets.filter((pet: PetfinderAnimal) => !existingIds.has(pet.id))
          return [...prev, ...newPets]
        })
        setHasMore(data.hasMore)
        setPage((prev) => prev + 1)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more pets:', error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, searchParams])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMore, hasMore, loading])

  function PetCard({ pet }: { pet: PetfinderAnimal }) {
    const imageUrl = pet.primary_photo_cropped?.medium || pet.photos[0]?.medium || null
    const bio = pet.description || 'No description available.'
    const truncatedBio = bio.length > 150 ? bio.substring(0, 150) + '...' : bio

    return (
      <Link href={`/pet/${pet.id}`}>
        <div className="pet-card">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={pet.name}
              width={300}
              height={250}
              className="pet-image"
            />
          )}
          <div className="pet-info">
            <h2 className="pet-name">{pet.name}</h2>
            <div className="pet-details">
              {pet.type} • {pet.breeds.primary} • {pet.age} • {pet.gender}
            </div>
            <p className="pet-bio">{truncatedBio}</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <div className="pets-grid">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      {hasMore && (
        <div ref={observerTarget} className="load-more-trigger">
          {loading && (
            <div className="loading">
              Loading more pets...
            </div>
          )}
        </div>
      )}

      {!hasMore && pets.length > 0 && (
        <div className="no-more-pets">
          No more pets to load
        </div>
      )}
    </>
  )
}

