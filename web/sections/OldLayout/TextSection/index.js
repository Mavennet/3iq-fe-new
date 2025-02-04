import React from 'react'
import PropTypes from 'prop-types'
 import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from'./styles.module.scss'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
 import RedirectButton from '../../../components/OldLayout/RedirectButton'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import { Typography, Modal } from '@mui/material'
import YouTube from 'react-youtube'
import groq from 'groq'
import MemberCard from '../TeamsDisplay/MemberCard'
import { AiOutlineClose } from 'react-icons/ai'

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

function TextSection(props) {
  const { heading, text, videoSrc, button, currentLanguage, backgroundImage, isButtonCentralized, isGrayBackground, videoDescription, member } = props

  const localeButton = button && button[currentLanguage?.languageTag]

  const [memberSelected, setMemberSelected] = React.useState()
  const [open, setOpen] = React.useState(false)

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', md: '90%' },
    height: 'auto',
    maxWidth: '1024px',
    maxHeight: '95%',
    bgcolor: '#fff',
    outline: 'none',
    overflowY: 'scroll',
    p: 2,
  };

  const opts = {
    width: '100%',
    height: '520',
    margin: '10px',
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: 1,
      loop: 1,
      playlist: videoSrc
    }
  };

  const fetchMember = async () => {
    await client.fetch(
      groq`
      *[_type == 'person' && _id == $personId] {
        _id,
        _type,
        name,
        jobTitle,
        bio,
        profilePhoto,
        linkedinUrl,
        email,
        contactText,
        readProfileText,
      }[0]
     `,
      { personId: member[0]._ref }
    )
      .then((response) => {
        setMemberSelected(response)
      })
  }

  React.useEffect(() => {
    if (member) {
      fetchMember()
    }
  }, [member])

  return (
    <Box
      sx={{
        background:
          backgroundImage && `url("${urlFor(backgroundImage).url()}") no-repeat center center`,
        backgroundSize: 'cover',
        bgcolor: backgroundImage ? '#091b3f' : '#fff',
      }}
    >
      <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}}}>
        <Box sx={{p: 5, pr: 1, pt: 0, pl: {xs: 1}}}>
          <Grid container>
            <Grid item sm={videoSrc ? 8 : 12} xs={12}>
              <Box id={heading} sx={{pt: 5, pr: videoSrc && {md: 20, sm: 0}, align: 'left'}}>
                {heading && (
                  <Typography
                    component="h2"
                    variant="h4"
                    sx={{color: '#0082e5', fontWeight: 'bold', mb: 6}}
                  >
                    {heading}
                  </Typography>
                )}
                <div style={{background: isGrayBackground && '#e8e8ea', padding: 30}}>
                  {text && (
                    <Grid className={styles.textSection} container spacing={2}>
                      <SimpleBlockContent blocks={text} />
                    </Grid>
                  )}
                </div>
                {localeButton && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: isButtonCentralized ? 'center' : 'flex-start',
                    }}
                    onClick={() => setOpen(true)}
                  >
                    <RedirectButton {...localeButton} sx={{width: {xs: '100%', md: 250}, mt: 5}} />
                  </Box>
                )}
              </Box>
            </Grid>
            {videoSrc && (
              <Grid item md={4} sm={12} xs={12}>
                <Box
                  sx={{
                    position: {md: 'absolute', xs: 'relative'},
                    width: {xl: '20%', lg: '30%'},
                    top: {md: '300px'},
                    mt: {md: 5, xs: 5},
                  }}
                  ml={{md: 5}}
                >
                  <YouTube videoId={videoSrc} opts={opts} />
                  {videoDescription && (
                    <div className={styles.textSection} style={{textAlign: 'right'}}>
                      <SimpleBlockContent blocks={videoDescription} />
                    </div>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
      {memberSelected && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Box
              onClick={() => setOpen(false)}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mb: 2,
                cursor: 'pointer',
              }}
            >
              <AiOutlineClose size={26} />
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MemberCard
                  name={memberSelected?.name}
                  role={memberSelected?.jobTitle[currentLanguage.languageTag]}
                  image={memberSelected?.profilePhoto.asset._ref}
                  linkedin={memberSelected?.linkedinUrl}
                  showProfileBox={false}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <div className={styles.simpleBlockContent}>
                  <SimpleBlockContent blocks={memberSelected?.bio[currentLanguage?.languageTag]} />
                </div>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </Box>
  )
}

TextSection.propTypes = {
  heading: PropTypes.object,
  text: PropTypes.arrayOf(PropTypes.object),
  videoSrc: PropTypes.string,
  button: PropTypes.object,
  currentLanguage: PropTypes.object,
  backgroundImage: PropTypes.object,
  isButtonCentralized: PropTypes.bool,
  isGrayBackground: PropTypes.bool,
  videoDescription: PropTypes.object,
  member: PropTypes.object,
}

export default TextSection
