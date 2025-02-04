import React from 'react'
import PropTypes from 'prop-types'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Grid, Container, Box } from '@mui/material'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import RedirectButton from '../../../components/OldLayout/RedirectButton'
import styles from'./styles.module.scss'

const theme = createTheme({
  typography: {
    fontFamily: 'Europa',
    p: {
      fontSize: 14,
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    h5: {
      fontSize: 20,
      fontWeight: 'bold'
    }
  },
})

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

function DescriptionsWithButton(props) {
  const { firstDescription, secondDescription, button, backgroundImage, currentLanguage } = props

  const localeButton = button[currentLanguage?.languageTag]

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        background: backgroundImage && `url("${urlFor(backgroundImage).url()}") no-repeat center center`,
        pt: 10,
        pb: 10,
        backgroundColor: '#D2D1D4',
        backgroundSize: 'cover',
      }}
      >
        <Container maxWidth="md" >
          <Grid container>
            <Grid item xs={12}>
              {
                firstDescription && (
                  <div className={styles.simpleBlockContent}>
                    <SimpleBlockContent blocks={firstDescription} />
                  </div>
                )
              }
            </Grid>
            <Grid item xs={12}>
              {localeButton && (localeButton.route || localeButton.link) && (
                <RedirectButton
                  {...localeButton}
                  sx={{ width: { xs: '96%', md: 180 }, padding: '10px 20px', fontSize: '16px', background: '#091B3F', borderColor: '#091B3F', color: '#fff' }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {
                secondDescription && (
                  <div className={styles.simpleBlockContent}>
                    <SimpleBlockContent blocks={secondDescription} />
                  </div>
                )
              }
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

DescriptionsWithButton.propTypes = {
  firstDescription: PropTypes.object,
  secondDescription: PropTypes.object,
  button: PropTypes.object,
  backgroundImage: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default DescriptionsWithButton
