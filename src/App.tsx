import type { Restaurant } from './types/Restaurant'
import restaurantsData from './data/restaurants.json'

const restaurants: Restaurant[] = restaurantsData as Restaurant[]
console.log(restaurants[0].name) // debe imprimir "Casa Nuri"

function App() {
  return (
    <div>
      <h1>miCarta</h1>
    </div>
  )
}

export default App
