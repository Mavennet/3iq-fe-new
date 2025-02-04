import imageUrlBuilder from '@sanity/image-url'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import client from '../client'
import Layout from '../components/Layout'
import RenderSections from '../components/RenderSections'
import {getSlugVariations, slugParamToPath} from '../utils/urls'
import CookieConsent, {Cookies} from 'react-cookie-consent'
import Popup from '../components/NewLayout/Popup'
import {Box, Fab} from '@mui/material'
import {MdOutlineKeyboardControlKey} from 'react-icons/md'
import Custom404 from './404'
import ScrollTop from './ScrollTop'
import SimpleBlockContent from '../components/OldLayout/SimpleBlockContent'
import groq from 'groq'
import {
  BENEFIT_CARDS,
  DATA_COUNTRIES,
  DATA_EQUALS_SLUG,
  DATA_IN_SLUG,
  DATA_IN_SLUG_BY_PATH,
  FUND_ITEMS,
  ITEMS,
  LOCATIONS_DISPLAY,
  ROUTES,
  TAB_ITEMS,
  TEAMS,
  TIMELINES,
  FUND_CARDS
} from '../utils/groqQueries'

export const getServerSideProps = async ({params}) => {
  const dataCountries = await client.fetch(DATA_COUNTRIES)

  const countries = []

  dataCountries.map((c) => countries.push(c.urlTag))

  let country = ''
  let origCountry = ''

  if (params?.slug) {
    if (countries.indexOf(params.slug[0]) >= 0) {
      country = params.slug[0]
      origCountry = '/' + params.slug[0]
      params.slug.shift()
    } else {
      country = 'ca'
      origCountry = '/'
    }
  }

  const slug = slugParamToPath(params?.slug)

  let data

  // Frontpage - fetch the linked `frontpage` from the global configuration document.

  // Regular route
  data = await client
    .fetch(
      // Get the route document with one of the possible slugs for the given requested path
      DATA_IN_SLUG_BY_PATH,
      {possibleSlugs: getSlugVariations(country, slug)}
    )
    .then((res) => (res?.page ? {...res.page, slug} : undefined))

  if (!data?._type === 'page') {
    return {
      notFound: true,
    }
  }

  // Retrieve all routes (used later on to get the buttons routes)
  const allRoutes = await client.fetch(ROUTES)
  // Retrieve all benefit cards (used later on to get the cards details in section)
  const allBenefitCards = await client.fetch(BENEFIT_CARDS)
  const allItems = await client.fetch(ITEMS)
  // Retrieve all teams (used later on to get the our team display blocks)
  const allTeams = await client.fetch(TEAMS)
  // Retrieve all timelines (used later on to get the Our Story timeline items)
  const allTimelines = await client.fetch(TIMELINES)
  // Retrieve all Locations Display sections (used to retrieve the section locations with necessary info)
  const allLocationsDisplays = await client.fetch(LOCATIONS_DISPLAY)
  // Retrieve all Tab Items
  const allTabItems = await client.fetch(TAB_ITEMS)
  // Retrieve all Fund Items
  const allFundItems = await client.fetch(FUND_ITEMS)
  // Retrieve all Fund Cards
  const allFundCards = await client.fetch(FUND_CARDS)

  const props = {
    props:
      {
        ...data,
        dataCountries,
        currentCountry: country,
        allRoutes,
        // allPosts,
        allBenefitCards,
        allItems,
        allTeams,
        allTimelines,
        allLocationsDisplays,
        allTabItems,
        allFundItems,
        allFundCards
      } || {},
  }


  let test = JSON.stringify(props).replace(/{{LINK}}/g, origCountry)
  let fix2 = JSON.parse(test)

  let routes = fix2.props.allRoutes
  for (const x of routes) {
    let route = x.slug.current
    let check = route.substring(0,3)
    // console.log("new check")
    if (!(check === 'ae/' || check === 'ca/' || check == 'us/')) {
      route = origCountry.slice(1) + '/' + route
      x.slug.current = route
    }
  }
  fix2.props.allRoutes = routes

  // search all instance of "slug":{"_type":"slug","current":" 
  // and check for the origin country and replace it with the new country

  // Retrieve all posts (used later on to get the news cards details)
  // const allPosts = await client.fetch(
  //   groq`
  //   *[_type == 'post'] {
  //     ...,
  //     author->
  //   }
  //   `
  // )
  // console.log('allPosts', Buffer.byteLength(JSON.stringify(allPosts), 'utf8'))
  //
  // Routes filtered by the current country (can be used if necessary)
  // const countryRoutes = allRoutes.filter(route => route.slug.current.startsWith(country));

  return fix2 
}

