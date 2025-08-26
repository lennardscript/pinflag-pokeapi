import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPokemonList, getPokemonDetails } from '../../services/pokeapi'
import { useFavoriteStore } from '../../store/favoriteStore'
import { PokeCard } from './PokeCard'

const ITEMS_PER_PAGE = 30

export function PokeGrid() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const { favorites, toggleFavorite } = useFavoriteStore()

  const { data: pokemonList, isLoading: isLoadingList, error } = useQuery({
    queryKey: ['pokemon-list'],
    queryFn: () => getPokemonList(1000),
  })

  const { data: detailedPokemon, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['pokemon-details', currentPage, searchTerm, showFavoritesOnly],
    queryFn: async () => {
      if (!pokemonList?.results) return []

      let filteredPokemon = pokemonList.results

      if (searchTerm) {
        filteredPokemon = filteredPokemon.filter(pokemon =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      if (showFavoritesOnly) {
        filteredPokemon = filteredPokemon.filter(pokemon =>
          favorites.includes(pokemon.name),
        )
      }

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex)

      const detailsPromises = paginatedPokemon.map(pokemon =>
        getPokemonDetails(pokemon.name),
      )

      return Promise.all(detailsPromises)
    },
    enabled: !!pokemonList?.results,
  })

  const filteredPokemonCount = useMemo(() => {
    if (!pokemonList?.results) return 0

    let filtered = pokemonList.results

    if (searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(pokemon =>
        favorites.includes(pokemon.name),
      )
    }

    return filtered.length
  }, [pokemonList?.results, searchTerm, showFavoritesOnly, favorites])

  const totalPages = Math.ceil(filteredPokemonCount / ITEMS_PER_PAGE)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  function handleFavoritesToggle() {
    setShowFavoritesOnly(!showFavoritesOnly)
    setCurrentPage(1)
  }

  function handlePageChange(page: number) {
    setCurrentPage(page)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error loading Pokémon
          </h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pokemon List</h1>
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

            <div className="text-sm text-gray-600">{filteredPokemonCount} Pokémon found</div>
          </div>
        </div>

        {(isLoadingList || isLoadingDetails) && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading Pokémon...</p>
            </div>
          </div>
        )}

        {!isLoadingList && !isLoadingDetails && detailedPokemon && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {detailedPokemon.map(pokemon => (
                <PokeCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isFavorite={favorites.includes(pokemon.name)}
                  onToggleFavorite={() => toggleFavorite(pokemon.name)}
                />
              ))}
            </div>

            {detailedPokemon.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Pokémon found</h3>
                <p className="text-gray-500">
                  {showFavoritesOnly
                    ? "You haven't added any favorites yet."
                    : 'Try adjusting your search term.'}
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = currentPage - 2 + i
                  if (pageNumber < 1 || pageNumber > totalPages) return null

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 border rounded-lg ${currentPage === pageNumber
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
