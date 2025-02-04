import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {Grid, Box, Typography, CssBaseline, Link, Container, AppBar, Modal} from '@mui/material'
import {FaTwitter, FaLinkedinIn, FaYoutube} from 'react-icons/fa'
import {RiMailSendLine} from 'react-icons/ri'
import {BiMap, BiTime, BiGlobe} from 'react-icons/bi'
import {BsTelephone} from 'react-icons/bs'
import styles from './styles.module.scss'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import {getPathFromSlug} from '../../../utils/urls'
import SimpleBlockContent from '../../OldLayout/SimpleBlockContent'
import Button from '../Button'

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

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

const breakArray = (array) => {
  const half = Math.ceil(array.length / 2)
  const firstHalf = array.slice(0, half)
  const secondHalf = array.slice(half)
  return {
    firstBlock: firstHalf,
    secondBlock: secondHalf,
  }
}

function Footer(props) {
  const {currentCountry, currentLanguage} = props

  const {
    footerAddress,
    footerPhoneNumber,
    footerEmail,
    footerSchedule,
    newsletterSubscribeSrc,
    braveError,
  } = currentCountry

  const [logoLanguage, setLogoLanguage] = React.useState(null)

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
  React.useEffect(() => {
    if (currentLanguage.languageTag) {
      setLogoLanguage(currentLanguage.languageTag)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage.languageTag])

  return (
    <AppBar position="static" sx={{bgcolor: '#0D1C3D', boxShadow: 'none'}}>
      <Container maxWidth={'xl'}>
        <Grid container pl={{xs: 1.5, md: 0}}>
          <Grid item md={12} py={4} sx={{display: 'flex', justifyContent: 'space-between'}}>
            {currentCountry.footerLogo && (
              <Link href={`/${currentCountry.urlTag}/home`}>
                {logoLanguage && (
                  <Box
                    component="img"
                    sx={{maxWidth: '100%'}}
                    width={150}
                    alt={currentCountry.footerLogo[logoLanguage].alt}
                    src={
                      currentCountry.footerLogo[logoLanguage] &&
                      urlFor(currentCountry.footerLogo[logoLanguage].asset._ref).url()
                    }
                  />
                )}
              </Link>
            )}
            <Box>
              <ul className={styles.social}>
                {currentCountry?.twitterUrl && (
                  <li>
                    <Link
                      href={currentCountry?.twitterUrl}
                      color="inherit"
                      target="_blank"
                      rel="noopener"
                    >
                      <FaTwitter />
                    </Link>
                  </li>
                )}
                {currentCountry?.linkedinUrl && (
                  <li>
                    <Link
                      href={currentCountry?.linkedinUrl}
                      color="inherit"
                      target="_blank"
                      rel="noopener"
                    >
                      <FaLinkedinIn />
                    </Link>
                  </li>
                )}
                {currentCountry?.youtubeUrl && (
                  <li>
                    <Link
                      href={currentCountry?.youtubeUrl}
                      color="inherit"
                      target="_blank"
                      rel="noopener"
                    >
                      <FaYoutube />
                    </Link>
                  </li>
                )}
              </ul>
            </Box>
          </Grid>
          <Grid item xs={12} container>
            <Grid item container md={3} xs={12} className={styles.block__content}>
              <Grid item container xs={12}>
                <Grid item md={2} xs={1} pt={1.5} sx={{color: '#0082E5', display: 'flex'}}>
                  <BiMap />
                </Grid>
                <Grid item md={10} xs={11} className={styles.simpleBlockContent}>
                  {footerAddress && footerAddress[currentLanguage?.languageTag] && (
                    <SimpleBlockContent blocks={footerAddress[currentLanguage?.languageTag]} />
                  )}
                </Grid>
                <Grid item md={2} xs={1} sx={{color: '#0082E5', display: 'flex'}}>
                  <BsTelephone />
                </Grid>
                <Grid item md={10} xs={11} className={styles.grid__text}>
                  {footerPhoneNumber && footerPhoneNumber[currentLanguage?.languageTag]}
                </Grid>
                <Grid item md={2} xs={1} pt={1.5} sx={{color: '#0082E5', display: 'flex'}}>
                  <RiMailSendLine />
                </Grid>
                <Grid item mt={1.5} md={10} xs={11} className={styles.grid__text}>
                  {footerEmail && (
                    <Link
                      href={`mailto:${footerEmail[currentLanguage?.languageTag]}`}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      color="inherit"
                    >
                      {footerEmail[currentLanguage?.languageTag]}
                    </Link>
                  )}
                </Grid>
                <Grid item md={2} xs={1} pt={1.5} sx={{color: '#0082E5', display: 'flex'}}>
                  <BiTime />
                </Grid>
                <Grid item md={10} xs={11} className={styles.simpleBlockContent}>
                  {footerSchedule && footerSchedule[currentLanguage?.languageTag] && (
                    <SimpleBlockContent blocks={footerSchedule[currentLanguage?.languageTag]} />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={3} xs={12} mt={{xs: 2, md: 0}} className={styles.block__content}>
              <Grid item container xs={12}>
                <Grid item md={2} xs={1} pt={1.5} sx={{color: '#0082E5'}}>
                  <BiGlobe />
                </Grid>
                <Grid item md={10} xs={11}>
                  {currentCountry?.footerSecondLeftBlockContent &&
                    currentCountry?.footerSecondLeftBlockContent[currentLanguage?.languageTag] && (
                      <div className={styles.simpleBlockContent}>
                        <SimpleBlockContent
                          blocks={
                            currentCountry?.footerSecondLeftBlockContent[
                              currentLanguage?.languageTag
                            ]
                          }
                        />
                      </div>
                    )}
                </Grid>
                <Box
                  ml={3}
                  sx={{
                    paddingBottom: {md: '100px', xs: '25px'},
                    paddingTop: {md: '0px', xs: '25px'},
                    display: 'flex',
                  }}
                >
                  <Button
                    target="_blank"
                    variant="outlineWhite"
                    {...currentCountry.footerSecondLeftBlockButton[currentLanguage?.languageTag]}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid item md={3} xs={12}>
              {currentCountry.footerNavigation &&
                currentCountry.footerNavigation.map((item, key) => {
                  return (
                    <Link
                      key={item._id}
                      href={getPathFromSlug(item?.slug?.current)}
                      underline="hover"
                      color="inherit"
                    >
                      <p className={styles.navigation}>
                        {item.localeTitle[currentLanguage?.languageTag]}
                      </p>
                    </Link>
                  )
                })}
            </Grid>
            <Grid item md={3} xs={12} mt={{xs: 2, md: 0}}>
              {currentCountry.newsletterBody && (
                <div className={styles.newsletter}>
                  <SimpleBlockContent
                    blocks={currentCountry.newsletterBody[currentLanguage?.languageTag]}
                  />
                </div>
              )}
              <Box sx={{display: 'flex', justifyContent: 'flex-start', paddingTop: 2, paddingBottom: 2}}>
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
                        height: '85%',
                        borderRadius: 4,
                        outline: 0,
                        overflow: 'auto',
                      }}
                    >
                      <div style={{fontSize: '10px', paddingBottom: '10px'}}>
                        <SimpleBlockContent
                          blocks={currentCountry?.braveError[currentLanguage?.languageTag]}
                        />
                      </div>
                      <IFrameModal iframeUrl={newsletterSubscribeSrc} />
                    </div>
                  </Modal>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{background: '#0082E5', display: {sm: 'none', md: 'block'}}}>
        {currentCountry?.footerBottomContent &&
          currentCountry?.footerBottomContent[currentLanguage?.languageTag] && (
            <div className={styles.simpleBlockContent}>
              <SimpleBlockContent
                blocks={
                  currentCountry?.footerBottomContent &&
                  currentCountry?.footerBottomContent[currentLanguage?.languageTag]
                }
              />
            </div>
          )}
      </Box>
    </AppBar>
  )
}

Footer.propTypes = {
  currentLanguage: PropTypes.object,
  currentCountry: PropTypes.object,
  newsletterSubscribeSrc: PropTypes.object,
  braveError: PropTypes.object,
}

export default withRouter(Footer)
