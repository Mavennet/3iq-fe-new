import React from 'react'
import {PropTypes} from 'prop-types'
import styles from './styles.module.scss'
import {Container, Grid, Box} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import ButtonTextArea from '../../../components/NewLayout/ButtonTextArea'
import Button from '../../../components/NewLayout/Button'


function Mailchimp(props) {
  const {text, button, currentLanguage} = props

  const localeButton = button && button[currentLanguage?.languageTag]

  return (
    <Container sx={{maxWidth: {sm: 'md', lg: 'lg', xl: 'xl'}}}>
      <Grid
        container
        className={styles.mailchimp}
        mt={5}
        mb={5}
        py={{md: 6, xs: 3}}
        px={{md: 4, xs: 3}}
      >
        <Grid item sm={10}>
          <SimpleBlockContent blocks={text} />
        </Grid>
        {localeButton && (
          <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
            <Button {...localeButton} title={localeButton.title} />
          </Box>
        )}
      </Grid>
    </Container>
  )
}

Mailchimp.propTypes = {
  title: PropTypes.string.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.boolean,
  arrow: PropTypes.boolean,
  button: PropTypes.object,
}

export default Mailchimp
