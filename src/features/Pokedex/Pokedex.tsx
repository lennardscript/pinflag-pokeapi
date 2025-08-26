import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getPokemonDetails, getPokemonSpecies } from '../../services/pokeapi'

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
}

export function Pokedex() {
  const { pokemonId } = useParams<{ pokemonId: string }>()
  const idNum = pokemonId ? parseInt(pokemonId, 10) : undefined
  const navigate = useNavigate()

  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => getPokemonDetails(pokemonId!),
    enabled: !!pokemonId,
  })

  const { data: species } = useQuery({
    queryKey: ['pokemon-species', idNum],
    queryFn: () => getPokemonSpecies(idNum!),
    enabled: !!idNum && !!pokemon,
  })

  function handleBackClick() {
    navigate('/pokegrid')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Pokémon not found</h2>
          <button
            onClick={handleBackClick}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Pokémon list
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Pokémon data...</p>
        </div>
      </div>
    )
  }

  const primaryType = pokemon.types[0].type.name

  const description =
    species?.flavor_text_entries.find(entry => entry.language.name === 'en')
      ?.flavor_text.replace(/\f/g, ' ') ?? 'No description available.'

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${typeColors[primaryType] ? typeColors[primaryType].replace('bg-', 'from-') : 'from-gray-400'
        } to-gray-800`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 px-4 py-2 bg-black/80 text-white rounded-lg hover:bg-black/50 transition-colors backdrop-blur-sm"
          >
            <span>←</span>
            <span>Back to Pokémon list</span>
          </button>

          <h1 className="text-4xl font-bold text-white capitalize">{pokemon.name}</h1>

          <div className="text-white/70 font-bold text-xl">#{pokemon.id.toString().padStart(3, '0')}</div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 flex items-center justify-center">
                <img
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-64 h-64 object-contain drop-shadow-2xl"
                />
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-gray-700">Type</h3>
                <div className="flex justify-center gap-3">
                  {pokemon.types.map(typeInfo => (
                    <span
                      key={typeInfo.type.name}
                      className={`${typeColors[typeInfo.type.name] || 'bg-gray-400'} text-white font-semibold px-6 py-2 rounded-full capitalize text-lg`}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">{pokemon.height / 10}m</div>
                  <div className="text-sm text-gray-600 font-semibold">HEIGHT (HT)</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">{pokemon.weight / 10}kg</div>
                  <div className="text-sm text-gray-600 font-semibold">WEIGHT (WT)</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Base Stats</h3>
                <div className="space-y-3">
                  {pokemon.stats.map(stat => {
                    const statName = stat.stat.name
                      .replace('hp', 'HP')
                      .replace('attack', 'Attack')
                      .replace('defense', 'Defense')
                      .replace('special-attack', 'Sp. Attack')
                      .replace('special-defense', 'Sp. Defense')
                      .replace('speed', 'Speed')

                    return (
                      <div key={stat.stat.name} className="flex items-center space-x-4">
                        <div className="w-20 text-sm font-semibold text-gray-700 text-right">{statName}</div>
                        <div className="w-12 text-center font-bold text-gray-800">{stat.base_stat}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`${typeColors[primaryType] || 'bg-gray-400'} h-3 rounded-full transition-all duration-700`}
                            style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map(ability => (
                    <span
                      key={ability.ability.name}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium capitalize"
                    >
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && <span className="ml-1 text-xs text-gray-500">(Hidden)</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
