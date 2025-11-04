import Link from 'next/link'
import Image from 'next/image'
import { fetchAnimalById } from '@/lib/petfinder'
import { notFound } from 'next/navigation'

async function getPet(id: string) {
  try {
    const pet = await fetchAnimalById(id)
    return { pet, error: null }
  } catch (error) {
    return { 
      pet: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch pet' 
    }
  }
}

export default async function PetDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { pet, error } = await getPet(params.id)

  if (error || !pet) {
    notFound()
  }

  const imageUrl = pet.primary_photo_cropped?.large || 
                   pet.photos[0]?.large || 
                   pet.photos[0]?.medium || 
                   null

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Pet Details</h1>
        </div>
      </div>
      <div className="pet-detail-container">
        <Link href="/" className="back-button">
          ← Back to All Pets
        </Link>

        <div className="pet-detail-header">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={pet.name}
              width={600}
              height={400}
              className="pet-detail-image"
            />
          )}
          <h1 className="pet-detail-name">{pet.name}</h1>
          <div className="pet-detail-meta">
            <span><strong>Type:</strong> {pet.type}</span>
            <span><strong>Breed:</strong> {pet.breeds.primary}</span>
            <span><strong>Age:</strong> {pet.age}</span>
            <span><strong>Gender:</strong> {pet.gender}</span>
            <span><strong>Size:</strong> {pet.size}</span>
            {pet.coat && <span><strong>Coat:</strong> {pet.coat}</span>}
          </div>
          {pet.description && (
            <div className="pet-detail-description">
              <p>{pet.description}</p>
            </div>
          )}
        </div>

        <div className="pet-detail-section">
          <h2>Attributes</h2>
          <ul>
            <li>
              <strong>Spayed/Neutered:</strong> {pet.attributes.spayed_neutered ? 'Yes' : 'No'}
            </li>
            <li>
              <strong>House Trained:</strong> {pet.attributes.house_trained ? 'Yes' : 'No'}
            </li>
            <li>
              <strong>Special Needs:</strong> {pet.attributes.special_needs ? 'Yes' : 'No'}
            </li>
            <li>
              <strong>Shots Current:</strong> {pet.attributes.shots_current ? 'Yes' : 'No'}
            </li>
          </ul>
        </div>

        <div className="pet-detail-section">
          <h2>Environment</h2>
          <ul>
            <li>
              <strong>Good with Children:</strong> {
                pet.environment.children === true ? 'Yes' : 
                pet.environment.children === false ? 'No' : 
                'Unknown'
              }
            </li>
            <li>
              <strong>Good with Dogs:</strong> {
                pet.environment.dogs === true ? 'Yes' : 
                pet.environment.dogs === false ? 'No' : 
                'Unknown'
              }
            </li>
            <li>
              <strong>Good with Cats:</strong> {
                pet.environment.cats === true ? 'Yes' : 
                pet.environment.cats === false ? 'No' : 
                'Unknown'
              }
            </li>
          </ul>
        </div>

        <div className="pet-detail-section">
          <h2>Contact Information</h2>
          <ul>
            <li><strong>Email:</strong> {pet.contact.email}</li>
            {pet.contact.phone && (
              <li><strong>Phone:</strong> {pet.contact.phone}</li>
            )}
            <li>
              <strong>Location:</strong> {pet.contact.address.city}, {pet.contact.address.state} {pet.contact.address.postcode}
            </li>
          </ul>
        </div>

        {pet.tags && pet.tags.length > 0 && (
          <div className="pet-detail-section">
            <h2>Tags</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {pet.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '0.85rem',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {pet.url && (
          <div className="pet-detail-section">
            <h2>More Information</h2>
            <a
              href={pet.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#3498db',
                textDecoration: 'underline',
              }}
            >
              View on Petfinder →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

