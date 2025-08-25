import { Routes, Route, Navigate } from 'react-router'
import { PokeGrid } from '../features/PokeGrid/PokeGrid'
import { Pokedex } from '../features/Pokedex/Pokedex'
import { Landing } from '../features/Landing/Landing'

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/pokegrid' element={<PokeGrid />} />
      <Route path='/pokedex/:pokemonId' element={<Pokedex />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

