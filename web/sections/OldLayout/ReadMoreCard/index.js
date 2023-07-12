import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import RedirectButton from '../../../components/OldLayout/RedirectButton'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from './styles.module.scss'
import {Container, useMediaQuery} from '@mui/material'

const theme = createTheme({
  typography: {
    fontFamily: 'Europa',
    p: {
      fontSize: 14,
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    h5: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  },
})

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

function ReadMoreCard(props) {
  const {
    button,
    heading,
    backgroundImage,
    description,
    currentLanguage,
    backgroundColor,
    isInvertedLayout,
  } = props

  const localeButton = button[currentLanguage?.languageTag]

  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  const heroImage = (
    <Grid
      item
      xs={12}
      py={{xs: 20}}
      sm={4}
      md={6}
      sx={{
        background:
          backgroundImage.asset._ref &&
          `url("${urlFor(backgroundImage.asset._ref).url()}") no-repeat center center`,
        backgroundSize: 'contain', 
        bgcolor: '#091b3f',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: {xs: 3, md: 0},
      }}
    ></Grid>
  )

  const page = (
    <Grid
      container
      component="main"
      sx={{
        flexDirection: {
          xs: 'column-reverse',
          md: !isInvertedLayout ? 'unset' : 'row-reverse',
        },
      }}
    >
      {mobile && heroImage}
      <Grid item xs={12} sm={8} md={6} elevation={6} square>
        <Box
          sx={{
            mt: mobile ? 5 : 15,
            mb: mobile ? 12 : 15,
            ml: {xs: 0, md: isInvertedLayout ? 15 : 'auto'},
            mr: {xs: 0, md: 15},
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            color: '#091b3f',
          }}
        >
          {heading && (
            <Typography
              variant="h3"
              mb={{xs: 4, md: 0}}
              sx={{
                pl: {xs: 2},
                fontFamily: 'var(--font-family-primary)',
                fontSize: {
                  xs: '32px',
                  md: '42px',
                },
                color: 'var(--black)',
                mb: {xs: 2, md: 2},
              }}
            >
              {heading && currentLanguage.name === 'EN' ? (
                heading
              ) : (
                <div>
                  Découvrez notre 3iQ Outsourced Crypto Investment Office (OCIO
                  <span style={{verticalAlign: 'super', fontSize: 'medium', fontWeight: 'bold'}}>
                    MC
                  </span>
                  )
                </div>
              )}
            </Typography>
          )}
          <Box>
            {description && (
              <Box className={styles.simpleBlockContent}>
                <SimpleBlockContent blocks={description} />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              mt: {xs: 2, md: 1},
              ml: {xs: 2},
              justifyContent: {xs: 'flex-start', md: 'flex-start'},
            }}
          >
            {localeButton && (localeButton.route || localeButton.link) && (
              <RedirectButton
                {...localeButton}
                sx={{
                  width: {xs: 'auto', md: 180},
                  padding: '10px 20px',
                  margin: {xs: '0 14px 0 0', md: '0'},
                  fontSize: '16px',
                  background: '#0082E5',
                  borderColor: '#0082E5',
                  color: '#fff',
                  '&:hover': {
                    borderColor: 'var(--hover-blue)',
                    backgroundColor: 'var(--hover-blue)',
                    transition: 0.3,
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          background:
            !mobile &&
            backgroundImage.asset._ref &&
            `url("${urlFor(backgroundImage.asset._ref).url()}") no-repeat`,
          backgroundSize: '50% 100%',
          backgroundPosition: isInvertedLayout ? 'left' : 'right', // Align the background image to the right if isInvertedLayout is true
          bgcolor: backgroundColor,
        }}
      >
        {!mobile && <Container sx={{maxWidth: {sm: 'md', lg: 'lg', xl: 'xl'}}}>{page}</Container>}
        {mobile && page}
      </Box>
    </ThemeProvider>
  )
}

ReadMoreCard.propTypes = {
  button: PropTypes.object,
  description: PropTypes.string,
  backgroundImage: PropTypes.object,
  heading: PropTypes.string,
  currentLanguage: PropTypes.object,
}

export default ReadMoreCard
