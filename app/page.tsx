import Link from 'next/link'
import Image from 'next/image'
import { fetchAnimals } from '@/lib/petfinder'
import type { PetfinderAnimal } from '@/lib/petfinder'

async function getPets() {
  try {
    const data = await fetchAnimals({ limit: 20 })
    return { pets: data.animals, error: null }
  } catch (error) {
    return { 
      pets: [], 
      error: error instanceof Error ? error.message : 'Failed to fetch pets' 
    }
  }
}

function PetCard({ pet }: { pet: PetfinderAnimal }) {
  const imageUrl = pet.primary_photo_cropped?.medium || pet.photos[0]?.medium || null
  const bio = pet.description || 'No description available.'
  const truncatedBio = bio.length > 150 ? bio.substring(0, 150) + '...' : bio

  return (
    <Link href={`/pet/${pet.id}`}>
      <div className="pet-card">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={pet.name}
            width={300}
            height={250}
            className="pet-image"
          />
        ) : (
          <div className="no-image">No image available</div>
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

export default async function Home() {
  const { pets, error } = await getPets()

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Adoptable Pets</h1>
        </div>
      </div>
      <div className="container">
        {error && (
          <div className="error-message">
            Error loading pets: {error}
          </div>
        )}
        {!error && pets.length === 0 && (
          <div className="no-pets">
            No pets available at this time.
          </div>
        )}
        {!error && pets.length > 0 && (
          <div className="pets-grid">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

