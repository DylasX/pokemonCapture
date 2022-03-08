import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {
  Alert,
  Avatar,
  Button,
  CardActionArea,
  CardActions,
  Grid,
  LinearProgress,
  Modal,
  Snackbar,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import ListPokemon from '../components/ListPokemon';

const baseUrlApi = process.env.BASE_URL || 'https://pokeapi.co/api/v2/';

export interface PokemonInterface {
  name: string;
  id: number;
  height: number;
  sprites: Record<string, any>;
  totalHp: number;
}

type Status = 'success' | 'warning' | 'error';

interface CapturePokemon {
  id: number;
}

const Home: NextPage = () => {
  const [pokemon, setPokemon] = useState<PokemonInterface>({
    name: '',
    id: 0,
    height: 0,
    totalHp: 0,
    sprites: {
      other: {
        front_default: {
          ['official-artwork']: '',
        },
      },
    },
  });
  const [generatePokemon, setNewPokemon] = useState<number>(
    Math.floor(Math.random() * 151) + 1
  );
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [captured, setCaptured] = useState<PokemonInterface[]>([
    {
      name: '',
      id: 0,
      height: 0,
      totalHp: 0,
      sprites: {
        other: {
          front_default: {
            ['official-artwork']: '',
          },
        },
      },
    },
  ]);
  const [currentHpProgress, setCurrentHpProgress] = useState<number>(100);
  const [statusHp, setStatusHp] = useState<Status>('success');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenSnack = () => setOpenSnack(true);
  const handleCloseSnack = () => setOpenSnack(false);

  const newPokemon = () => {
    setPokemon({
      name: '',
      id: 0,
      height: 0,
      totalHp: 0,
      sprites: {
        other: {
          front_default: {
            ['official-artwork']: '',
          },
        },
      },
    });
    setNewPokemon(Math.floor(Math.random() * 151) + 1);
  };

  const capturePokemon = (pokeballType: number) => {
    let pokeCaptureRatio = 0;
    let status = 150;
    // no hp factor used for now
    // let hpFactor = 100;
    // https://www.dragonflycave.com/mechanics/gen-i-capturing#algorithm
    switch (pokeballType) {
      case 1:
        pokeCaptureRatio = Math.floor(Math.random() * 255) + 1;
        break;
      case 2:
        pokeCaptureRatio = Math.floor(Math.random() * 200) + 1;
        break;
      case 3:
        pokeCaptureRatio = Math.floor(Math.random() * 150) + 1;
        break;
      default:
        pokeCaptureRatio = 0;
    }
    const pokeRatioStatus = pokeCaptureRatio - status;
    if (pokeRatioStatus < 0) {
      //captured return
      handleClose();
      handleOpenSnack();
      setCaptured([...captured, pokemon]);
      return localStorage.setItem(
        'capturedPokemon',
        JSON.stringify([...captured.filter((p) => p.id !== 0), pokemon])
      );
    }
  };

  const calculateDamage = (damage: number) => {
    if (currentHpProgress > 0) {
      let newHp = pokemon.totalHp - damage;
      setPokemon({ ...pokemon, totalHp: newHp });
      newHp = (newHp * currentHpProgress) / pokemon.totalHp;
      setCurrentHpProgress(newHp);
      if (newHp <= 0) {
        newPokemon();
      }
      if (currentHpProgress <= 70 && currentHpProgress >= 30) {
        setStatusHp('warning');
      }
      if (currentHpProgress <= 35) {
        setStatusHp('error');
      }
    }
  };

  useEffect(() => {
    fetch(`${baseUrlApi}pokemon/${generatePokemon}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemon({
          ...data,
          totalHp: Math.floor(Math.random() * (200 - 100)) + 100,
        });
        setCurrentHpProgress(100);
        setStatusHp('success');
      });
    if (localStorage && localStorage.getItem('capturedPokemon')) {
      setCaptured(JSON.parse(localStorage.getItem('capturedPokemon') || '[]'));
    }
  }, [generatePokemon]);

  return (
    <>
      <div className={styles.mainDiv}>
        <Head>
          <title>Pokemon capture</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className={styles.subDiv}>
          <Grid container spacing={2}>
            <Grid item xs></Grid>
            <Grid item xs={8} sx={{ marginTop: '-4vh' }}>
              <Card
                sx={{
                  maxWidth: 400,
                }}
                className={styles.cardPokemon + ' ' + styles.doubleBorder}
              >
                <CardActionArea>
                  {captured.some((el) => el.id === pokemon.id) ? (
                    <div className={styles.capturedPokemon}>
                      <Image
                        alt='Pokemon'
                        src={'/assets/images/pokeball.png'}
                        width={50}
                        height={50}
                      />
                    </div>
                  ) : (
                    ''
                  )}

                  <Image
                    alt='Pokemon'
                    loading='lazy'
                    src={
                      pokemon?.sprites?.other['official-artwork']?.front_default
                        ? pokemon.sprites.other['official-artwork']
                            .front_default
                        : '/assets/images/pokeball.png'
                    }
                    width='20'
                    height='20'
                    layout='responsive'
                  />
                  <LinearProgress
                    variant='determinate'
                    color={statusHp}
                    value={currentHpProgress}
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
                <CardActions>
                  <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'inline-flex',
                        flexGrow: 1,
                        placeContent: 'center',
                      }}
                    >
                      {captured.some((el) => el.id === pokemon.id) ? (
                        ''
                      ) : (
                        <>
                          <Button
                            size='small'
                            onClick={handleOpen}
                            sx={{
                              fontFamily: 'OpenSans',
                              margin: '5px',
                              fontSize: '0.7rem',
                            }}
                            variant='outlined'
                            color='error'
                          >
                            Capture
                          </Button>
                          <Button
                            size='small'
                            sx={{
                              fontFamily: 'OpenSans',
                              margin: '5px',
                              fontSize: '0.7rem',
                            }}
                            variant='outlined'
                            color='error'
                            onClick={() =>
                              calculateDamage(
                                Math.floor(Math.random() * 50) + 1
                              )
                            }
                          >
                            Attack
                          </Button>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        size='small'
                        sx={{ fontFamily: 'OpenSans', fontSize: '0.7rem' }}
                        variant='outlined'
                        color='error'
                        onClick={newPokemon}
                      >
                        Run
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs></Grid>
          </Grid>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box className={styles.modal}>
            <Typography
              id='modal-modal-title'
              sx={{
                fontFamily: 'OpenSans',
                textAlign: 'center',
              }}
              variant='h6'
              component='h2'
            >
              Choose your pokeball
            </Typography>
            <div className={styles.pokeballMenu}>
              <Image
                alt='Pokemon'
                src={'/assets/images/pokeball1.png'}
                width={50}
                height={50}
                onClick={() => {
                  capturePokemon(1);
                }}
                className={styles.pokeball}
              />
              <Image
                alt='Pokemon'
                src={'/assets/images/greatball.png'}
                width={50}
                height={50}
                onClick={() => {
                  capturePokemon(2);
                }}
                className={styles.pokeball}
              />
              <Image
                alt='Pokemon'
                src={'/assets/images/ultraball.png'}
                width={50}
                height={50}
                onClick={() => {
                  capturePokemon(3);
                }}
                className={styles.pokeball}
              />
            </div>
          </Box>
        </Modal>
        <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Alert
            onClose={handleCloseSnack}
            severity='success'
            sx={{ width: '100%', fontFamily: 'OpenSans' }}
          >
            Pokemon captured!
          </Alert>
        </Snackbar>
      </div>
      <div>
        <Typography
          sx={{
            fontFamily: 'OpenSans',
            textAlign: 'center',
          }}
          variant='h6'
          component='h2'
        >
          Captured pokemon
        </Typography>
        <ListPokemon />
      </div>
    </>
  );
};

export default Home;
