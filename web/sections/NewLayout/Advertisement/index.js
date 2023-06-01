import React from 'react'
import {PropTypes} from 'prop-types'
import styles from './styles.module.scss'
import {Container, Grid} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import Button from '../../../components/NewLayout/Button'

function Advertisement(props) {
  const {text, button, currentLanguage, color, buttonColor} = props

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
          {(localeButton.link !== '#onboarding' && localeButton.link !== '#BambooHR') && (
            <Button
              variant={buttonColor}
              className={`${styles.advertisement__button}`}
              {...localeButton}
              size="md"
              title={localeButton.title}
            />
          )}
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
}

export default Advertisement
