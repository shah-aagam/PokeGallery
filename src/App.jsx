import { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true); 
  const title = "Welcome To PokeGallery";

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then((response) => {
        const { results } = response.data;

        Promise.all(
          results.map((poke) => axios.get(poke.url))
        ).then((allPokemonData) => {
          const pokemonData = allPokemonData.map((res) => res.data);
          setPokemon(pokemonData);
          setFilteredPokemon(pokemonData);
          setLoading(false); 
        });
      })
      .catch((err) => {
        console.error(`Error fetching data: ${err.message}`);
        setLoading(false); 
      });
  }, []);

  useEffect(() => {
    const charactersArray = title.split('');

    const timer = setInterval(() => {
      setCharacters((prevCharacters) => [
        ...prevCharacters,
        charactersArray[prevCharacters.length],
      ]);
      if (charactersArray.length === characters.length) {
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = pokemon.filter((poke) =>
      poke.name.toLowerCase().includes(searchValue)
    );
    setFilteredPokemon(filtered);
  };

  const getBorderClass = (types) => {
    const primaryType = types[0]?.type.name;
    switch (primaryType) {
      case 'fire':
        return 'border-[#EE8130] text-[#EE8130]';
      case 'water':
        return 'border-[#6390F0] text-[#6390F0]';
      case 'grass':
        return 'border-[#7AC74C] text-[#7AC74C]';
      case 'bug':
        return 'border-[#A6B91A] text-[#A6B91A]';
      case 'normal':
        return 'border-[#A8A77A] text-[#A8A77A]';
      default:
        return '';
    }
  };

  return (
    <>
      {loading ? ( 
        <div className='flex justify-center items-center h-screen'>
          <img 
            src="https://pa1.narvii.com/6266/015de44cd7fd19725be5cf4fe31b4bb145def6b3_00.gif" 
            alt="Loading..." 
            className='w-32' 
          />
        </div>
      ) : (
        <div>
          <div className='pt-8 pb-8'>
            <div className='flex justify-center items-center '> 
              <img src="https://gifdb.com/images/high/pikachu-head-in-pokeball-r9b2ib31yv989prx.gif" className='w-28'/>
              <h1 className='text-center text-2xl font-bold'>
                {characters.map((char, index) => (
                  <span className='text-4xl' key={index}>{char}</span>
                ))}
              </h1>
            </div>

            <div className='flex justify-center p-8'>
              <input
                type='text'
                placeholder='Search Pokémon...'
                className='border rounded-md p-2 w-80 focus:outline-none focus:ring focus:border-blue-300 '
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className='flex flex-wrap justify-center gap-6'>
              {filteredPokemon.length > 0 ? (
                filteredPokemon.map((poke, index) => {
                  return (
                    <div
                      className={`bg-transparent p-4 w-72 flex flex-col items-center text-center shadow-lg rounded-tl-[60px] rounded-br-[60px] border-4 ${getBorderClass(
                        poke.types
                      )} animate-cardEntry`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      key={poke.id}
                    >
                      <p className='font-bold text-lg capitalize'>{poke.name}</p>
                      <img
                        src={poke.sprites.front_default}
                        alt={poke.name}
                        className='w-32 h-32 object-contain'
                      />

                      <p className='text-gray-700'>
                        <span className='font-bold'>Height:</span> {poke.height}
                      </p>
                      <p className='text-gray-700'>
                        <span className='font-bold'>Weight:</span> {poke.weight}
                      </p>
                      <p className='text-gray-700'>
                        <span className='font-bold'>Type:</span>{' '}
                        {poke.types.map((typeInfo) => typeInfo.type.name).join(', ')}
                      </p>
                      <p className='text-gray-700'>
                        <span className='font-bold'>Abilities:</span>{' '}
                        {poke.abilities
                          .map((abilityInfo) => abilityInfo.ability.name)
                          .join(', ')}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className='text-center text-gray-500'>
                  No Pokémon found matching your search
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
