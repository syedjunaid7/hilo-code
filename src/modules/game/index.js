import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import gameStyle from "./style";
import GameAction from './game-action';
import GameZone from './game-zone';

const Game = ({

}) => {
  return (
    <Grid
      container
      sx={{
          height: 'calc(100vh - 64px)',
          padding: '32px'
      }}
    >
      <Grid item xs={12} md={4} >
        <GameAction />
      </Grid>
      <Grid item xs={12} md={8}>
        <GameZone />
      </Grid>
    </Grid>
  )
};

export default Game;