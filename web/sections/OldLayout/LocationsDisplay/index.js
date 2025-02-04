import React from 'react'
import PropTypes from 'prop-types'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Grid, Container, Box, Typography } from '@mui/material'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import Image from 'next/image'
import styles from'./styles.module.scss'
import {FaMapMarkerAlt} from 'react-icons/fa'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'

const theme = createTheme({
  typography: {
    fontFamily: 'Europa',
    h2: {
      fontSize: 34,
      color: '#0082E5',
      fontWeight: 'bold'
    },
    h3: {
      fontSize: 24,
      color: '#0082E5',
      fontWeight: 'bold'
    },
  },
})

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

function LocationsDisplay(props) {
  const { heading, locations, currentLanguage } = props

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#E8E8EA', pt: 15, pb: 15 }}>
        <Container sx={{ maxWidth: {sm: 'md', lg: 'lg'} }} >
          <Grid container>
            <Grid item xs={12} mb={5}>
              {
                heading && (
                  <Typography variant="h2" sx={{textAlign: {xs: 'center', md: 'left'}}}>{heading}</Typography>
                )
              }
            </Grid>
            <Grid container>
              {
                locations && (
                  locations.map((item, i) => {
                    return (
                      <Grid container key={i}>
                        {
                          item.googleMapsSrc && (
                            <Grid item xs={12} md={7} mb={4}>
                              <iframe
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={item.googleMapsSrc}
                                width={'100%'}
                                height={300}
                              ></iframe>
                            </Grid>
                          )
                        }
                        {
                          item.mainImage && (
                            <Grid item xs={12} md={7} mb={4}>
                              <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                                <Image
                                  src={urlFor(item.mainImage.asset._ref).url()}
                                  alt={item.mainImage.alt}
                                  layout='fill'
                                  objectFit='cover'
                                />
                              </div>
                            </Grid>
                          )
                        }
                        <Grid item xs={12} md={5} py={{md: 5}} px={{md: 10}} mb={4} ml={{xs: 8, md:0}}>
                          {
                            item.localeName && (
                              <Typography variant="h3" sx={{textAlign: {xs: 'left', md: 'left'}}}>{item.localeName[currentLanguage.languageTag]}</Typography>
                            )
                          }
                          {
                            item.localeDescription && (
                              <div className={styles.simpleBlockContent}>
                                <div className={styles.iconMap}>
                                  <FaMapMarkerAlt size={26}/>
                                </div>
                                <SimpleBlockContent blocks={item.localeDescription[currentLanguage.languageTag]} />
                              </div>
                            )
                          }
                        </Grid>
                      </Grid>
                    )
                  })
                )
              }
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

LocationsDisplay.propTypes = {
  heading: PropTypes.object,
  locations: PropTypes.object,
  currentLanguage: PropTypes.string
}

export default LocationsDisplay