const fetchArticles = async () => {
  await client
    .fetch(
      groq`
      *[_type == 'newsCard' {
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
            'localeName': name,
            singularName,
            ...
          },
          author-> {
            _id,
            _type,
            name,
            email,
            profilePhoto,
          },
        },
      }[0..${maxQuantity - 1}]`,
      {postsIds: id}
    )
    .then((res) => {
      res.map((item) => { item.route.slug.current =  origCountry + '/' + item.route.slug.current })
    })
}

function search(origCountry, obj, fn, results = []) {
  if (typeof obj !== "object" || obj === null) {
      if (fn(obj)) {
        let route = obj
          let temp = obj.toString()
          if (temp[0] === '/') {
            route = 'ca'+ route
            obj = route
          }
      }
      return results;
  }
  for (const [k, v] of Object.entries(obj)) {
      search(origCountry, v, fn, results);
  }
  return results;
}

let areCookiesEnabled = false

const builder = imageUrlBuilder(client)

const LandingPage = (props) => {
  const {
    title = 'Missing title',
    description,
    disallowRobots,
    openGraphImage,
    content = null,
    config = {},
    slug,
    dataCountries,
    currentCountry,
    allRoutes,
    // allPosts,
    allBenefitCards,
    allItems,
    allTeams,
    allTimelines,
    allLocationsDisplays,
    allTabItems,
    allFundItems,
    allFundCards
  } = props

  const router = useRouter()

  const getLanguageFromStorage = () => {
    const languageStorage = localStorage.getItem('lang')
    const languageSelected = country.languages.filter(
      (language) => language.languageTag === languageStorage
    )
    if (languageSelected.length > 0) {
      return languageSelected[0]
    } else {
      localStorage.setItem('lang', country.languages[0].languageTag)
      return country.languages[0]
    }
  }

  const [country] = useState(
    currentCountry
      ? dataCountries.filter((country) => country.urlTag === currentCountry)[0]
      : dataCountries.filter((country) => country.urlTag === 'ca')[0]
  )

  const [currentLanguage, setCurrentLanguage] = useState(
    typeof window !== 'undefined' && localStorage.getItem('lang')
      ? getLanguageFromStorage()
      : country.languages[0]
  )

  const switchLanguage = (lang) => {
    localStorage.setItem('lang', lang.languageTag)
    setCurrentLanguage(lang)
  }

  const [formatedContent, setFormatedContent] = useState([])
  const [formatedConfig, setFormatedConfig] = useState({
    ...config,
    switchLanguage,
    dataCountries,
    currentCountry: country,
    currentLanguage,
  })

  const [showPopUp, setShowPopUp] = useState(false)
  const [lastRoute, setLastRoute] = useState(null)

  // Custom 404 Page redirect
  if (!router.isFallback && !content && router.asPath !== '/') {
    return <Custom404 config={formatedConfig} currentLanguage={currentLanguage} />
  }

  const closePopUp = () => {
    setShowPopUp(false)
    localStorage.setItem('lastUpdate', lastRoute._id)
  }

  const fetchNewUpdates = async () => {
    await client
      .fetch(
        groq`
      *[_type == 'route'] | order(_updatedAt desc) {
        _id,
        slug,
        page
      }[0]
     `
      )
      .then((response) => {
        let storageItem = localStorage.getItem('lastUpdate')
        if (storageItem) {
          if (response._id === storageItem) {
            setShowPopUp(false)
          } else {
            setLastRoute(response)
            setShowPopUp(true)
          }
        } else {
          localStorage.setItem('lastUpdate', response._id)
        }
      })
  }

  useEffect(() => {
    if (content) {
      const contentWithDefaultLanguage = []
      content &&
        content.map((c) =>
          contentWithDefaultLanguage.push({...c, currentLanguage, currentCountry: country})
        )
      setFormatedContent(contentWithDefaultLanguage)
      fetchNewUpdates()
      config &&
        setFormatedConfig({
          ...config,
          switchLanguage,
          dataCountries,
          currentCountry: country,
          currentLanguage,
        })
    } else {
      router.replace(`/${country.urlTag}/home`)
    }
  }, [currentLanguage, config, content, country, dataCountries])

  const openGraphImages = openGraphImage
    ? [
        {
          url: builder.image(openGraphImage).width(800).height(600).url(),
          width: 800,
          height: 600,
          alt: title,
        },
        {
          // Facebook recommended size
          url: builder.image(openGraphImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: title,
        },
        {
          // Square 1:1
          url: builder.image(openGraphImage).width(600).height(600).url(),
          width: 600,
          height: 600,
          alt: title,
        },
      ]
    : []

  const localeTitle =
    title && currentLanguage.languageTag && title[currentLanguage.languageTag]
      ? title[currentLanguage?.languageTag]
      : 'Title not filled on the corresponding language for this page'
  const localeDescription =
    description && currentLanguage.languageTag && description[currentLanguage.languageTag]
      ? description[currentLanguage?.languageTag]
      : 'Description not filled on the corresponding language for this page'

  // console.log(formatedContent[0]._type)

  return (
    content && (
      <Layout config={formatedConfig} pageType={formatedContent[0] && formatedContent[0]._type}>
        <NextSeo
          title={localeTitle}
          titleTemplate={`%s | ${config.title}`}
          description={localeDescription}
          canonical={config.url && `${config.url}/${slug}`}
          openGraph={{
            images: openGraphImages,
          }}
          noindex={disallowRobots}
        />
        {formatedContent && (
          <RenderSections
            routes={allRoutes}
            benefits={allBenefitCards}
            items={allItems}
            // posts={allPosts}
            teams={allTeams}
            timelines={allTimelines}
            locationsDisplays={allLocationsDisplays}
            tabItems={allTabItems}
            fundItems={allFundItems}
            fundCards={allFundCards}
            sections={formatedContent}
          />
        )}
        <ScrollTop children={props.children}>
          <Fab size="large" aria-label="scroll back to top" color="primary">
            <MdOutlineKeyboardControlKey size="1.3em" />
          </Fab>
        </ScrollTop>
        <Box
          sx={{
            position: 'fixed',
            zIndex: '1000',
            right: 0,
            left: {xs: '5px', md: 'auto'},
            bottom: '5px',
            right: '5px',
            width: {xs: 'auto', md: '40%', lg: '30%'},
          }}
        >
          {config.newUpdatesText && showPopUp && (
            <Popup
              content={config.newUpdatesText[currentLanguage.languageTag]}
              closeHandler={closePopUp}
              route={lastRoute && lastRoute}
            />
          )}
          {!areCookiesEnabled && (
            <CookieConsent
              disableStyles={true}
              style={{
                padding: '10px 20px 20px 20px',
                background: '#F6F6F6',
                boxShadow: '5px 5px 20px #00000029',
                borderRadius: '4px',
              }}
              buttonStyle={{
                background: 'var(--light-blue)',
                border: 'none',
                color: '#fff',
                fontWeight: 'var(--font-weight-regular)',
                borderRadius: '4px',
                fontFamily: 'var(--font-family-secondary)',
                fontSize: 'var(--font-size-secondary-xs)',
                padding: '7px 20px',
                cursor: 'pointer',
              }}
              buttonText={'Ok'}
              onDecline={() => {
                areCookiesEnabled = false
                Object.keys(Cookies.get()).forEach(function (cookieName) {
                  const neededAttributes = {
                    // Here you pass the same attributes that were used when the cookie was created
                    // and are required when removing the cookie
                  }
                  Cookies.remove(cookieName, neededAttributes)
                })
              }}
              onAccept={() => {
                areCookiesEnabled = true
              }}
            >
              <Box
                sx={{
                  '& p': {
                    fontFamily: 'var(--font-family-secondary)',
                    fontSize: 'var(--font-size-secondary-sm)',
                  },
                  '& a': {
                    fontFamily: 'var(--font-family-secondary)',
                    fontSize: 'var(--font-size-secondary-sm)',
                    textDecoration: 'underline',
                  },
                }}
              >
                {config.cookiesText && (
                  <SimpleBlockContent blocks={config.cookiesText[currentLanguage.languageTag]} />
                )}
              </Box>
            </CookieConsent>
          )}
        </Box>
      </Layout>
    )
  )
}

LandingPage.propTypes = {
  title: PropTypes.object,
  description: PropTypes.object,
  slug: PropTypes.string,
  disallowRobots: PropTypes.bool,
  openGraphImage: PropTypes.any,
  content: PropTypes.any,
  config: PropTypes.any,
  dataCountries: PropTypes.array,
  currentCountry: PropTypes.string,
  allRoutes: PropTypes.any,
  // allPosts: PropTypes.any,
  allTeams: PropTypes.any,
  allTimelines: PropTypes.any,
  allLocationsDisplays: PropTypes.any,
  allTabItems: PropTypes.any,
  allFundItems: PropTypes.any,
  allFundCards: PropTypes.any,
  allBenefitCards: PropTypes.any,
  allItems: PropTypes.any,
  children: PropTypes.element.isRequired,
}

export default LandingPage
