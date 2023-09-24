import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CARD_TYPES, CARD_MAPPING } from '../../constants';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Chip from '@mui/material/Chip';

const Card = ({
  height = '180px',
  width = '128px',
  playingCard = {},
  disabled = true,
  type = CARD_TYPES.PLAYING_CARD,
  cardValue = '-',
  rootStyle = {},
  innerRef = null,
  cardStyle = null
}) => {
  return (
    <Paper
      ref={innerRef}
      elevation={4}
      sx={{
        ...rootStyle,
        width,
        height,
        borderRadius: 2.1,
        background: type === CARD_TYPES.PLAYING_CARD ? '#fff' :
          disabled
            ? '#444444'
            : 'linear-gradient(225deg,#77FFA8 0%,#FFE081 33%,#FFAD8E 68%,#A592FF 100%)'
      }}
    >
      {type === CARD_TYPES.PLAYING_CARD && (
        <Box sx={{ ...cardStyle, p: 2 }}>
          <Typography>
            {playingCard.value}
          </Typography>
          <Box>
            {playingCard.icon}
          </Box>
        </Box>
      )}
      {type !== CARD_TYPES.PLAYING_CARD && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              transform: (type === CARD_TYPES.LOWER_SAME || type === CARD_TYPES.LOWER) ? 'rotate(180deg)' : 'rotate(0deg)',
              '& svg': {
                height: 24,
                fill: disabled
                  ? '#999999'
                  : '#000'
              }
            }}
          >
            {CARD_MAPPING[type].icon}
          </Box>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              width: 100,
              fontWeight: 'bold',
              color: disabled
                ? '#bcbcbc'
                : '#141414'
            }}
          >
            {CARD_MAPPING[type].label}
          </Typography>
          <Chip
            label={(
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                }}
              >
                {cardValue}
              </Typography>
            )}
            sx={{
              minWidth: 100,
              borderRadius: 1,
              color: disabled
                ? 'rgb(153, 153, 153)'
                : 'rgb(255, 255, 255)',
              background: disabled
                ? 'rgb(32, 32, 32)'
                : 'rgb(20, 20, 20)'
            }}
          />
        </Box>
      )}
    </Paper>
  )
};

export default Card;