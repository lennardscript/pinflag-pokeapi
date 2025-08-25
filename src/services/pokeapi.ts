import axios from 'axios'

const pokeApiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
})
