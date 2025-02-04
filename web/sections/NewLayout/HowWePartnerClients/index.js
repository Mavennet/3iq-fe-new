import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import styles from './styles.module.scss'
import client from '../../../client'
import { Container, Typography, Box, Grid, colors } from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import { format } from 'date-fns'
import Button from '../../../components/NewLayout/Button'
import groq from 'groq'

const builder = imageUrlBuilder(client)

function HowWePartnerClients(props) {
  const {
    heading,
    hideHeading,
    backgroundImage,
    greenLayout,
    shortDescription,
    buttonText,
    emailUrl,
    post,
    currentLanguage
  } = props

  const [publishedDate, setPublishedDate] = React.useState('')
  const [categorie, setCategorie] = React.useState("")

  React.useEffect(() => {
    if (currentLanguage.languageTag && post?.publishedAt) {
      const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
      const newYears = new Date(post.publishedAt)
      const isEng = currentLanguage.name === "EN"
      const formattedDate = format(newYears, isEng ? 'MMMM dd, yyyy' : 'dd MMMM yyyy', {
        locale: getLocale(currentLanguage.languageTag.replace('_', '-')),
      })
      !isEng && formattedDate.toLocaleLowerCase('fr')
      setPublishedDate(formattedDate)
    }
  }, [currentLanguage, post?.publishedAt])

  React.useEffect(() => {
    const fetchCategories = async (ref) => {
      await client
        .fetch(
          groq`
        *[_type == 'category' && _id == $categorieRef] {
          _id,
          _ref,
          name,
        }[0]
       `,
          { categorieRef: ref }
        )
        .then((response) => {
          setCategorie(response)
        })
    }

    if (post) {
      fetchCategories(post?.categories[0]?._ref)
    }
  }, [post])

  return (
    <Box py={15} className={greenLayout ? styles.green : styles.blue}>
      <Container sx={{maxWidth: {sm: 'md', lg: 'lg', xl: 'xl'}}}>
        <Grid container spacing={{xs: 0, md: 4}} sx={{display: 'flex', alignItems: 'center'}}>
          <Grid id={'How we partner with clients'} item xs={12} md={7}>
            <div className={styles.image} style={{display: 'flex', alignItems: 'flex-end'}}>
              <Box
                component="img"
                sx={{
                  width: '100%',
                }}
                alt={backgroundImage.alt}
                src={builder.image(backgroundImage).url()}
              />
              {heading && !hideHeading && (
                <div className={styles.heading}>
                  {' '}
                  <SimpleBlockContent blocks={heading} />{' '}
                </div>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={5}>
            {categorie?.name && (
              <Typography
                my={2}
                variant="h5"
                sx={{
                  fontSize: 'var(--font-size-secondary-sm)',
                  fontFamily: 'var(--font-family-secondary)',
                  color: '#F59B1E',
                }}
              >
                {categorie?.name?.[currentLanguage.languageTag]}
              </Typography>
            )}
            {post?.heading[currentLanguage.languageTag] && (
              <Typography
                component="h2"
                variant="h4"
                sx={{
                  fontSize: 'var(--font-size-primary-md)',
                  fontFamily: 'var(--font-family-primary)',
                  color: 'var(--white)',
                }}
                gutterBottom
              >
                {post.heading[currentLanguage.languageTag]}
              </Typography>
            )}
            <div className={styles.simple__block__content}>
              {shortDescription && <SimpleBlockContent blocks={shortDescription} />}
            </div>
            {publishedDate && (
              <Typography
                variant="h5"
                mb={4}
                sx={{
                  fontSize: 'var(--font-size-secondary-md)',
                  fontFamily: 'var(--font-family-secondary)',
                  color: greenLayout ? 'var(--white)' : '#A9A9A9',
                }}
              >
                {publishedDate}
              </Typography>
            )}
            {buttonText && emailUrl && (
              <Button
                title={buttonText}
                variant={'solid'}
                className={styles.button}
                link="mailto:ocio@3iq.ca?subject=Website%20Inquiry:%20Hey%203iQ!"
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

HowWePartnerClients.propTypes = {
  heading: PropTypes.object,
  backgroundImage: PropTypes.object,
  greenLayout: PropTypes.bool,
  hideHeading: PropTypes.bool,
  shortDescription: PropTypes.object,
  emailUrl: PropTypes.object,
  buttonText: PropTypes.string,
  post: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default HowWePartnerClients