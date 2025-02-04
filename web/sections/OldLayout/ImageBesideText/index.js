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

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

const theme = createTheme()

function ImageBesideText(props) {
  const {mainImage, heading, backgroundImage, description, button, currentLanguage } = props

  const localeButton = button[currentLanguage?.languageTag]

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main">
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={5}
          sx={{
            background:
              backgroundImage && `url("${urlFor(backgroundImage).url()}") no-repeat center center`,
            backgroundSize: 'cover',
            bgcolor: '#091b3f',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {mainImage.asset && (
            <Box
              component="img"
              sx={{
                transform: {sm: 'scale(1)', md: 'scale(1.9)'},
                display: {xs: 'none', sm: 'inherit'},
              }}
              alt={mainImage.alt}
              src={builder.image(mainImage).url()}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={8} md={7} elevation={6} square>
          <Box
            sx={{
              mt: 15,
              ml: {xs: 2, md: 10},
              mr: {xs: 2, md: 15},
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              color: '#091b3f',
            }}
          >
            <Typography component="h1" variant="h4" style={{fontWeight: 'bold'}} gutterBottom>
              {heading}
            </Typography>
            <Typography variant="p" paragraph>
              {description}
            </Typography>

            <Box
              sx={{
                mt: 5,
                mb: 5,
              }}
            >
              <Typography variant="p">April 25, 2022</Typography>
              {localeButton && (localeButton.route || localeButton.link) && (
                <RedirectButton
                  {...localeButton}
                  sx={{width: {xs: '100%', md: 180}, padding: '10px 20px'}}
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

ImageBesideText.propTypes = {
  mainImage: PropTypes.shape({
    alt: PropTypes.string,
    asset: PropTypes.shape({
      _ref: PropTypes.string,
    }),
  }),
  heading: PropTypes.object,
  backgroundImage: PropTypes.object,
  description: PropTypes.object,
  button: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default ImageBesideText
