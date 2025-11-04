import { NextRequest, NextResponse } from 'next/server'
import { fetchAnimals } from '@/lib/petfinder'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || undefined
    const location = searchParams.get('location') || undefined
    const distance = searchParams.get('distance') ? parseInt(searchParams.get('distance')!) : undefined
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1

    const MAX_PETS = 1000
    const MAX_PAGES = Math.ceil(MAX_PETS / 10)
    const actualPage = page > MAX_PAGES ? MAX_PAGES : page

    const params: any = {
      limit: 10,
      page: actualPage,
    }

    if (type) params.type = type
    if (location) params.location = location
    if (distance) params.distance = distance

    let data
    let currentPage = actualPage
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

    return NextResponse.json({
      pets: petsWithImages,
      pagination: data.pagination,
      nextPage: currentPage < data.pagination.total_pages && currentPage < MAX_PAGES ? currentPage + 1 : null,
      hasMore: currentPage < data.pagination.total_pages && currentPage < MAX_PAGES,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch pets' },
      { status: 500 }
    )
  }
}

