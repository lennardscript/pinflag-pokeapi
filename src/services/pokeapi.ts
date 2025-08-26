import axios from 'axios'

const pokeApiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
})

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonSprites {
  front_default: string
  other: {
    'official-artwork': {
      front_default: string
    }
  }
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  sprites: PokemonSprites
  types: PokemonType[]
}

export interface PokemonSpeciesFlavorText {
  flavor_text: string
  language: {
    name: string
    url: string
  }
}

export interface PokemonSpecies {
  id: number
  name: string
  flavor_text_entries: PokemonSpeciesFlavorText[]
}

export const getPokemonList = async (offset = 0, limit = 30): Promise<PokemonListResponse> => {
  const response = await pokeApiClient.get(`/pokemon?offset=${offset}&limit=${limit}`)
  return response.data
}

export const getPokemonDetails = async (idOrName: string): Promise<Pokemon> => {
  const response = await pokeApiClient.get(`/pokemon/${idOrName}`)
  return response.data
}

export const getPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  const response = await pokeApiClient.get(`/pokemon-species/${id}`)
  return response.data
}

export const getPokemonIdFromUrl = (url: string): number => {
  const matches = url.match(/\/(\d+)\/$/)
  return matches ? parseInt(matches[1]) : 0
}

export const getEnglishDescription = (species: PokemonSpecies): string => {
  const englishEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  )
  return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : 'No description available'
}
