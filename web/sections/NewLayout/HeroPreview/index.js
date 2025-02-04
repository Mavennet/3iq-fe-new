import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import styles from './styles.module.scss'
import client from '../../../client'
import {Container, Typography, Box, Grid} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import {format} from 'date-fns'
import Button from '../../../components/NewLayout/Button'
import groq from 'groq'

const builder = imageUrlBuilder(client)

function HeroPreview(props) {
  const {
    heading,
    hideHeading,
    backgroundImage,
    additionalBackgroundImage,
    greenLayout,
    shortDescription,
    buttonText,
    route,
    post,
    arrowButton,
    currentLanguage,
  } = props

  const [publishedDate, setPublishedDate] = React.useState('')
  const [categorie, setCategorie] = React.useState('')

  React.useEffect(() => {
    if (currentLanguage.languageTag && post?.publishedAt) {
      const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
      const newYears = new Date(post.publishedAt)
      const isEng = currentLanguage.name === 'EN'
      const formattedDate = format(
        newYears,
        isEng ? 'MMMM dd, yyyy - hh a' : 'dd MMMM yyyy - hh a',
        {
          locale: getLocale(currentLanguage.languageTag.replace('_', '-')),
        }
      )
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
          {categorieRef: ref}
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
          <Grid item xs={12} md={7} mb={4}>
            {arrowButton && arrowButton[currentLanguage.languageTag] && (
              <Box
                sx={{
                  width: '100%',
                  justifyContent: 'flex-end',
                  display: {xs: 'flex', md: 'none'},
                  marginBottom: 8,
                }}
              >
                <Button
                  variant={'outlinedWhite'}
                  className={styles.button}
                  {...arrowButton[currentLanguage.languageTag]}
                  size="xs"
                  title={arrowButton[currentLanguage.languageTag]?.title}
                  redirectArrow={true}
                />
              </Box>
            )}
            {currentLanguage.name === 'EN' && (
              <div id={heading} className={styles.image}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                  }}
                  alt={backgroundImage.alt}
                  src={builder.image(backgroundImage).url()}
                />
                {heading && !hideHeading && <h2 className={styles.heading}>{heading}</h2>}
              </div>
            )}
            {currentLanguage.name === 'FR' && additionalBackgroundImage && (
              <div className={styles.image}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                  }}
                  alt={additionalBackgroundImage.alt}
                  src={builder.image(additionalBackgroundImage).url()}
                />
                {heading && !hideHeading && <h2 className={styles.heading}>{heading}</h2>}
              </div>
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            {arrowButton && arrowButton[currentLanguage.languageTag] && (
              <Box
                sx={{
                  width: '100%',
                  justifyContent: 'flex-end',
                  display: {xs: 'none', md: 'flex'},
                }}
              >
                <Button
                  variant={'outlinedWhite'}
                  className={styles.button}
                  {...arrowButton[currentLanguage.languageTag]}
                  size="xs"
                  title={arrowButton[currentLanguage.languageTag]?.title}
                  redirectArrow={true}
                />
              </Box>
            )}
            {categorie?.name && (
              <Typography
                my={2}
                variant="h5"
                sx={{
                  fontSize: 'var(--font-size-secondary-md)',
                  fontFamily: 'var(--font-family-secondary)',
                  color: '#F59B1E',
                  display: greenLayout && 'none',
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
            {buttonText && route && (
              <Button
                title={buttonText}
                variant={greenLayout ? 'solidWhite' : 'solid'}
                className={styles.button}
                route={route}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

HeroPreview.propTypes = {
  heading: PropTypes.object,
  backgroundImage: PropTypes.object,
  greenLayout: PropTypes.bool,
  hideHeading: PropTypes.bool,
  shortDescription: PropTypes.object,
  buttonText: PropTypes.string,
  route: PropTypes.object,
  post: PropTypes.object,
  currentLanguage: PropTypes.object,
  arrowButton: PropTypes.object,
}

export default HeroPreview
