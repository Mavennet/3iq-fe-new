import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import client from '../../../client'
import YouTube from 'react-youtube'
import groq from 'groq'
import ArticleText from '../../../components/NewLayout/ArticleText'
import { Container, Grid, Typography, Box } from '@mui/material'
import Button from '../../../components/NewLayout/Button'
import { isMobile } from 'react-device-detect'

function Highlights(props) {
  const {
    heading,
    videoSrc,
    firstButton,
    secondButton,
    selectedPostCategory,
    currentLanguage,
    currentCountry
  } = props

  const firstLocaleButton = firstButton && firstButton[currentLanguage?.languageTag]
  const secondLocaleButton = secondButton && secondButton[currentLanguage?.languageTag]

  const [articles, setArticles] = useState(null)

  const opts = {
    width: '100%',
    height: isMobile ? '300' : '600',
    margin: 0,
    padding: 0,
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

  const fetchCategory = async () => {
    await client
      .fetch(
        groq`*[_type == 'post' && !(_id in path('drafts.**')) && $categoryId in categories[]._ref] | order(dateTime(publishedAt) desc) {
          _id,
          _type,
          publishedAt,
        }`,
        { categoryId: selectedPostCategory._ref }
      )
      .then((response) => {
        const postsId = []
        response.map((item) => { return postsId.push(item._id) })
        const fetchArticles = async () => {
          await client
            .fetch(
              groq`
              *[_type == 'newsCard' && !(_id in path('drafts.**')) && post._ref in $postsIds] {
                _id,
                _type,
                _rev,
                'localeButtonText': buttonText,
                'localeShortDescription': shortDescription,
                'localeSmallCardText': smallCardText,
                route->,
                post-> {
                  _id,
                  _type,
                  mainImage,
                  'localeHeading': heading,
                  publishedAt,
                  categories[]-> {
                    _id,
                    _type,
                    singularName,
                    'localeName': name,
                  },
                  author-> {
                    _id,
                    _type,
                    name,
                    email,
                    profilePhoto,
                  },
                },
              } | order(dateTime(post.publishedAt) desc)[0..2]`,
              { postsIds: postsId }
            )
            .then((res) => {
              res.sort((a, b) => new Date(b.post.publishedAt) - new Date(a.post.publishedAt))
              res.map((item) => { item.route.slug.current =  currentCountry.urlTag + '/' + item.route.slug.current })
              setArticles(res)
            })
        }
        fetchArticles()
      })
  }

  useEffect(() => {
    fetchCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container sx={{ maxWidth: { sm: 'md', lg: 'lg', xl: 'xl' } }}>
      <Grid container pt={10}>
        <Grid item xs={12} mb={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap' }}>
          {
            heading && (
              <Typography
                variant="h2"
                mb={{ xs: 4, md: 0 }}
                sx={{
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: {xs: 'var(--font-size-primary-md)', md: 'var(--font-size-primary-lg)'},
                  color: 'var(--black)',
                }}
              >
                {heading}
              </Typography>
            )
          }
          <Box sx={{ display: 'flex', gap: 2 }}>
            {firstLocaleButton && (
              <Button
                variant={'outlinedBlack'}
                {...firstLocaleButton}
                size="sm"
                title={firstLocaleButton.title}
                redirectArrow
              />
            )}
            {secondLocaleButton && (
              <Button
                variant={'outlinedBlack'}
                {...secondLocaleButton}
                size="sm"
                title={secondLocaleButton.title}
                redirectArrow
              />
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={{ xs: 0, md: 3 }} sx={{ alignItems: {xs: 'flex-start', md: 'stretch'} }}>
        <Grid item xs={12} lg={8}>
          {videoSrc && (
            <iframe
            width="100%"
            height="100%"
            src={videoSrc}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
            allowfullscreen
          ></iframe>
          )}
        </Grid>
        <Grid item xs={12} lg={4} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>
          {
            articles && (
              articles.map((item, i) => {
                return (
                  <ArticleText
                    {...item}
                    currentLanguage={currentLanguage}
                    number={i}
                  />
                )
              })
            )
          }
        </Grid>
      </Grid>
    </Container>
  )
}

Highlights.propTypes = {
  heading: PropTypes.object,
  videoSrc: PropTypes.string,
  firstButton: PropTypes.object,
  secondButton: PropTypes.object,
  selectedPostCategory: PropTypes.object,
  currentLanguage: PropTypes.object,
  currentCountry: PropTypes.object
}

export default Highlights
