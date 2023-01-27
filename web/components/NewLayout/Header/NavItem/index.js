import React from "react"
import { Box, Link } from "@mui/material"
import { getPathFromSlug } from '../../../../utils/urls'
import styles from './styles.module.scss'
import PropTypes from 'prop-types'

function NavItem(props) {
  const { route, title, _id, isLinkEnabled } = props
  return (
    <>
      <Link
        key={_id}
        href={isLinkEnabled && getPathFromSlug(route?.slug?.current)}
        sx={{textDecoration: 'none'}}
      >
        <Box
          className={styles.menuItem}
          sx={{
            width: {xs: '100%', lg: 'auto'},
            marginLeft: {xs: '0', lg: '20px'},
            padding: {xs: '12px 16px', lg: '0px'},
            textTransform: 'capitalize',
            position: 'relative'
          }}
        >{title || 'Missing'}</Box>
      </Link>
      <Link
        target="_blank" 
        key={_id}
        rel="noreferrer"
        href="https://3iq.ca/research-education"
        sx={{textDecoration: 'none'}}
      >
        <Box
          className={styles.menuItem}
          sx={{
            width: {xs: '100%', lg: 'auto'},
            marginLeft: {xs: '0', lg: '20px'},
            padding: {xs: '12px 16px', lg: '0px'},
            textTransform: 'capitalize',
            position: 'relative'
          }}
        >Research & Education</Box>
      </Link>
      <Link
        target="_blank" 
        key={_id}
        rel="noreferrer"
        href="https://3iq.ca/our-story"
        sx={{textDecoration: 'none'}}
      >
        <Box
          className={styles.menuItem}
          sx={{
            width: {xs: '100%', lg: 'auto'},
            marginLeft: {xs: '0', lg: '20px'},
            padding: {xs: '12px 16px', lg: '0px'},
            textTransform: 'capitalize',
            position: 'relative'
          }}
        >About</Box>
      </Link>
      <Link
        target="_blank" 
        key={_id}
        rel="noreferrer"
        href="https://3iq.ca/contact-us"
        sx={{textDecoration: 'none'}}
      >
        <Box
          className={styles.menuItem}
          sx={{
            width: {xs: '100%', lg: 'auto'},
            marginLeft: {xs: '0', lg: '20px'},
            padding: {xs: '12px 16px', lg: '0px'},
            textTransform: 'capitalize',
            position: 'relative'
          }}
        >Contact</Box>
      </Link>
      <Link
        target="_blank" 
        key={_id}
        rel="noreferrer"
        href="mailto:ocio@3iq.ca?subject=Website%20Inquiry:%20Hey%203iQ!"
        sx={{textDecoration: 'none'}}
      >
        <Box
          className={styles.subscribeButton}
          sx={{
            color: '#0082E5',
            width: {xs: '100%', lg: 'auto'},
            marginLeft: {xs: '0', lg: '20px'},
            padding: {xs: '12px 16px', lg: '0px'},
            textTransform: 'capitalize',
            position: 'relative'
          }}
        >Subscribe</Box>
      </Link>
    </>
  )
}

NavItem.propTypes = {
  title: PropTypes.string,
  _id: PropTypes.string,
  isLinkEnabled: PropTypes.bool,
  route: PropTypes.shape({
    slug: PropTypes.shape({
      current: PropTypes.string,
      _type: PropTypes.string
    }),
  })
}

export default NavItem
