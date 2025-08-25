import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { type ReactNode, createElement } from 'react'
import {
  usePokemonList,
  usePokemonDetails,
  usePokemonSpecies,
  useCompletePokemonData,
  useEnhancedPokemonList,
  useFilteredPokemonList
} from '../usePokemon'

const mockPokemonListResponse = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=30&limit=30',
  previous: null,
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/'
    },
    {
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/'
    }
  ]
}

const mockPokemonDetails = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    other: {
      'official-artwork': {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
      }
    }
  },
  types: [
    {
      slot: 1,
      type: {
        name: 'grass',
        url: 'https://pokeapi.co/api/v2/type/12/'
      }
    }
  ]
}

const mockPokemonSpecies = {
  id: 1,
  name: 'bulbasaur',
  flavor_text_entries: [
    {
      flavor_text: 'A strange seed was planted on its back at birth.',
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/'
      }
    }
  ]
}

const server = setupServer(
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return HttpResponse.json(mockPokemonListResponse)
  }),
  http.get('https://pokeapi.co/api/v2/pokemon/:idOrName', () => {
    return HttpResponse.json(mockPokemonDetails)
  }),
  http.get('https://pokeapi.co/api/v2/pokemon-species/:id', () => {
    return HttpResponse.json(mockPokemonSpecies)
  })
)

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('Pokemon Hooks', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('usePokemonList', () => {
    it('should fetch pokemon list successfully', async () => {
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.results).toHaveLength(2)
      expect(result.current.data?.results[0].name).toBe('bulbasaur')
    })

    it('should handle pagination parameters', async () => {
      const { result } = renderHook(() => usePokemonList(1, 20), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
    })
  })

  describe('usePokemonDetails', () => {
    it('should fetch pokemon details successfully', async () => {
      const { result } = renderHook(() => usePokemonDetails('1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe('bulbasaur')
      expect(result.current.data?.id).toBe(1)
    })

    it('should not fetch when idOrName is undefined', () => {
      const { result } = renderHook(() => usePokemonDetails(undefined), {
        wrapper: createWrapper(),
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('usePokemonSpecies', () => {
    it('should fetch pokemon species successfully', async () => {
      const { result } = renderHook(() => usePokemonSpecies(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe('bulbasaur')
      expect(result.current.data?.flavor_text_entries).toBeDefined()
    })

    it('should not fetch when id is undefined', () => {
      const { result } = renderHook(() => usePokemonSpecies(undefined), {
        wrapper: createWrapper(),
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('useCompletePokemonData', () => {
    it('should combine pokemon details and species data', async () => {
      const { result } = renderHook(() => useCompletePokemonData('1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.pokemon).toBeDefined()
      expect(result.current.species).toBeDefined()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('useEnhancedPokemonList', () => {
    it('should enhance pokemon list with IDs', async () => {
      const { result } = renderHook(() => useEnhancedPokemonList(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.pokemonList).toBeDefined()
      expect(result.current.pokemonList[0]).toHaveProperty('id')
      expect(result.current.pokemonList[0].id).toBe(1)
      expect(result.current.pokemonList[0].name).toBe('bulbasaur')
    })
  })

  describe('useFilteredPokemonList', () => {
    it('should filter pokemon by search term', async () => {
      const { result } = renderHook(() => useFilteredPokemonList(0, 30, 'bulba'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.filteredResults).toHaveLength(1)
      expect(result.current.filteredResults[0].name).toBe('bulbasaur')
      expect(result.current.hasResults).toBe(true)
      expect(result.current.totalFiltered).toBe(1)
    })

    it('should return empty results for non-matching search', async () => {
      const { result } = renderHook(() => useFilteredPokemonList(0, 30, 'xyz123'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.filteredResults).toHaveLength(0)
      expect(result.current.hasResults).toBe(false)
      expect(result.current.totalFiltered).toBe(0)
    })
  })
})
