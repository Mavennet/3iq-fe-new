import React from 'react'
import PropTypes from 'prop-types'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from './styles.module.scss'
import {Container, Grid, Box, Modal} from '@mui/material'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import ButtonTextArea from '../../../components/NewLayout/ButtonTextArea'
import Button from '../../../components/NewLayout/Button'

function HeroSubscribe(props) {
  const {heading, description, backgroundImage, currentLanguage, button, newsletterSubscribeSrc} =
    props

  const localeButton = button && button[currentLanguage?.languageTag]

  const IFrameModal = ({iframeUrl}) => {
    return <iframe src={iframeUrl} width="100%" height="100%"></iframe>
  }

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const localeSubscribeText = currentLanguage.name === 'EN' ? 'Subscribe' : "S'abonner"

  function urlFor(source) {
    return imageUrlBuilder(client).image(source)
  }

  return (
    <Grid container component="main">
      <Grid
        item
        xs={12}
        md={7}
        sx={{background: '#0D1C3D', position: 'relative'}}
        className={styles.align__header}
      >
        <Box
          py={{xs: 6, md: 10}}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
          }}
        >
          <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}}}>
            <Grid container>
              <Grid item xs={12}>
                <h1 id={heading} className={styles.heading}>
                  {heading}
                </h1>
                <div className={styles.simpleBlockContent}>
                  {description && <SimpleBlockContent blocks={description} />}
                </div>
                <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  <div>
                    <Button onClick={handleOpen} title={localeSubscribeText}></Button>
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
                          width: '80%',
                          maxWidth: 800,
                          height: '80%',
                          borderRadius: 4,
                          outline: 0,
                        }}
                      >
                        <IFrameModal iframeUrl={newsletterSubscribeSrc} />
                      </div>
                    </Modal>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        py={{xs: 28, md: 0}}
        md={5}
        sx={{
          background:
            backgroundImage && `url("${urlFor(backgroundImage).url()}") no-repeat center center`,
          backgroundSize: 'cover',
          bgcolor: '#091b3f',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: {xs: 'flex-end', md: 'center'},
          alignItems: 'center',
        }}
      ></Grid>
    </Grid>
  )
}

HeroSubscribe.propTypes = {
  heading: PropTypes.object,
  description: PropTypes.arrayOf(PropTypes.object),
  currentLanguage: PropTypes.object,
  backgroundImage: PropTypes.object,
  newsletterSubscribeSrc: PropTypes.object,
}

export default HeroSubscribe
