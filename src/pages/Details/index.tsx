import { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";

import { errorMessage } from "../../components/Messages";
import { formatId } from "../../utils";

import { api } from "../../services/api";

interface ParamTypes {
  id: string;
}

interface Pokemon {
  id?: number;
  name?: string;
  abilities?: string[];
  types?: string[];
  moves?: string[];
  stats?: {
    name?: string;
    value?: number;
  }[];
}

export const Details = () => {
  const { id } = useParams<ParamTypes>();

  const [pokemon, setPokemon] = useState<Pokemon>({} as Pokemon);
  const [loading, setLoading] = useState(false);

  const getPokemon = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`pokemon/${id}`);
      setPokemon({
        ...pokemon,
        id: data.id,
        name: data.name,
        abilities: data.abilities.map((ability: any) => ability.ability.name),
        moves: data.moves.map((move: any) => move.move.name),
        types: data.types.map((type: any) => type.type.name),
        stats: data.stats.map((stats: any) => {
          return {
            name: stats.stat.name,
            value: stats.base_stat,
          };
        }),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      errorMessage("Pokemon not found!");
    }
  };

  useEffect(() => {
    if (id) {
      getPokemon(id);
    }
  }, [id]);

  useEffect(() => {
    console.log(pokemon);
  }, [pokemon]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Typography>Detalhes</Typography>
      <Typography>{pokemon?.name}</Typography>

      <img
        src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatId(
          id
        )}.png`}
      />

      {pokemon?.types?.map((type) => (
        <Typography>{type}</Typography>
      ))}
      {pokemon?.stats?.map((stat) => (
        <Typography>{`${stat.name}: ${stat.value}`}</Typography>
      ))}
      {pokemon?.abilities?.map((ability) => (
        <Typography key={ability}>{ability}</Typography>
      ))}
      {pokemon?.moves?.map((move) => (
        <Typography key={move}>{move}</Typography>
      ))}
    </div>
  );
};
