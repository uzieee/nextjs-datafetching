import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Pet Not Found</h1>
        </div>
      </div>
      <div className="pet-detail-container">
        <div className="pet-detail-section">
          <h2>Sorry, we couldn't find that pet.</h2>
          <p>The pet you're looking for may have been adopted or the ID may be incorrect.</p>
          <Link href="/" className="back-button">
            ← Back to All Pets
          </Link>
        </div>
      </div>
    </div>
  )
}

