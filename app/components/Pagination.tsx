'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `/?${params.toString()}`
  }

  const pages = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link href={createPageUrl(currentPage - 1)} className="pagination-button">
          Previous
        </Link>
      )}

      {startPage > 1 && (
        <>
          <Link href={createPageUrl(1)} className="pagination-button">
            1
          </Link>
          {startPage > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
          <Link href={createPageUrl(totalPages)} className="pagination-button">
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link href={createPageUrl(currentPage + 1)} className="pagination-button">
          Next
        </Link>
      )}
    </div>
  )
}

