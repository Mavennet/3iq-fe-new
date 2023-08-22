import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {Grid, Container, Modal, Box, Link} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import Button from '../../../components/NewLayout/Button'
import groq from 'groq'

const builder = imageUrlBuilder(client)

const theme = createTheme({
  typography: {
    fontFamily: 'Europa',
    p: {
      fontSize: 14,
    },
    h3: {
      fontSize: 50,
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

function OcioHero(props) {
  const {
    heading,
    description,
    backgroundImage,
    buttonOne,
    buttonTwo,
    currentLanguage,
    body,
    footerText,
    currentCountry,
    _id,
  } = props

  const [open, setOpen] = React.useState(false)
  const [iframeSelected, setIframeSelected] = React.useState(null)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [images, setImages] = React.useState(null)

  const fetchImages = async () => {
    await client
      .fetch(
        groq`
      *[_type == 'ocioHero' && _id == $sectionId] {
          _id,
          _type,
          _rev,
          imagesContainers[]-> {
          _id,
          _type,
          _rev,
          images,
          isTitleHidden,
          title,
          }
       }
     `,
        {sectionId: _id}
      )
      .then((response) => {
        setImages(response)
      })
  }

  React.useEffect(() => {
    fetchImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {xs: '95%', md: '60%', lg: '40%'},
    height: 'auto',
    maxHeight: '100%',
    bgcolor: '#fff',
    outline: 'none',
    overflowY: 'scroll',
    border: '8px solid #091B3F',
    p: 2,
  }

  const localeButtonOne = buttonOne && buttonOne[currentLanguage?.languageTag]
  const localeButtonTwo = buttonTwo && buttonTwo[currentLanguage?.languageTag]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          // background:
          // backgroundImage &&
          // `url("${urlFor(backgroundImage)
          //   .url()}") no-repeat center center`,
          backgroundSize: 'cover',
          bgcolor: '#091b3f',
          // pt: {lg: 12, xs: 8},
          // pb: {lg: 18, xs: 14},
        }}
      >
        <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}}}>
          <Grid container spacing={2} pt={3} pb={3}>
            <Grid item xs={12} md={6}>
              <Typography
                id={heading}
                component="h1"
                variant="h3"
                style={{fontWeight: 'bold', color: 'white'}}
                gutterBottom
              >
                {heading && currentLanguage.name === 'EN' ? (
                  heading
                ) : heading?.includes('OCIO') ? (
                  <div>
                    Découvrez notre 3iQ Outsourced Crypto Investment Office (OCIO
                    <span style={{verticalAlign: 'super', fontSize: 'large'}}>MC</span>)
                  </div>
                ) : (
                  heading
                )}
              </Typography>
              <div className={styles.simpleBlockContent} style={{color: 'white'}}>
                {description && <SimpleBlockContent blocks={description} />}
              </div>
              <Box display="flex" justifyContent="left">
                {!images && localeButtonOne && (localeButtonOne.route || localeButtonOne.link) && (
                  <Button {...localeButtonOne} title={localeButtonOne?.title} marginRight={10} />
                )}
                <Button
                  onClick={handleOpen}
                  title={localeButtonOne?.title}
                  marginRight={10}
                ></Button>

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-title"
                  aria-describedby="modal-description"
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'white',
                      boxShadow: 24,
                      padding: 24,
                      width: '90%',
                      maxWidth: 1000,
                      height: '85%',
                      borderRadius: 4,
                      outline: 0,
                      overflow: 'auto',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '10px',
                        paddingBottom: '10px',
                        marginTop: '50px',
                        marginLeft: '50px',
                        marginRight: '50px',
                      }}
                    >
                      <SimpleBlockContent blocks={body} />
                    </div>
                    <div>
                      {images &&
                        images.map(
                          (item) =>
                            item.imagesContainers &&
                            item.imagesContainers.map((item, i) => {
                              let title = null
                              if (
                                item?.title[currentLanguage?.languageTag] &&
                                !item?.isTitleHidden
                              ) {
                                title = item.title[currentLanguage?.languageTag]
                              }
                              if (item?.images) {
                                return (
                                  <Grid item xs={12} mb={4} key={i}>
                                    {title && (
                                      <h3
                                        className={styles.title__image}
                                        style={{textAlign: 'center'}}
                                      >
                                        {title}
                                      </h3>
                                    )}
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                      }}
                                    >
                                      {item.images.map((image, i) => {
                                        if (image?.imageExternalLink) {
                                          return (
                                            <Link
                                              href={image?.imageExternalLink}
                                              key={i}
                                              target="_blank"
                                              rel="noopener noreferrer" // Added noreferrer for security
                                            >
                                              <a target="_blank" rel="noopener">
                                                <Box
                                                  component="img"
                                                  alt={image.alt}
                                                  src={builder.image(image).url()}
                                                  key={image._key}
                                                  sx={{
                                                    margin: '5px',
                                                    padding: '30px',
                                                    maxHeight: '110px',
                                                    justifyContent: 'center',
                                                  }}
                                                />
                                              </a>
                                            </Link>
                                          )
                                        } else {
                                          return (
                                            <Box
                                              component="img"
                                              alt={image.alt}
                                              src={builder.image(image).url()}
                                              key={image._key}
                                              sx={{
                                                margin: '5px',
                                                padding: '30px',
                                                maxHeight: '110px',
                                                justifyContent: 'center',
                                              }}
                                            />
                                          )
                                        }
                                      })}
                                    </Box>
                                  </Grid>
                                )
                              }
                              return null
                            })
                        )}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        paddingBottom: '10px',
                        marginLeft: '50px',
                        marginRight: '50px',
                      }}
                    >
                      <SimpleBlockContent blocks={footerText} />
                    </div>
                  </div>
                </Modal>
                {localeButtonTwo && (localeButtonTwo.route || localeButtonTwo.link) && (
                  <Button {...localeButtonTwo} title={localeButtonTwo.title} />
                )}
              </Box>
            </Grid>
            <Grid alignSelf={'center'} item xs={12} md={6}>
              <Box
                component="img"
                sx={{
                  width: '100%',
                }}
                alt={backgroundImage.alt}
                src={builder.image(backgroundImage).url()}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

OcioHero.propTypes = {
  heading: PropTypes.string,
  backgroundImage: PropTypes.object,
  description: PropTypes.any,
  button: PropTypes.object,
  isSubscriptionSrcLink: PropTypes.bool,
  isButtonReverse: PropTypes.bool,
  currentLanguage: PropTypes.object,
  body: PropTypes.any,
  footerText: PropTypes.any,
  _id: PropTypes.string,
  currentCountry: PropTypes.object,
}

export default OcioHero
