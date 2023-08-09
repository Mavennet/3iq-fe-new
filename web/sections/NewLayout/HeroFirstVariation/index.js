import React from 'react'
import {PropTypes} from 'prop-types'
import styles from './styles.module.scss'
import {Box, Container, Grid} from '@mui/material'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import Button from '../../../components/NewLayout/Button'

function urlFor(source) {
  return imageUrlBuilder(client).image(source)
}

function HeroFirstVariation(props) {
  const {
    heading,
    firstButton,
    secondButton,
    backgroundImage,
    bottomImage,
    currentLanguage,
    icons,
    benefits,
  } = props

  const localeFirstButton = firstButton?.[currentLanguage?.languageTag]
  const localeSecondButton = secondButton?.[currentLanguage?.languageTag]

  //pr

  const renderBenefits = () => {
    if (benefits && icons && benefits.length == icons.length) {
      return benefits.map((b, i) => (
        <Box pr={5} mb={{md: 4, xs: 3}}>
          <Box
            component="img"
            alt={icons[i].alt}
            className={styles.icon}
            src={urlFor(icons[i].asset._ref).url()}
          />
          <Box sx={{display: 'inline'}}>
            <span className={styles.benefits}>{b[currentLanguage.languageTag]}</span>
          </Box>
        </Box>
      ))
    }
  }

  return (
    <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}}}>
      <Grid container my={6}>
        <Grid item xs={12}>
          <Box
            sx={{
              background: {
                md: backgroundImage
                  ? `url("${urlFor(backgroundImage).url()}") no-repeat center center`
                  : 'var(--light-blue)',
                xs: bottomImage
                  ? `url(${urlFor(bottomImage).url()}) no-repeat bottom var(--light-blue)`
                  : 'var(--light-blue)',
              },
              backgroundSize: {md: 'cover', xs: 'contain'},
              p: 7,
              pb: {md: 7, sm: bottomImage ? 20 : 7, xs: bottomImage ? 15 : 7},
            }}
          >
            <Grid id={heading} container>
              <Grid item xs={12} md={7}>
                <div className={styles.simple__block__content}>
                  {heading && <SimpleBlockContent blocks={heading} />}
                </div>
                <Box sx={{display: {md: 'flex', xs: 'block'}}}>{renderBenefits()}</Box>
                <div className={styles.container__buttons}>
                  {localeFirstButton && (localeFirstButton.route || localeFirstButton.link) && (
                    <Button
                      variant="solidWhite"
                      {...localeFirstButton}
                      title={localeFirstButton.title}
                    />
                  )}
                  {localeSecondButton && (localeSecondButton.route || localeSecondButton.link) && (
                    <Button
                      variant="outlinedWhite"
                      {...localeSecondButton}
                      title={localeSecondButton.title}
                    />
                  )}
                </div>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

HeroFirstVariation.propTypes = {
  heading: PropTypes.any,
  firstButton: PropTypes.object,
  secondButton: PropTypes.object,
  currentLanguage: PropTypes.object,
  backgroundImage: PropTypes.object,
}

export default HeroFirstVariation
