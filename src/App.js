import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Pokedex from './Components/Pokedex';
import Topheader from './Components/Topheader';
import './style.css';
import { Navbar } from 'react-bootstrap';

const App = () => {
  const [filterList, setFilterList] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [weaknessesFil, setWeaknessesFil] = useState([]);

  const [filterTypeData, setFilterTypeData] = useState([]);
  const [filterWeekData, setFilterWeekData] = useState([]);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedWeakness, setSelectedWeakness] = useState(null);
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    axios
      .get(
        'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json'
      )
      .then((res) => {
        // console.log('data', JSON.stringify(res.data));
        let listData = res.data.pokemon;
        const typeData = [];
        const weekData = [];
        const weaknessesData = [];
        listData.map((deviceObject) => {
          deviceObject.type.map(async (type) => {
            await typeData.push(type);
          });
          deviceObject.weaknesses.map(async (weaknesses) => {
            await weekData.push(weaknesses);
          });
        });
        setTypeFilter(typeData);
        setWeaknessesFil(weekData);
        setPokemonList(listData);
        setFilterList(listData);
      })
      .then((error) => {
        console.log('error', error);
      });
  }, []);

  useEffect(() => {
    if (typeFilter.length > 0) {
      let unique = typeFilter.filter((item, i, ar) => ar.indexOf(item) === i);
      setFilterTypeData(unique);
    }
  }, [typeFilter]);

  useEffect(() => {
    if (weaknessesFil.length > 0) {
      let unique = weaknessesFil.filter(
        (item, i, ar) => ar.indexOf(item) === i
      );
      setFilterWeekData(unique);
    }
  }, [weaknessesFil]);

  const onChangeType = (type) => {
    setSelectedType(type);
  };

  const onChangeWeakness = (weaknes) => {
    setSelectedWeakness(weaknes);
  };

  const clickFilter = () => {
    let filteredType = pokemonList.filter((list) => {
      if (selectedType || selectedWeakness)
        var isType = selectedType ? list.type.includes(selectedType) : true;
      var isWeakness = selectedWeakness
        ? list.weaknesses.includes(selectedWeakness)
        : true;
      return isType && isWeakness;
    });
    setFilterList(filteredType);
    // console.log('filteredType ', filteredType );
  };

  const onClickSearch = () => {
    var searchList = pokemonList.filter((list) => {
      return list.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilterList(searchList);
  };

  return (
    <div>
      <Topheader
        typeProps={filterTypeData}
        weaknessesProps={filterWeekData}
        onChangeSelect={onChangeType}
        onSelectWeakness={onChangeWeakness}
        onClickFilter={clickFilter}
        onSearch={(value) => {
          setSearchValue(value);
          console.log('search value', value);
        }}
        clickSearch={onClickSearch}
      />
      {filterList && filterList.length > 0 ? (
        filterList.map((list) => {
          return <Pokedex key={list.id} poemonData={list} />;
        })
      ) : (
        <h1>Not Found</h1>
      )}
    </div>
  );
};

export default App;
