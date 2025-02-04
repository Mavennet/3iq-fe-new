import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import {Grid, Box, Container} from '@mui/material'
import YouTube from 'react-youtube'
import styles from './styles.module.scss'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import Script from 'next/script'

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

function ImageBesideText(props) {
  const {
    videoSrc,
    videoUrl,
    bambooHrUrl,
    heading,
    backgroundImage,
    description,
    currentLanguage,
    invertMobile,
    isInvertedLayout,
    smallImage = false,
  } = props

  const opts = {
    width: '100%',
    height: '320',
    margin: '10px',
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: 1,
      loop: 1,
      playlist: videoSrc,
    },
  }

  return (
    <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}}}>
      <Grid
        container
        py={10}
        spacing={{xs: 0, md: 4}}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: {
            xs: !invertMobile ? 'column-reverse' : false,
            md: !isInvertedLayout ? 'unset' : 'row-reverse',
          },
        }}
      >
        <Grid item xs={12} md={smallImage ? 4 : 6} lg={smallImage ? 4 : 7}>
          {backgroundImage?.asset && (
            <Box
              component="img"
              mt={4}
              sx={{
                maxWidth: '100%',
                height: 'auto',
              }}
              alt={backgroundImage.alt}
              src={builder.image(backgroundImage).url()}
            />
          )}
          {videoSrc && (
            <div>
              <YouTube videoId={videoSrc} opts={opts} />
            </div>
          )}
          {videoUrl && (
            <div>
              <video
                width="100%"
                height="100%"
                onContextMenu={(e) => e.preventDefault()}
                playsInline
                loop
                controls
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={smallImage ? 8 : 6} lg={smallImage ? 8 : 5} mt={2}>
          {description && (
            <div className={styles.simple__block__content}>
              <SimpleBlockContent blocks={description}></SimpleBlockContent>
            </div>
          )}
        </Grid>
      </Grid>
      {bambooHrUrl && (
        <>
          <div
            id="BambooHR"
            data-domain="3iq.bamboohr.com"
            data-version="1.0.0"
            data-departmentId=""
          ></div>
          <Script src={bambooHrUrl} type="text/javascript" async defer />
          <br></br>
        </>
      )}
    </Container>
  )
}

ImageBesideText.propTypes = {
  isInvertedLayout: PropTypes.bool,
  smallImage: PropTypes.bool,
  heading: PropTypes.object,
  backgroundImage: PropTypes.object,
  description: PropTypes.object,
  currentLanguage: PropTypes.object,
  videoSrc: PropTypes.string,
  videoUrl: PropTypes.string,
  bambooHrUrl: PropTypes.string,
}

export default ImageBesideText
