import { PokemonInterface } from '../../pages/index';
import { CardActionArea, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import styles from './index.module.css';

import { useEffect, useState } from 'react';
import { NextComponentType } from 'next';

const ListPokemon: NextComponentType = () => {
  let storage: any;
  const [pokemons, setPokemons] = useState<PokemonInterface[]>([
    {
      name: '',
      id: 0,
      height: 0,
      totalHp: 0,
      sprites: {
        other: {
          ['official-artwork']: {
            front_default: '',
          },
        },
      },
    },
  ]);

  if (typeof window !== 'undefined') {
    storage = localStorage.getItem('capturedPokemon');
  }

  useEffect(() => {
    if (storage) {
      setPokemons(JSON.parse(storage || '[]'));
    }
  }, [storage]);

  return (
    <Grid container spacing={1} sx={{ padding: '10px' }}>
      {pokemons.some((el) => el.id) &&
        pokemons.map((pokemon: PokemonInterface, index: number) => {
          return (
            <Grid item xs={12} sm={6} xl={3} md={3} key={index}>
              <Card
                sx={{
                  maxWidth: 400,
                }}
                className={styles.cardPokemon}
              >
                <CardActionArea>
                  <Image
                    alt='Pokemon'
                    loading='lazy'
                    src={
                      pokemon.sprites.other['official-artwork'].front_default ||
                      '/assets/images/pokeball.png'
                    }
                    width='20'
                    height='20'
                    layout='responsive'
                  />

                  <CardContent sx={{ marginTop: '50px', textAlign: 'center' }}>
                    <Typography
                      gutterBottom
                      sx={{
                        fontFamily: 'OpenSans',
                        textTransform: 'capitalize',
                      }}
                      variant='h5'
                      component='div'
                    >
                      {pokemon.name}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ fontFamily: 'OpenSans' }}
                      color='text.secondary'
                    >
                      ID: {pokemon.id}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default ListPokemon;
