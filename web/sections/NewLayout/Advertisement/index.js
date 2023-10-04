import React from 'react'
import {PropTypes} from 'prop-types'
import styles from './styles.module.scss'
import {Box, Container, Grid, Modal, Link} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import Button from '../../../components/NewLayout/Button'
import client from '../../../client'
import groq from 'groq'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function Advertisement(props) {
  const {text, button, currentLanguage, color, buttonColor, body, footerText, _id} = props

  const localeButton = button[currentLanguage?.languageTag]

  const handleClickScrollGrapes = () => {
    const element = document.getElementById('onboarding')
    if (element) {
      element.scrollIntoView({behavior: 'smooth'})
    }
  }

  const handleClickScrollCareers = () => {
    const element = document.getElementById('BambooHR')
    if (element) {
      element.scrollIntoView({behavior: 'smooth'})
    }
  }

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
      *[_type == 'advertisement' && _id == $sectionId] {
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

  return (
    <Container sx={{maxWidth: {sm: 'md', md: 'lg', lg: 'xl'}, my: 4}}>
      <Grid
        container
        className={styles.advertisement}
        sx={{background: color ? color : '#0082E5'}}
        pt={{md: 6, xs: 3}}
      >
        <Grid item px={{md: 5, xs: 3}} sm={12} md={9}>
          <SimpleBlockContent blocks={text} />
        </Grid>
        <Grid item xs={12} sm={12} md={3} pl={3} pt={{xs: 3, md: 0}}>
          {localeButton.link === '#onboarding' && (
            <Button
              variant={buttonColor}
              className={`${styles.advertisement__button}`}
              {...localeButton}
              size="md"
              title={localeButton.title}
              onClick={handleClickScrollGrapes}
            />
          )}
          {localeButton.link === '#BambooHR' && (
            <Button
              variant={buttonColor}
              className={`${styles.advertisement__button}`}
              {...localeButton}
              size="md"
              title={localeButton.title}
              onClick={handleClickScrollCareers}
            />
          )}
          {!localeButton?.title.toLowerCase().includes('invest') &&
            localeButton.link !== '#onboarding' &&
            localeButton.link !== '#BambooHR' && (
              <Button
                variant={buttonColor}
                className={`${styles.advertisement__button}`}
                {...localeButton}
                size="md"
                title={localeButton.title}
              />
            )}

          {localeButton.link !== '#onboarding' && localeButton.link !== '#BambooHR' && (
            <Button
              variant={buttonColor}
              className={`${styles.advertisement__button}`}
              {...localeButton}
              size="md"
              onClick={handleOpen}
              title={localeButton?.title}
            />
          )}
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
                        if (item?.title[currentLanguage?.languageTag] && !item?.isTitleHidden) {
                          title = item.title[currentLanguage?.languageTag]
                        }
                        if (item?.images) {
                          return (
                            <Grid item xs={12} mb={4} key={i}>
                              {title && (
                                <h3 className={styles.title__image} style={{textAlign: 'center'}}>
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
        </Grid>
        <Grid item xs={12} sx={{pb: 0, mb: 0, mt: 2}}>
          <div className={styles.stripe} />
          <div className={styles.stripe} />
          <div className={styles.stripe} />
        </Grid>
      </Grid>
    </Container>
  )
}

Advertisement.propTypes = {
  buttonColor: PropTypes.string,
  title: PropTypes.string.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.boolean,
  arrow: PropTypes.boolean,
  body: PropTypes.any,
  footerText: PropTypes.any,
  _id: PropTypes.string,
}

export default Advertisement
