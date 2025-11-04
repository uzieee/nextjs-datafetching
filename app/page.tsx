import { Suspense } from 'react'
import { fetchAnimals } from '@/lib/petfinder'
import type { PetfinderAnimal } from '@/lib/petfinder'
import SearchForm from './components/SearchForm'
import PetsContainer from './components/PetsContainer'

async function getInitialPets(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    const type = typeof searchParams.type === 'string' ? searchParams.type : undefined
    const location = typeof searchParams.location === 'string' ? searchParams.location : undefined
    const distance = typeof searchParams.distance === 'string' ? parseInt(searchParams.distance) : undefined
    
    const params: any = {
      limit: 10,
      page: 1,
    }
    
    if (type) params.type = type
    if (location) params.location = location
    if (distance) params.distance = distance

    let data
    let currentPage = 1
    let attempts = 0
    const maxAttempts = 10

    do {
      params.page = currentPage
      data = await fetchAnimals(params)
      
      const petsWithImages = data.animals.filter((pet) => {
        const imageUrl = pet.primary_photo_cropped?.medium || pet.photos[0]?.medium || null
        return imageUrl !== null
      })

      if (petsWithImages.length > 0 || currentPage >= data.pagination.total_pages || attempts >= maxAttempts) {
        break
      }

      currentPage++
      attempts++
    } while (attempts < maxAttempts && currentPage <= data.pagination.total_pages)

    const petsWithImages = data.animals.filter((pet) => {
      const imageUrl = pet.primary_photo_cropped?.medium || pet.photos[0]?.medium || null
      return imageUrl !== null
    })

    const MAX_PETS = 1000
    const MAX_PAGES = Math.ceil(MAX_PETS / 10)
    const hasMore = currentPage < data.pagination.total_pages && currentPage < MAX_PAGES

    return { 
      pets: petsWithImages, 
      hasMore,
      error: null 
    }
  } catch (error) {
    return { 
      pets: [], 
      hasMore: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pets' 
    }
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { pets, hasMore, error } = await getInitialPets(searchParams)

  const searchFilters = {
    type: typeof searchParams.type === 'string' ? searchParams.type : undefined,
    location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
    distance: typeof searchParams.distance === 'string' ? searchParams.distance : undefined,
  }

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Adoptable Pets</h1>
        </div>
      </div>
      <div className="container">
        <Suspense fallback={<div className="loading">Loading search form...</div>}>
          <SearchForm />
        </Suspense>
        
        {error ? (
          <div className="error-message">
            Error loading pets: {error}
          </div>
        ) : (
          <Suspense fallback={<div className="loading">Loading pets...</div>}>
            <PetsContainer 
              initialPets={pets} 
              initialHasMore={hasMore}
            />
          </Suspense>
        )}
      </div>
    </div>
  )
}

