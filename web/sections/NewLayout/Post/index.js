import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import client from '../../../client'
import {Grid, Container, Typography, Box} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import {MdOutlineArrowForward} from 'react-icons/md'
import groq from 'groq'
import Link from 'next/link'
import YouTube from 'react-youtube'
import {NEWSCARD_BY_ID, POST_BY_ID} from '../../../utils/groqQueries'
import {format} from 'date-fns'

function Post(props) {
  const {
    body,
    currentLanguage,
    categories,
    videoSrc,
    videoText,
    publishedAt,
    currentCountry,
    relatedContent,
    caDisclaimer,
    aeDisclaimer,
    usDisclaimer,
  } = props

  const [relatedArticles, setRelatedArticles] = React.useState(null)

  const localeRelatedContent = currentLanguage.name === 'EN' ? 'Related Content' : 'Contenu Connexe'

  const opts = {
    width: '100%',
    height: '220',
    margin: '10px',
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: 1,
      loop: 1,
      playlist: videoSrc,
    },
  }

  const newYears = new Date(publishedAt)
  const formattedDate = format(newYears, 'MMMM dd, yyyy')
  caDisclaimer?.map((item) => {
    item.children[0].text = item.children[0]?.text?.replace('{{DATE}}', formattedDate)
  })

  const disclaimerText =
    caDisclaimer && currentCountry.urlTag === 'ca'
      ? caDisclaimer
      : aeDisclaimer && currentCountry.urlTag === 'ae'
      ? aeDisclaimer
      : usDisclaimer && currentCountry.urlTag === 'us'
      ? usDisclaimer
      : ''

  const fetchRelatedPosts = async (relatedContent) => {
    let relatedPostIds = []

    await Promise.all(
      relatedContent.map(async (item) => {
        const response = await client.fetch(POST_BY_ID, {id: item._ref})
        relatedPostIds.push(response._id)
      })
    )

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
              newsletterNumber,
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
            }`,
          {postsIds: relatedPostIds}
        )
        .then((res) => {
          res.sort((a, b) => new Date(b.post.publishedAt) - new Date(a.post.publishedAt))
          setRelatedArticles(res)
        })
    }
    fetchArticles()
  }

  const fetchRecentdArticles = async () => {
    await client
      .fetch(
        groq`*[_type == 'post' && !(_id in path('drafts.**')) && $categoryId in categories[]._ref && _id != $postId] | order(dateTime(publishedAt) desc) {
              _id,
              _type,
              publishedAt,
            }[0..10]`,
        {categoryId: categories[0]?._ref, postId: props._id}
      )
      .then((response) => {
        const postsId = []
        response.map((item) => {
          return postsId.push(item._id)
        })
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
                  newsletterNumber,
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
                }[0...8]`,
              {postsIds: postsId}
            )
            .then((res) => {
              res.sort((a, b) => new Date(b.post.publishedAt) - new Date(a.post.publishedAt))
              setRelatedArticles(res)
            })
        }
        fetchArticles()
      })
  }

  React.useEffect(() => {
    relatedContent ? fetchRelatedPosts(relatedContent) : fetchRecentdArticles()
  }, [])

  return (
    <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}}}>
      <Grid container my={2} spacing={4}>
        <Grid item xs={12} md={8}>
          <Grid container>
            {body && (
              <Grid item xs={12}>
                <div className={styles.simple__block__content}>
                  {body && <SimpleBlockContent blocks={body} />}
                </div>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4} my={4}>
          <Grid container>
            {videoSrc && (
              <Grid item xs={12} mb={3}>
                <Box
                  pb={3}
                  sx={{
                    borderBottom: '1px solid #b0b0b0',
                  }}
                >
                  {videoSrc && (
                    <iframe
                      width="100%"
                      height="220"
                      src={videoSrc}
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;"
                      allowfullscreen
                    ></iframe>
                  )}
                  {videoText && (
                    <Typography
                      component="h4"
                      variant="h4"
                      mt={1}
                      sx={{
                        fontSize: 'var(--font-size-primary-xs)',
                        fontFamily: 'var(--font-family-primary)',
                        fontWeight: '600',
                      }}
                    >
                      {videoText}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
            {relatedArticles && (
              <Grid item xs={12}>
                <Typography
                  component="h4"
                  variant="h4"
                  sx={{
                    fontSize: 'var(--font-size-primary-md)',
                    fontFamily: 'var(--font-family-primary)',
                  }}
                >
                  {localeRelatedContent}
                </Typography>
                <ul className={styles.related__articles}>
                  {relatedArticles.map((item) => {
                    return (
                      <li>
                        <Link
                          href={{
                            pathname: `/${item.post?.localeHeading?.[currentLanguage.languageTag]}`,
                            query: {slug: item.route.slug.current},
                          }}
                          as={`${currentCountry.urlTag}/${item.route.slug.current}`}
                        >
                          <a className={styles.no__decoration}>
                            <Typography
                              id={item.post?.localeHeading?.[currentLanguage.languageTag]}
                              component="h5"
                              variant="h5"
                              sx={{
                                fontSize: 'var(--font-size-secondary-md)',
                                fontFamily: 'var(--font-family-secondary)',
                                fontWeight: 500,
                                color: 'var(--light-blue)',
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                              }}
                            >
                              {item.post?.localeHeading?.[currentLanguage.languageTag]}
                              <MdOutlineArrowForward className={styles.icon} />
                            </Typography>
                          </a>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Box>
        <Grid container>
          <Grid item sm={12} xs={12}>
            <Box sx={{pt: 5, align: 'left'}}>
              <div style={{padding: '30px 15px'}}>
                {disclaimerText && (
                  <Grid className={styles.textSection} container spacing={2}>
                    <div className={styles.simple__block__content}>
                      <SimpleBlockContent blocks={disclaimerText} />
                    </div>
                  </Grid>
                )}
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

Post.propTypes = {
  body: PropTypes.object,
  currentLanguage: PropTypes.object,
  categories: PropTypes.object,
  videoSrc: PropTypes.string,
  videoText: PropTypes.string,
  currentCountry: PropTypes.object,
  caDisclaimer: PropTypes.object,
  aeDisclaimer: PropTypes.object,
  usDisclaimer: PropTypes.object,
}

export default Post
