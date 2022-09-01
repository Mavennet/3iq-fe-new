import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import styles from './Post.module.css'
import client from '../../client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import SimpleBlockContent from '../SimpleBlockContent'
import { PortableText } from "@portabletext/react";

const builder = imageUrlBuilder(client)

const theme = createTheme()

function Post(props) {  
  const {heading, body, publishedAt, author, mainImage, currentLanguage} = props

  const localeHeading = heading[currentLanguage.languageTag]
  const localeBody = body[currentLanguage.languageTag]
  const localeAuthor = author[currentLanguage.languageTag]

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{p: 5}}>
          {mainImage &&
              (
              <Box
                component="img"
                alt="mainImage.alt"
                src={builder.image(mainImage).url()}
              />
            )
          }
          <Box sx={{pt: 5, pr: {md: 30, sm: 10}, color: '#fff', align: 'left'}}>
            <Typography component="h1" variant="h5" style={{fontWeight: 'bold', color: 'red'}} gutterBottom>
              {localeHeading}
            </Typography>
            <div className={styles.body}>
              {localeBody && <SimpleBlockContent blocks={localeBody} />}
              {localeBody && <PortableText value={localeBody} />}              
            </div>
          </Box>
          <Box sx={{pt: 5, pr: {md: 30, sm: 10}, color: '#fff', align: 'left'}}>
            <div className={styles.author}>
              {localeAuthor && <SimpleBlockContent blocks={localeAuthor.name} />}              
            </div>
            <div className={styles.publishedAt}>
              {publishedAt && <SimpleBlockContent blocks={publishedAt} />}              
            </div>            
            <div className={styles.socialMedia}>          
            </div>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

Post.propTypes = {
  mainImage: PropTypes.shape({
    asset: PropTypes.shape({
      _ref: PropTypes.string,
    }),
  }),
  heading: PropTypes.object,
  body: PropTypes.object,
  publishedAt: PropTypes.object,
  author: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default Post
