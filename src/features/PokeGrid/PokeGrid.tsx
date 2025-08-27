import { useState, useMemo, useEffect } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getPokemonDetails } from '../../services/pokeapi'
import { useEnhancedPokemonList } from '../../hooks/usePokemon'
import { useFavoriteStore } from '../../store/favoriteStore'
import { PokeCard } from './PokeCard'

const ITEMS_PER_PAGE = 30

export function PokeGrid() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const { favorites, toggleFavorite } = useFavoriteStore()

  const { pokemonList, isLoading: isLoadingList, error } = useEnhancedPokemonList(0, 1000)

  const filteredPokemon = useMemo(() => {
    let filtered = pokemonList

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(p => favorites.includes(p.id))
    }

    return filtered
  }, [pokemonList, searchTerm, showFavoritesOnly, favorites])

  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE)

  const paginatedPokemon = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPokemon.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredPokemon, currentPage])

  const { data: detailedPokemon, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['pokemon-details-page', currentPage, searchTerm, showFavoritesOnly, favorites],
    queryFn: async () => {
      const promises = paginatedPokemon.map(p => getPokemonDetails(p.name))
      return Promise.all(promises)
    },
    enabled: paginatedPokemon.length > 0,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })

  const [shouldShowGrid, setShouldShowGrid] = useState(false)
  const [shouldShowEmpty, setShouldShowEmpty] = useState(false)

  useEffect(() => {
    if (filteredPokemon.length === 0) {
      setShouldShowGrid(false)
      setShouldShowEmpty(true)
    } else if (detailedPokemon && detailedPokemon.length > 0) {
      setShouldShowGrid(true)
      setShouldShowEmpty(false)
    } else {
      setShouldShowGrid(false)
      setShouldShowEmpty(false)
    }
  }, [filteredPokemon.length, detailedPokemon])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  function handleFavoritesToggle() {
    setShowFavoritesOnly(!showFavoritesOnly)
    setCurrentPage(1)
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading Pokémon</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pokédex</h1>
          <p className="text-gray-600">Discover and collect your favorite Pokémon</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search Pokémon by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleFavoritesToggle}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${showFavoritesOnly
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {showFavoritesOnly ? '❤️ Showing Favorites' : '🩶 Show All'}
            </button>
            <div className="text-sm text-gray-600">
              {filteredPokemon.length} Pokémon found
              {showFavoritesOnly && favorites.length > 0 && (
                <span className="ml-2 text-yellow-600">
                  ({favorites.length} total favorites)
                </span>
              )}
            </div>
          </div>
        </div>

        {(isLoadingList || (isLoadingDetails && !shouldShowGrid && !shouldShowEmpty)) && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading Pokémon...</p>
            </div>
          </div>
        )}

        {!isLoadingList && (
          <>
            {shouldShowGrid && detailedPokemon && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {detailedPokemon.map(pokemon => (
                  <PokeCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    isFavorite={favorites.includes(pokemon.id)}
                    onToggleFavorite={() => toggleFavorite(pokemon.id)}
                  />
                ))}
              </div>
            )}

            {shouldShowEmpty && showFavoritesOnly && (
              <div className="text-center py-16">
                <div className="mb-4">
                  <span className="text-6xl">💔</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No favorite Pokémon found</h3>
                <p className="text-gray-500 mb-4">
                  {favorites.length === 0
                    ? "You haven't added any favorites yet."
                    : `You have ${favorites.length} favorite${favorites.length !== 1 ? 's' : ''}, but none match your current search.`
                  }
                </p>
                {favorites.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    Click the heart icon ❤️ on any Pokémon card to add them to your favorites!
                  </p>
                ) : (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-500 hover:text-blue-700 underline text-sm"
                  >
                    Clear search to see all your favorites
                  </button>
                )}
              </div>
            )}

            {shouldShowEmpty && !showFavoritesOnly && searchTerm && (
              <div className="text-center py-16">
                <div className="mb-4">
                  <span className="text-6xl">🔍</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Pokémon found</h3>
                <p className="text-gray-500 mb-4">
                  No Pokémon match your search "<strong>{searchTerm}</strong>".
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-500 hover:text-blue-700 underline text-sm"
                >
                  Clear search to see all Pokémon
                </button>
              </div>
            )}

            {shouldShowGrid && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void
}) {
  const pagesToShow = 5

  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2))
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1)

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1)
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 py-2 text-gray-400">...</span>}
        </>
      )}

      {pageNumbers.map(pageNumber => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-4 py-2 border rounded-lg transition-colors ${currentPage === pageNumber
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
        >
          {pageNumber}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 py-2 text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Next
      </button>
    </div>
  )
}
