import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '../../../shared/components/card';
import Button from '@mui/material/Button';
import RepeatTwoToneIcon from '@mui/icons-material/RepeatTwoTone';
import anime from 'animejs/lib/anime.es.js';
import { CARD_TYPES, CARD_PATTERN, CARD_VALUES, CARD_MAPPING, CARD_PATTERN_ICON } from '../../../shared/constants';
import { useContext, useEffect, useRef, useState } from 'react';
import { generateRandomNumber, getCardBaseValue } from '../../../utils';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { AppContext } from '../../../shared/context';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const audio = {
  skip: new Audio('assets/media/skip-card.mp3'),
  levelup: new Audio('assets/media/leveleup.mp3'),
  loss: new Audio('assets/media/loss.mp3'),
};

const GAME_STATUS = {
  STOPPED: 'stopped',
  PLAYING: 'playing',
};

const defaultState = {
  gameStatus: GAME_STATUS.STOPPED,
  gameScore: [],
  currentCard: {},
  nextCard: {},
  actionCards: {
    LEFT: {},
    RIGHT: {},
  },
  showChance: false,
};

const Game = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { appData, setAppData } = useContext(AppContext);
  const mainCardRef = useRef(null);
  const shuffleContainerRef = useRef(null);
  const gameScoreNewCardRef = useRef(null);
  const [state, setState] = useState(defaultState);

  const refreshCard = () => {
    if (mainCardRef.current && shuffleContainerRef.current) {
      const mainCardCloneEl = mainCardRef.current.cloneNode(true);
      mainCardCloneEl.id = "main-card_cloned";
      mainCardCloneEl.style.position = 'absolute';
      mainCardCloneEl.style.top = 0;
      shuffleContainerRef.current.appendChild(mainCardCloneEl);
      anime({
        targets: mainCardCloneEl,
        translateY: -240,
        translateX: generateRandomNumber(0,1) ? -50 : 50,
        easing: 'easeOutExpo',
        duration: 500,
        update: anim => {
          mainCardCloneEl.style.opacity = (100 - anim.progress) / 100;
        },
        complete: () => {
          mainCardCloneEl.remove();
          generateNewCard();
        }
      });
      try {
        audio.skip.paused && audio.skip.play().catch(console.warn);
      } catch(err) {
        console.log(`Error in playing audio file: ${err}`);
      }
    }
  };

  const generateNewCard = (nextCard = null) => {
    setState(prevState => ({
      ...prevState,
      currentCard: {
        value: nextCard ? nextCard.value : CARD_VALUES[generateRandomNumber(0, 12)],
        pattern: nextCard ? nextCard.pattern : CARD_PATTERN[generateRandomNumber(0, 3)]
      },
      nextCard: {
        value: CARD_VALUES[generateRandomNumber(0, 12)],
        pattern: CARD_PATTERN[generateRandomNumber(0, 3)]
      }
    }));
  };

  const generateActionCards = (currentCard = {}, nextCard = {}) => {
    const correctValue = Math.sign(getCardBaseValue(nextCard.value) - getCardBaseValue(currentCard.value));
    const correctCard = correctValue === 0
      ? CARD_TYPES.SAME
      : (
        correctValue === -1
          ? CARD_TYPES.LOWER
          : CARD_TYPES.HIGHER
      );
    let wrongCard = CARD_TYPES[Object.keys(CARD_TYPES)[generateRandomNumber(0, 4)]];
    while (
      correctCard === wrongCard ||
      (currentCard.value === 'A' && wrongCard === CARD_TYPES.LOWER) ||
      (currentCard.value === 'K' && wrongCard === CARD_TYPES.HIGHER)
    ) {
      wrongCard = CARD_TYPES[Object.keys(CARD_TYPES)[generateRandomNumber(0, 4)]];
    };

    const correctCardDirection = generateRandomNumber(0, 1)
      ? 'LEFT'
      : 'RIGHT'

    setState(prevState => ({
      ...prevState,
      actionCards: {
        [correctCardDirection]: {
          type: correctCard,
          value: generateRandomNumber(0, 9, false).toFixed(2),
          isCorrect: true,
        },
        [correctCardDirection === 'LEFT' ? 'RIGHT' : "LEFT"]: {
          type: wrongCard,
          value: generateRandomNumber(0, 9, false).toFixed(2),
          isCorrect: false,
        }
      },
    }));

    if (!appData.isPlaying) {
      setAppData('gameScore', [{
        ...state.currentCard,
        point: "START"
      }]);
    }
  };

  const handleActionClick = (result = {}) => {
    generateNewCard(state.nextCard);
    const gameScore = appData.gameScore || [];
    setAppData('gameScore', [
      ...gameScore,
      {
        ...state.nextCard,
        point: result.isCorrect ? result.value : 0,
        type: result.type
      }
    ]);
    try {
      result.isCorrect
        ? audio.levelup.paused && audio.levelup.play().catch(console.warn)
        : audio.loss.paused && audio.loss.play().catch(console.warn)
    } catch(err) {
      console.log(`Error in playing audio file: ${err}`);
    }
  };

  useEffect(() => {
    generateActionCards(
      state.currentCard,
      state.nextCard
    );
  }, [
    state.currentCard,
    state.nextCard
  ]);

  useEffect(() => {
    if (gameScoreNewCardRef.current) {
      const card = gameScoreNewCardRef.current;
      card.style.animation = 'easeIn 0.25s';
      card.style.animationTimingFunction = 'linear';
    }
    if ((appData.gameScore || []).some(item => !item.point)) {
      setAppData('isPlaying', false)
    }
  }, [appData.gameScore]);

  useEffect(() => {
    generateNewCard();
  }, []);

  return (
    <Paper
      elevation={4}
      sx={{
        height: '100%',
        backgroundColor: '#292929',
        borderRadius: '0 10px 10px 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 4
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            background: '#141414',
            padding: 0.5,
            borderRadius: '7px'
          }}
        >
          <Button
            variant={state.showChance ? 'standard' : 'contained'}
            sx={{
              mr: 0.5,
              color: state.showChance ? '#999' : '#fff',
              background: state.showChance ? '#141414' : '#323232',
              '&:hover': {
                background: state.showChance ? '#141414' : '#323232',
              }
            }}
            onClick={() => {
              setState(prevState => ({
                ...prevState,
                showChance: false
              }))
            }}
          >
            PAYOUT
          </Button>
          <Button
            variant={state.showChance ? 'contained' : 'standard'}
            sx={{
              ml: 0.5,
              color: state.showChance ? '#fff' : '#999',
              background: state.showChance ? '#323232' : '#141414',
              '&:hover': {
                background: state.showChance ? '#323232' : '#141414',
              }
            }}
            onClick={() => {
              setState(prevState => ({
                ...prevState,
                showChance: true
              }))
            }}
          >
            CHANCE
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'initial'
        }}
      >
        <Box
          onClick={() => appData.isPlaying && handleActionClick(state.actionCards.LEFT)}
          sx={{
            cursor: appData.isPlaying ? 'pointer' : 'not-allowed'
          }}
        >
          <Card
            type={state.actionCards.LEFT.type}
            cardValue={
              state.showChance
                ? `% ${(+state.actionCards.LEFT.value * 10).toFixed(2)}`
                : `X ${state.actionCards.LEFT.value}`
            }
            disabled={!appData.isPlaying}
            rootStyle={{
              mb: isMobile ? 2 : 0,
            }}
          />
        </Box>
        <Box
          ref={shuffleContainerRef}
          sx={{
            position: 'relative'
          }}
        >
          <Button
            onClick={!appData.isPlaying ? refreshCard : () => { }}
            size='small'
            variant='contained'
            sx={{
              cursor: appData.isPlaying ? 'not-allowed' : 'pointer',
              background: 'rgb(80, 80, 80)',
              position: 'absolute',
              right: -8,
              top: -16,
              padding: 0.5,
              minWidth: 0,
              '&:hover': {
                background: 'rgb(80, 80, 80)',
              }
            }}
          >
            <RepeatTwoToneIcon />
          </Button>
          <Card
            height='156px'
            innerRef={mainCardRef}
            playingCard={{
              value: state.currentCard.value,
              icon: CARD_PATTERN_ICON[state.currentCard.pattern]
            }}
            cardStyle={{
              '& p': {
                marginBottom: 2,
                fontSize: '36px',
                fontWeight: 'bold',
              },
              '& svg': {
                height: '36px',
                width: '36px',
              }
            }}
            rootStyle={{
              boxShadow: `
                rgba(255, 255, 255, 0.4) 0px 5px,
                rgba(255, 255, 255, 0.3) 0px 10px,
                rgba(255, 255, 255, 0.2) 0px 15px,
                rgba(255, 255, 255, 0.1) 0px 20px,
                rgba(255, 255, 255, 0.4) 0px 25px`
            }}
          />
        </Box>
        <Box>
          <Box
            onClick={() => appData.isPlaying && handleActionClick(state.actionCards.RIGHT)}
            sx={{
              cursor: appData.isPlaying ? 'pointer' : 'not-allowed'
            }}
          >
            <Card
              type={state.actionCards.RIGHT.type}
              cardValue={
                state.showChance
                  ? `% ${(+state.actionCards.RIGHT.value * 10).toFixed(2)}`
                  : `X ${state.actionCards.RIGHT.value}`
              }
              disabled={!appData.isPlaying}
              rootStyle={{
                mt: isMobile ? 6 : 0,
              }}
            />
          </Box>
        </Box>
      </Box>
      <Paper
        sx={{
          overflowX: 'auto',
          display: 'flex',
          background: 'rgb(20, 20, 20)',
          borderRadius: '7px',
          height: '150px',
          paddingY: '15px'
        }}
      >
        {(appData.gameScore || []).map((item, index) => (
          <Box
            key={index}
            ref={appData.gameScore.length - 1 === index ? gameScoreNewCardRef : null}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mx: 1.5,
              position: 'relative'
            }}
          >
            {index !== 0 && (
              <Paper
                elevation={4}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 32,
                  width: 32,
                  borderRadius: 2,
                  padding: 0.5,
                  position: 'absolute',
                  left: -28,
                  top: 42,
                  backgroundColor: 'rgb(80, 80, 80)',
                  '&:hover': {
                    backgroundColor: 'rgb(80, 80, 80)'
                  },
                  '& svg': {
                    fill: '#fff',
                    height: '18px'
                  }
                }}
              >
                {CARD_MAPPING[item.type].icon}
              </Paper>
            )}
            <Card
              height='120px'
              width='92px'
              playingCard={{
                value: item.value,
                icon: CARD_PATTERN_ICON[state.currentCard.pattern]
              }}
              cardStyle={{
                '& p': {
                  marginBottom: 1,
                  fontSize: '24px',
                  fontWeight: 'bold'
                }
              }}
            />
            <Chip
              label={(
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {isNaN(item.point) ? item.point : `X ${(+item.point).toFixed(2)}`}
                </Typography>
              )}
              sx={{
                marginTop: 1,
                minWidth: 92,
                borderRadius: 1,
                color: !item.point ? 'rgb(255, 150, 150)' : 'rgb(119, 255, 168)',
                background: !item.point ? 'rgb(101, 65, 65)' : 'rgb(55, 102, 72)'
              }}
            />
          </Box>
        ))}
      </Paper>
    </Paper>
  )
};

export default Game;