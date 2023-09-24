import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { AppContext } from '../../../shared/context';
import { STAKE_VALUES } from '../../../shared/constants';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Dialog from '@mui/material/Dialog';

const audio = {
  click: new Audio('assets/media/click.mp3'),
};

const defaultState = {
  stake: STAKE_VALUES.DEFAULT,
  showCashoutDialog: false,
};

const GameAction = () => {
  const { appData, setAppData } = useContext(AppContext);
  const [state, setState] = useState(defaultState);

  const handlePlay = () => {
    if (!appData.isPlaying) {
      setAppData('isPlaying', true);
      setAppData(
        'gameScore',
        (appData.gameScore || []).splice(-1).map(item => ({
          ...item,
          point: 'START'
        }))
      );
      try {
        audio.click.paused && audio.click.play().catch(console.warn);;
      } catch(err) {
        console.log(`Error in playing audio file: ${err}`);
      }
    } else {
      setState(prevState => ({
        ...prevState,
        showCashoutDialog: true
      }))
    }
  };

  const totalScore = (appData.gameScore || []).reduce((acc, item) => {
    return acc + isNaN(+item.point) ? 0 : (+item.point);
  }, 0);

  // possible actionType are inc, dec, min, max
  const handleStakeChange = (actionType = 'inc') => {
    if (appData.isPlaying) {
      return;
    }
    setState(prevState => {
      let stake = prevState.stake;
      if (actionType === 'min') {
        stake = STAKE_VALUES.MIN;
      } else if (actionType === 'max') {
        stake = STAKE_VALUES.MAX;
      } else if (actionType === 'inc') {
        stake *= 2;
        if (stake > 0.00000200) {
          stake = STAKE_VALUES.MAX;
        }
      } else if (actionType === 'dec') {
        stake /= 2;
        if (stake <= 0.00000001) {
          stake = STAKE_VALUES.MIN;
        }
      }
      return {
        ...prevState,
        stake
      }
    })
  };

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          height: '100%',
          backgroundColor: '#202020',
          borderRadius: '10px 0 0 10px',
          padding: 4
        }}
      >
        <Button
          variant="contained"
          fullWidth
          size='large'
          onClick={handlePlay}
          sx={{
            cursor: appData.isPlaying ? (totalScore ? 'cursor' : 'not-allowed') : 'pointer',
            fontSize: '22px',
            background: appData.isPlaying
              ? '#444444'
              : 'linear-gradient(225deg, #77FFA8 0%, #FFE081 33%, #FFAD8E 68%, #A592FF 100%)',
            color: appData.isPlaying ? '#bcbcbc' : '#141414',
            '&:hover': {
              background: appData.isPlaying
                ? '#444444'
                : 'linear-gradient(225deg, #77FFA8 0%, #FFE081 33%, #FFAD8E 68%, #A592FF 100%)',
            }
          }}
        >

          {appData.isPlaying
            ? (totalScore ? `CASHOUT ${totalScore.toFixed(8)}` : "PICK HIGHER OR LOWER")
            : "PLAY"}
        </Button>
        <Box
          sx={{
            marginTop: 3,
            padding: 0.5,
            display: 'flex',
            justifyContent: 'space-between',
            border: '2px solid rgb(68, 68, 68)',
            borderRadius: '6px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Button
              size='small'
              variant='contained'
              sx={{
                mb: 0.25,
                background: '#444444',
                '&:hover': {
                  background: '#444444'
                },
                cursor: appData.isPlaying ? 'not-allowed' : 'pointer',
                opacity: appData.isPlaying ? 0.5 : 1,
              }}
              onClick={() => handleStakeChange('dec')}
            >
              <RemoveIcon />
            </Button>
            <Button
              size='small'
              variant='contained'
              sx={{
                fontWeight: 'bold',
                mt: 0.25,
                background: '#444444',
                '&:hover': {
                  background: '#444444'
                },
                cursor: appData.isPlaying ? 'not-allowed' : 'pointer',
                opacity: appData.isPlaying ? 0.5 : 1,
              }}
              onClick={() => handleStakeChange('min')}
            >
              MIN
            </Button>
          </Box>
          <Box
            sx={{ textAlign: 'center' }}
          >
            <Typography
              variant='h5'
              sx={{
                color: '#fff',
                opacity: appData.isPlaying ? 0.5 : 1,
              }}
            >
              {state.stake.toFixed(8)}
            </Typography>
            <Typography
              variant='h6'
              sx={{
                color: 'rgb(153, 153, 153)',
                opacity: appData.isPlaying ? 0.5 : 1,
              }}
            >
              STAKE
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Button
              size='small'
              variant='contained'
              sx={{
                mb: 0.25,
                background: '#444444',
                '&:hover': {
                  background: '#444444'
                },
                cursor: appData.isPlaying ? 'not-allowed' : 'pointer',
                opacity: appData.isPlaying ? 0.5 : 1,
              }}
              onClick={() => handleStakeChange('inc')}
            >
              <AddIcon />
            </Button>
            <Button
              size='small'
              variant='contained'
              sx={{
                fontWeight: 'bold',
                mt: 0.25,
                background: '#444444',
                '&:hover': {
                  background: '#444444'
                },
                cursor: appData.isPlaying ? 'not-allowed' : 'pointer',
                opacity: appData.isPlaying ? 0.5 : 1,
              }}
              onClick={() => handleStakeChange('max')}
            >
              MAX
            </Button>
          </Box>
        </Box>
      </Paper>
      <Dialog
        open={state.showCashoutDialog}
        onClose={() => {
          setState(prevState => ({
            ...prevState,
            showCashoutDialog: false,
          }));
          setAppData('isPlaying', false);
          setAppData('gameScore', [{
            ...((appData.gameScore || []).pop() || {}),
            point: "START"
          }]);
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(225deg, rgb(119, 255, 168) 0%, rgb(255, 224, 129) 33%, rgb(255, 173, 142) 68%, rgb(165, 146, 255) 100%)',
            width: 236,
            height: 136,
            padding: 0.5,
          }}
        >
          <Box
            sx={{
              background: 'rgb(32, 32, 32)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <Typography
              variant='h5'
              sx={{
                color: '#fff'
              }}
            >
              +{state.stake.toFixed(8)}
            </Typography>
            <Typography
              variant='h3'
              sx={{
                color: '#fff'
              }}
            >
              x{totalScore.toFixed(4)}
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </>
  )
};

export default GameAction;