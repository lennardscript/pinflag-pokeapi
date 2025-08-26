import { useQuery } from "@tanstack/react-query";

import {
  getPokemonList,
  getPokemonDetails,
  getPokemonSpecies,
  getPokemonIdFromUrl,
  type PokemonListResponse,
  type Pokemon,
  type PokemonSpecies,
  getEnglishDescription
} from '../services/pokeapi'

export const usePokemonList = (page: number = 0, limit: number = 30) => {
  const offset = page * limit

  return useQuery<PokemonListResponse>({
    queryKey: ['pokemon-list', offset, limit],
    queryFn: () => getPokemonList(offset, limit),
    staleTime: 5 * 60 * 1000
  })
}

export const usePokemonDetails = (idOrName: string | undefined) => {
  return useQuery<Pokemon>({
    queryKey: ['pokemon-details', idOrName],
    queryFn: () => getPokemonDetails(idOrName!),
    enabled: !!idOrName,
    staleTime: 10 * 60 * 1000,
  })
}

export const usePokemonSpecies = (id?: number) => {
  return useQuery<PokemonSpecies>({
    queryKey: ['pokemon-species', id],
    queryFn: () => getPokemonSpecies(id!),
    enabled: typeof id === 'number' && id > 0,
    staleTime: 10 * 60 * 1000,
  })
}

export const useCompletePokemonData = (idOrName?: string) => {
  const detailsQuery = usePokemonDetails(idOrName)
  const speciesQuery = usePokemonSpecies(detailsQuery.data?.id)

  return {
    pokemon: detailsQuery.data,
    species: speciesQuery.data,
    description: speciesQuery.data ? getEnglishDescription(speciesQuery.data) : '',
    isLoading: detailsQuery.isLoading || speciesQuery.isLoading,
    isError: detailsQuery.isError || speciesQuery.isError,
    error: detailsQuery.error || speciesQuery.error,
    isSuccess: detailsQuery.isSuccess && speciesQuery.isSuccess,
  }
}

export interface EnhancedPokemonListItem {
  name: string
  url: string
  id: number
}

export const useEnhancedPokemonList = (page: number = 0, limit: number = 30) => {
  const query = usePokemonList(page, limit)

  const enhancedResults: EnhancedPokemonListItem[] = query.data?.results.map(pokemon => ({
    ...pokemon,
    id: getPokemonIdFromUrl(pokemon.url)
  })) || []

  return {
    ...query,
    data: query.data ? {
      ...query.data,
      results: enhancedResults
    } : undefined,
    pokemonList: enhancedResults
  }
}

export const useFilteredPokemonList = (
  page: number = 0,
  limit: number = 30,
  searchTerm: string = ''
) => {
  const query = useEnhancedPokemonList(page, limit)

  const filteredResults = query.pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return {
    ...query,
    filteredResults,
    hasResults: filteredResults.length > 0,
    totalFiltered: filteredResults.length
  }
}
