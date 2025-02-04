import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import styles from './styles.module.scss'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import { format } from 'date-fns'
import Link from 'next/link'
import { AiFillPlayCircle } from 'react-icons/ai'

function SearchCard(props) {
  const { post, route, currentLanguage, currentCountry } = props

  const [publishedDate, setPublishedDate] = React.useState('')

  const builder = imageUrlBuilder(client)

  const byLocaleText = currentLanguage.name === 'EN' ? 'by' : 'par'

  React.useEffect(() => {
    if (currentLanguage.languageTag) {
      const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
      const newYears = new Date(post.publishedAt)
      const isEng = currentLanguage.name === "EN"
      const formattedDate = format(newYears, isEng ? 'MMMM dd, yyyy' : 'dd MMMM yyyy', {
        locale: getLocale(currentLanguage.languageTag.replace('_', '-')),
      })
      !isEng && formattedDate.toLocaleLowerCase('fr')
      setPublishedDate(formattedDate)
    }
  }, [currentLanguage, post.publishedAt])

  return (
    <Link
      href={{
        pathname: `${post?.localeHeading[currentLanguage.languageTag]}`,
        query: { slug: route.slug.current },
      }}
      as={`${currentCountry.urlTag}/${route?.slug?.current}`}
      >
      <a>
        <div className={styles.article__card}>
          <Grid container>
            <Grid item xs={12}>
              <div className={styles.imgGrid}>
                {
                  post?.mainImage && route && (
                    <Image
                      src={builder.image(post?.mainImage.asset._ref).url()}
                      alt={post?.heading}
                      layout='fill'
                      objectFit='cover'
                    />
                  )
                }
                {
                  (post?.categories[0]?.searchId == 'videos' ||  post?.categories[0]?.searchId == 'webinar' ||  post?.categories[0]?.searchId == 'podcasts') && (
                    <div className={styles.play}>
                      <AiFillPlayCircle
                        size={90}
                        color={'var(--white)'}
                      />
                    </div>
                  )
                }
              </div>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                {post?.author?.name && post?.categories[0]?.singularName && post?.categories[0]?.singularName && post?.categories[0]?.singularName[currentLanguage.languageTag] && (
                  <Typography
                    mt={2}
                    variant="h5"
                    sx={{
                      fontSize: 'var(--font-size-secondary-xs)',
                      fontFamily: 'var(--font-family-secondary)',
                      color: 'var(--black)',
                    }}
                  >
                    <strong className={styles.blue}>{post?.categories[0]?.singularName && post?.categories[0]?.singularName[currentLanguage.languageTag] + ' '}</strong>
                    {byLocaleText} {post?.author?.name}
                  </Typography>
                )}
                {post?.localeHeading && route && (
                  <Link
                    href={{
                      pathname: `/${post?.localeHeading[currentLanguage.languageTag]}`,
                      query: { slug: route.slug.current },
                    }}
                    as={`${currentCountry.urlTag}/${route?.slug?.current}`}
                    >
                    <a className={styles.noDecoration}>
                      <Typography
                        component="h3"
                        variant="h3"
                        my={2}
                        sx={{
                          fontSize: 'var(--font-size-primary-xs)',
                          fontFamily: 'var(--font-family-primary)',
                          color: 'var(--black)',
                        }}
                      >
                        {post?.localeHeading[currentLanguage.languageTag]}
                      </Typography>
                    </a>
                  </Link>
                )}
                {post?.publishedAt && publishedDate && (
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: 'var(--font-size-secondary-xs)',
                      fontFamily: 'var(--font-family-secondary)',
                      color: 'var(--text-gray)',
                    }}
                  >
                    {publishedDate}
                  </Typography>
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      </a>
    </Link>
  )
}

SearchCard.propTypes = {
  post: PropTypes.object,
  route: PropTypes.object,
  currentLanguage: PropTypes.object,
  localeButtonText: PropTypes.string,
  localeSmallCardText: PropTypes.string,
  currentCountry: PropTypes.object,
}

export default SearchCard
