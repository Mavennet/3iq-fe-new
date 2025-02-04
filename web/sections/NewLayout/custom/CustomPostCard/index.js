import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Typography} from '@mui/material'
import styles from './styles.module.scss'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../../client'
import {format} from 'date-fns'
import Link from 'next/link'
import SimpleBlockContent from '../../../../components/OldLayout/SimpleBlockContent'

function CustomPostCard(props) {
  const {post, route, currentLanguage, localeShortDescription} = props

  const [publishedDate, setPublishedDate] = React.useState('')

  const byLocaleText = currentLanguage.name === 'EN' ? 'by' : 'par'

  const builder = imageUrlBuilder(client)

  React.useEffect(() => {
    if (currentLanguage.languageTag) {
      const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
      const newYears = new Date(post.publishedAt)
      const isEng = currentLanguage.name === 'EN'
      const formattedDate = format(newYears, isEng ? 'MMMM dd, yyyy' : 'dd MMMM yyyy', {
        locale: getLocale(currentLanguage.languageTag.replace('_', '-')),
      })
      !isEng && formattedDate.toLocaleLowerCase('fr')
      setPublishedDate(formattedDate)
    }
  }, [currentLanguage, post.publishedAt])

  return (
    <div className={styles.article__card}>
      <Grid container>
        <Grid item xs={12}>
          <div className={styles.imgGrid}>
            {post?.mainImage && route && (
              <Link
                href={{
                  pathname: `/${post?.localeHeading[currentLanguage.languageTag]}`,
                  query: {slug: route.slug.current},
                }}
                as={`/${route.slug.current}`}
              >
                <a>
                  <Image
                    src={builder.image(post?.mainImage.asset._ref).url()}
                    alt={post?.heading}
                    layout="fill"
                    objectFit="contain"
                  />
                </a>
              </Link>
            )}
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            {post?.author?.name && post?.categories[0]?.localeName[currentLanguage.languageTag] && (
              <Typography
                mt={1}
                variant="h5"
                sx={{
                  fontSize: 'var(--font-size-secondary-xs)',
                  fontFamily: 'var(--font-family-primary)',
                  color: 'var(--black)',
                }}
              >
                <span className={styles.blue}>
                  {post?.categories[0]?.localeName[currentLanguage.languageTag] + ' '}
                </span>
                {byLocaleText} {post?.author?.name}
              </Typography>
            )}
            {post?.localeHeading && route && (
              <Link
                href={{
                  pathname: `/${post?.localeHeading[currentLanguage.languageTag]}`,
                  query: {slug: route.slug.current},
                }}
                as={`/${route.slug.current}`}
              >
                <a className={styles.noDecoration}>
                  <Typography
                    component="h2"
                    variant="h2"
                    my={2}
                    sx={{
                      fontSize: 'var(--font-size-secondary-sm)',
                      fontFamily: 'var(--font-family-primary)',
                      color: 'var(--black)',
                    }}
                  >
                    {post?.localeHeading[currentLanguage.languageTag]}
                  </Typography>
                </a>
              </Link>
            )}
            {localeShortDescription && localeShortDescription[currentLanguage.languageTag] && (
              <div className={styles.description}>
                <SimpleBlockContent blocks={localeShortDescription[currentLanguage.languageTag]} />
              </div>
            )}
            {post?.publishedAt && publishedDate && (
              <Typography
                variant="h5"
                sx={{
                  fontSize: 'var(--font-size-secondary-xs)',
                  fontFamily: 'var(--font-family-secondary)',
                  color: 'var(--disabled-gray)',
                }}
              >
                {publishedDate}
              </Typography>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

CustomPostCard.propTypes = {
  post: PropTypes.object,
  route: PropTypes.object,
  currentLanguage: PropTypes.object,
  localeButtonText: PropTypes.string,
  localeSmallCardText: PropTypes.string,
}

export default CustomPostCard
