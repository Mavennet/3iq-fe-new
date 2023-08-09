import React from 'react'
import PropTypes from 'prop-types'
import styles from'./styles.module.scss'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Grid, Container, Modal, Button, Box } from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import RedirectButton from '../../../components/OldLayout/RedirectButton'
import { AiOutlineClose } from 'react-icons/ai'

const builder = imageUrlBuilder(client)

const theme = createTheme({
  typography: {
    fontFamily: 'Europa',
    p: {
      fontSize: 14,
    },
    h3: {
      fontSize: 50,
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

function TextAndThreeImages(props) {
  const {heading, description, backgroundImage, button, sideImage1, sideImage2, sideImage3, currentLanguage } = props

  const [open, setOpen] = React.useState(false)
  const [iframeSelected, setIframeSelected] = React.useState(null)

  const handleOpen = (iframe) => {
    setOpen(true)
    setIframeSelected(iframe)
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', md: '60%', lg: '40%' },
    height: 'auto',
    maxWidth: '1024px',
    maxHeight: '95%',
    bgcolor: '#fff',
    outline: 'none',
    overflowY: 'scroll',
    border: '8px solid #091B3F',
    p: 2,
  };

  const localeButton = button && button[currentLanguage?.languageTag]

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
          bgcolor: '#fff',
          // pt: {lg: 12, xs: 8},
          // pb: {lg: 18, xs: 14},
        }}
      >
        <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}, pt: 10, pb: 5}}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography
                id={heading}
                component="h1"
                variant="h3"
                style={{fontWeight: 'bold', color: 'black'}}
                gutterBottom
              >
                {heading}
              </Typography>
              <div className={styles.simpleBlockContent} style={{color: 'black'}}>
                {description && <SimpleBlockContent blocks={description} />}
              </div>
            </Grid>
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
        </Container>
      </Box>
    </ThemeProvider>
  )
}

TextAndThreeImages.propTypes = {
  heading: PropTypes.string,
  backgroundImage: PropTypes.object,
  description: PropTypes.any,
  button: PropTypes.object,
  sideImage1: PropTypes.object,
  sideImage2: PropTypes.object,
  sideImage3: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default TextAndThreeImages