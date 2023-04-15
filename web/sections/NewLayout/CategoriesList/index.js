import React from 'react'
import PropTypes from 'prop-types'
import client from '../../../client'
import {Grid, Container, Box, useTheme, useMediaQuery} from '@mui/material'
import styles from './styles.module.scss'
import Link from 'next/link'
import groq from 'groq'
import {
  RiArticleLine,
  RiFilePaperLine,
  RiVideoLine,
  RiMailSendLine,
  RiSlideshow2Line,
  RiMic2Line,
} from 'react-icons/ri'
import {Carousel} from 'react-responsive-carousel'

function CategoriesList(props) {
  const {route, currentLanguage, categories, heading, currentCountry} = props

  const [categoriesList, setCategoriesList] = React.useState([])

  React.useEffect(() => {
    const fetchCategories = async (ids) => {
      await client
        .fetch(
          groq`
        *[_type == 'category' && _id in $categorieRef] | order(priority asc) {
          _id,
          name,
          searchId,
          priority,
        }
       `,
          {categorieRef: ids}
        )
        .then((response) => {
          response.map((item) => {
            item.searchId = currentCountry.urlTag + '/' + item.searchId
          })
          setCategoriesList(response)
        })
    }
    if (categories && categoriesList.length == 0) {
      let ids = []
      categories.forEach((categorie) => ids.push(categorie._ref))
      fetchCategories(ids)
    }
  }, [])

  const icons = {
    podcasts: <RiMic2Line />,
    articles: <RiArticleLine />,
    newsletter: <RiMailSendLine />,
    white_papers: <RiFilePaperLine />,
    webinar: <RiSlideshow2Line />,
    videos: <RiVideoLine />,
  }

  const item1 = (
    <Link
      href={{
        pathname: `/${heading}`,
        query: {slug: route.slug.current},
      }}
      as={`/${route.slug.current}`}
    >
      <a className={styles.no__decoration}>
        <div className={styles.box}>
          <Box
            className={styles.icon}
            sx={{
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              marginRight: {xs: 0, md: 1},
            }}
          >
            <RiArticleLine />
          </Box>
          {heading}
        </div>
      </a>
    </Link>
  )

  const item2 = categoriesList.map((item, i) => {
    const itemSlug = item.searchId.replaceAll('_', '-')
    return (
      <div key={item._id}>
        <Link
          href={{
            pathname: `/${itemSlug}`,
            query: {slug: itemSlug},
          }}
          as={`/${itemSlug}`}
        >
          <a className={styles.no__decoration}>
            <div className={styles.box}>
              <Box
                className={styles.icon}
                sx={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  marginRight: {xs: 0, md: 1},
                }}
              >
                {icons[item.searchId] ? icons[item.searchId] : <RiArticleLine />}
              </Box>
              {item.name[currentLanguage.languageTag]}
            </div>
          </a>
        </Link>
      </div>
    )
  })

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Container sx={{maxWidth: {sm: 'md', lg: 'lg', xl: 'xl'}}}>
      <Grid container py={10}>
        <Grid item xs={12}>
          {mobile ? (
            <Carousel
              renderIndicator={false}
              infiniteLoop="true"
              swipeable={true}
              showThumbs={false}
              showStatus={false}
            >
              <div>{item1}</div>
              {item2}
            </Carousel>
          ) : (
            <ul className={styles.list}>
              <li>
                <Link
                  href={{
                    pathname: `/${heading}`,
                    query: {slug: route.slug.current},
                  }}
                  as={`/${route.slug.current}`}
                >
                  <a className={styles.no__decoration}>{heading}</a>
                </Link>
              </li>

              {categoriesList.map((item, i) => {
                const itemSlug = item.searchId.replaceAll('_', '-')
                return (
                  <li key={item._id}>
                    <Link
                      href={{
                        pathname: `/${itemSlug}`,
                        query: {slug: itemSlug},
                      }}
                      as={`/${itemSlug}`}
                    >
                      <a className={styles.no__decoration}>
                        <div className={styles.box}>
                          <Box
                            className={styles.icon}
                            sx={{
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '50%',
                              marginRight: {xs: 0, md: 1},
                            }}
                          >
                            {icons[item.searchId] ? icons[item.searchId] : <RiArticleLine />}
                          </Box>
                          {item.name[currentLanguage.languageTag]}
                        </div>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

CategoriesList.propTypes = {
  heading: PropTypes.object,
  currentLanguage: PropTypes.object,
  route: PropTypes.object,
  categories: PropTypes.object,
  currentCountry: PropTypes.object,
}

export default CategoriesList
