import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  getPokemonList,
  getPokemonDetails,
  getPokemonSpecies,
  getPokemonIdFromUrl,
  type PokemonListResponse,
  type Pokemon,
  type PokemonSpecies
} from '../pokeapi'

const mockPokemonListResponse: PokemonListResponse = {
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

const mockPokemonDetails: Pokemon = {
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
    },
    {
      slot: 2,
      type: {
        name: 'poison',
        url: 'https://pokeapi.co/api/v2/type/4/'
      }
    }
  ]
}

const mockPokemonSpecies: PokemonSpecies = {
  id: 1,
  name: 'bulbasaur',
  flavor_text_entries: [
    {
      flavor_text: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/'
      }
    },
    {
      flavor_text: 'Cuando nace, lleva plantada una semilla en el lomo. Crece con él.',
      language: {
        name: 'es',
        url: 'https://pokeapi.co/api/v2/language/7/'
      }
    }
  ]
}

const server = setupServer(
  http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
    const url = new URL(request.url)
    const offset = url.searchParams.get('offset') || '0'
    const limit = url.searchParams.get('limit') || '30'

    return HttpResponse.json({
      ...mockPokemonListResponse,
      results: mockPokemonListResponse.results.slice(
        parseInt(offset),
        parseInt(offset) + parseInt(limit)
      )
    })
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/:idOrName', ({ params }) => {
    const { idOrName } = params

    if (idOrName === '1' || idOrName === 'bulbasaur') {
      return HttpResponse.json(mockPokemonDetails)
    }

    return new HttpResponse(null, { status: 404 })
  }),

  http.get('https://pokeapi.co/api/v2/pokemon-species/:id', ({ params }) => {
    const { id } = params

    if (id === '1') {
      return HttpResponse.json(mockPokemonSpecies)
    }

    return new HttpResponse(null, { status: 404 })
  })
)

describe('PokeAPI Service', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('getPokemonList', () => {
    it('should fetch pokemon list with default parameters', async () => {
      const result = await getPokemonList()

      expect(result).toBeDefined()
      expect(result.count).toBe(1302)
      expect(result.results).toHaveLength(2)
      expect(result.results[0]).toEqual({
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/'
      })
    })

    it('should fetch pokemon list with custom offset and limit', async () => {
      const result = await getPokemonList(10, 5)

      expect(result).toBeDefined()
      expect(result.count).toBe(1302)
      expect(result.next).toContain('offset=30&limit=30')
    })

    it('should handle empty results', async () => {
      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon', () => {
          return HttpResponse.json({
            count: 0,
            next: null,
            previous: null,
            results: []
          })
        })
      )

      const result = await getPokemonList(1000)
      expect(result.results).toHaveLength(0)
    })
  })

  describe('getPokemonDetails', () => {
    it('should fetch pokemon details by ID', async () => {
      const result = await getPokemonDetails('1')

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.name).toBe('bulbasaur')
      expect(result.height).toBe(7)
      expect(result.weight).toBe(69)
      expect(result.types).toHaveLength(2)
      expect(result.sprites.front_default).toContain('1.png')
    })

    it('should fetch pokemon details by name', async () => {
      const result = await getPokemonDetails('bulbasaur')

      expect(result).toBeDefined()
      expect(result.name).toBe('bulbasaur')
      expect(result.id).toBe(1)
    })

    it('should throw error for non-existent pokemon', async () => {
      await expect(getPokemonDetails('999999')).rejects.toThrow()
    })

    it('should have correct sprite structure', async () => {
      const result = await getPokemonDetails('1')

      expect(result.sprites).toHaveProperty('front_default')
      expect(result.sprites).toHaveProperty('other.official-artwork.front_default')
      expect(result.sprites.other['official-artwork'].front_default).toContain('official-artwork')
    })

    it('should have correct types structure', async () => {
      const result = await getPokemonDetails('1')

      expect(result.types[0]).toHaveProperty('slot')
      expect(result.types[0]).toHaveProperty('type.name')
      expect(result.types[0]).toHaveProperty('type.url')
      expect(result.types[0].type.name).toBe('grass')
    })
  })

  describe('getPokemonSpecies', () => {
    it('should fetch pokemon species information', async () => {
      const result = await getPokemonSpecies(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.name).toBe('bulbasaur')
      expect(result.flavor_text_entries).toHaveLength(2)
    })

    it('should have flavor text entries with language info', async () => {
      const result = await getPokemonSpecies(1)

      const englishEntry = result.flavor_text_entries.find(
        entry => entry.language.name === 'en'
      )

      expect(englishEntry).toBeDefined()
      expect(englishEntry?.flavor_text).toContain('strange seed')
    })

    it('should throw error for non-existent species', async () => {
      await expect(getPokemonSpecies(999999)).rejects.toThrow()
    })
  })

  describe('getPokemonIdFromUrl', () => {
    it('should extract ID from valid Pokemon URL', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/25/'
      const id = getPokemonIdFromUrl(url)

      expect(id).toBe(25)
    })

    it('should extract ID from URL with different ID', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/150/'
      const id = getPokemonIdFromUrl(url)

      expect(id).toBe(150)
    })

    it('should return 0 for invalid URL format', () => {
      const invalidUrl = 'https://pokeapi.co/api/v2/pokemon/bulbasaur'
      const id = getPokemonIdFromUrl(invalidUrl)

      expect(id).toBe(0)
    })

    it('should return 0 for completely invalid URL', () => {
      const invalidUrl = 'not-a-url'
      const id = getPokemonIdFromUrl(invalidUrl)

      expect(id).toBe(0)
    })

    it('should handle URLs without trailing slash', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/100'
      const id = getPokemonIdFromUrl(url)

      expect(id).toBe(0)
    })
  })

  describe('Error handling', () => {
    it('should handle network errors gracefully', async () => {
      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon', () => {
          return HttpResponse.error()
        })
      )

      await expect(getPokemonList()).rejects.toThrow()
    })

    it('should handle server errors (500)', async () => {
      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon/1', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(getPokemonDetails('1')).rejects.toThrow()
    })
  })
})
