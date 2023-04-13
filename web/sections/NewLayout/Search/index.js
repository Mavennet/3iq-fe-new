import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import {Container, Box, Grid} from '@mui/material'
import client from '../../../client'
import Form from '../../../components/NewLayout/Form'
import Dropdown from '../../../components/NewLayout/Dropdown'
import Button from '../../../components/NewLayout/Button'
import {
  ROUTES_BY_TERM,
  CATEGORIES,
  NEWS_CARD_BY_TERM,
  POSTS_BY_TERM,
} from '../../../utils/groqQueries'
import SearchCard from '../../../components/NewLayout/SearchCard'
import Card from '../../../components/NewLayout/Card'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import Link from 'next/link'
import {IoIosArrowDropleft} from 'react-icons/io'

function Search(props) {
  const {
    heading,
    notFoundText,
    buttonText,
    articlesLabel,
    videosLabel,
    podcastsLabel,
    digitalMarketsWeeklyLabel,
    metaverseLabel,
    pressReleasesLabel,
    digitalAssetBulletinLabel,
    prBitcoinEtfLabel,
    prEtherEtfLabel,
    prBitcoinFundLabel,
    prEtherFundLabel,
    prGlobalCryptoLabel,
    prBitcoinFundDubaiLabel,
    prDubaiLabel,
    articlesAeLabel,
    prUsLabel,
    currentLanguage,
    currentCountry,
  } = props

  const [sectionDropdownValue, setSectionDropdownValue] = useState([])
  const [filterDropdownValue, setFilterDropdownValue] = useState([])
  const [routes, setRoutes] = useState([])
  const [posts, setPosts] = useState(null)
  const [data, setData] = useState({})
  const [categories, setCategories] = useState([])
  const [sections, setSections] = useState([])
  const [singleSection, setSingleSection] = useState(null)

  const [searchTerm, setSearchTerm] = useState(null)

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const urlSearchTerm = urlParams.get('searchTerm')
  categories.length > 0 && urlSearchTerm && searchTerm == null && setSearchTerm(urlSearchTerm)

  const currCountry = currentCountry.urlTag // Canada, United States

  function showNotFoundText() {
    let show = false
    let hasData = []
    posts && categories && categories.map((c) => hasData.push(posts[c].length > 0))
    show = !(hasData.indexOf(true) >= 0)
    return show
  }

  function filterQuantity(posts, quantity = 4) {
    let filteredPosts = singleSection ? posts : posts.slice(0, quantity)
    return filteredPosts
  }

  const localeArticlesLabel =
    (articlesLabel && articlesLabel[currentLanguage].languageTag) || 'Articles & Reports'
  const localeVideosLabel =
    (videosLabel && videosLabel[currentLanguage].languageTag) || 'Videos & Webinars'
  const localePodcastsLabel =
    (podcastsLabel && podcastsLabel[currentLanguage].languageTag) || 'Podcasts'
  const localeDigitalMarketWeeklyLabel =
    (digitalMarketsWeeklyLabel && digitalMarketsWeeklyLabel[currentLanguage].languageTag) ||
    'Digital Markets Weekly'
  const localeMetaverseLabel =
    (metaverseLabel && metaverseLabel[currentLanguage].languageTag) || 'Metaverse'
  const localePressReleasesLabel =
    (pressReleasesLabel && pressReleasesLabel[currentLanguage].languageTag) || 'Press Releases'
  const localeDigitalAssetBulletin =
    (digitalAssetBulletinLabel && digitalAssetBulletinLabel[currentLanguage].languageTag) ||
    'Digital Asset Bulletin'
  const localePrBitcoinEtfLabel =
    (prBitcoinEtfLabel && prBitcoinEtfLabel[currentLanguage].languageTag) ||
    'Press Release 3iQ Bitcoin ETF'
  const localePrEtherEtfLabel =
    (prEtherEtfLabel && prEtherEtfLabel[currentLanguage].languageTag) ||
    'Press Release 3iQ Bitcoin ETF'
  const localePrBitcoinFundLabel =
    (prBitcoinFundLabel && prBitcoinFundLabel[currentLanguage].languageTag) ||
    'Press Release The Bitcoin Fund'
  const localePrEtherFundLabel =
    (prEtherFundLabel && prEtherFundLabel[currentLanguage].languageTag) ||
    'Press Release The Ether Fund'
  const localeGlobalCryptoLabel =
    (prGlobalCryptoLabel && prGlobalCryptoLabel[currentLanguage].languageTag) ||
    'Press Release 3iQ Global CryptoAsset Fund'
  const localePrBitcoinFundDubaiLabel =
    (prBitcoinFundDubaiLabel && prBitcoinFundDubaiLabel[currentLanguage].languageTag) ||
    'Press Release The Bitcoin Fund'
  const localePrDubaiLabel =
    (prDubaiLabel && prDubaiLabel[currentLanguage].languageTag) || 'Press Releases'
  const localeArticlesAeLabel =
    (articlesAeLabel && articlesAeLabel[currentLanguage].languageTag) || 'Articles & Reports'
  const localePrUsLabel = (prUsLabel && prUsLabel[currentLanguage].languageTag) || 'Press Releases'

  const caSectionDropdownItems = [
    {
      name: 'research_papers_blogs',
      label: localeArticlesLabel,
      value: 'research_papers_blogs',
    },
    {
      name: 'digital_asset_bulletin',
      label: localeDigitalAssetBulletin,
      value: 'videos_webinarss',
    },
    {
      name: 'digital_markets_weekly',
      label: localeDigitalMarketWeeklyLabel,
      value: 'digital_markets_weekly',
    },
    {
      name: 'videos_webinars',
      label: localeVideosLabel,
      value: 'videos_webinarss',
    },
    {
      name: 'podcasts',
      label: localePodcastsLabel,
      value: 'podcasts',
    },
    {
      name: 'metaverse',
      label: localeMetaverseLabel,
      value: 'metaverse',
    },
    {
      name: 'press_media',
      label: localePressReleasesLabel,
      value: 'press_media',
    },
    {
      name: 'pr_bitcoin_etf',
      label: localePrBitcoinEtfLabel,
      value: 'pr_bitcoin_etf',
    },
    {
      name: 'pr_ether_etf',
      label: localePrEtherEtfLabel,
      value: 'pr_ether_etf',
    },
    {
      name: 'pr_bitcoin_fund',
      label: localePrBitcoinFundLabel,
      value: 'pr_bitcoin_fund',
    },
    {
      name: 'pr_ether_fund',
      label: localePrEtherFundLabel,
      value: 'pr_ether_fund',
    },
    {
      name: 'pr_global_crypto',
      label: localeGlobalCryptoLabel,
      value: 'pr_global_crypto',
    },
  ]

  const aeSectionDropdownItems = [
    {
      name: 'digital_asset_bulletin',
      label: localeDigitalAssetBulletin,
      value: 'videos_webinarss',
    },
    {
      name: 'digital_markets_weekly',
      label: localeDigitalMarketWeeklyLabel,
      value: 'digital_markets_weekly',
    },
    {
      name: 'videos_webinars',
      label: localeVideosLabel,
      value: 'videos_webinarss',
    },
    {
      name: 'podcasts',
      label: localePodcastsLabel,
      value: 'podcasts',
    },
    {
      name: 'metaverse',
      label: localeMetaverseLabel,
      value: 'metaverse',
    },
    {
      name: 'pr_dubai',
      label: localePrDubaiLabel,
      value: 'pr_dubai',
    },
    {
      name: 'pr_bitcoin_fund_dubai',
      label: localePrBitcoinFundDubaiLabel,
      value: 'pr_bitcoin_fund_dubai',
    },
    {
      name: 'articles_ae',
      label: localeArticlesAeLabel,
      value: 'articles_ae',
    },
  ]

  const usSectionDropdownItems = [
    {
      name: 'digital_asset_bulletin',
      label: localeDigitalAssetBulletin,
      value: 'videos_webinarss',
    },
    {
      name: 'digital_markets_weekly',
      label: localeDigitalMarketWeeklyLabel,
      value: 'digital_markets_weekly',
    },
    {
      name: 'videos_webinars',
      label: localeVideosLabel,
      value: 'videos_webinarss',
    },
    {
      name: 'podcasts',
      label: localePodcastsLabel,
      value: 'podcasts',
    },
    {
      name: 'metaverse',
      label: localeMetaverseLabel,
      value: 'metaverse',
    },
    {
      name: 'articles_ae',
      label: localeArticlesAeLabel,
      value: 'articles_ae',
    },
    {
      name: 'pr_us',
      label: localePrUsLabel,
      value: 'pr_us',
    },
  ]

  const localeSectionDropdownItems =
    currCountry === 'ca'
      ? caSectionDropdownItems
      : currCountry === 'ae'
      ? aeSectionDropdownItems
      : currCountry === 'us'
      ? usSectionDropdownItems
      : []

  const filterDropdownItems = [
    {
      id: 2,
      name: 'relevancy',
      label: 'Relevancy',
      value: 'relevancy',
    },
    {
      id: 3,
      name: 'most_recent',
      label: 'Most Recent',
      value: 'most_recent',
    },
  ]

  function handleCardSize(cardQuantity) {
    let cardSize = 6
    if (cardQuantity !== 1) {
      if (cardQuantity < 4) {
        cardSize = 12 / cardQuantity
      } else {
        cardSize = 3
      }
    }
    return cardSize
  }

  function handleSearch(e) {
    setSearchTerm(e.target.value)
  }

  function filterSections(evt) {
    setSectionDropdownValue(evt)
    let selectedItems = []
    evt.map((item) => selectedItems.push(item.name))
    setSections(selectedItems)
  }

  function showSection(section) {
    return (
      posts &&
      ((sections.indexOf(section) >= 0 && posts[section] && posts[section].length > 0) ||
        (sections.length == 0 && posts[section] && posts[section].length > 0))
    )
  }

  function renderHeader(title, section) {
    return (
      <Box my={4} sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{display: {md: 'none', xs: 'flex'}, alignItems: 'center'}}>
          {singleSection && (
            <Box mt={1} mr={1.5}>
              <IoIosArrowDropleft
                onClick={() => setSingleSection(null)}
                className={styles.icon}
                size={30}
              />
            </Box>
          )}
          <h5>{title}</h5>
          <span className={styles.search__found__mobile}>
            Found: <strong>{posts[section] ? posts[section].length : 0}</strong> items
          </span>
        </Box>
        <Box sx={{display: {md: 'flex', xs: 'none'}, alignItems: 'center'}}>
          {singleSection && (
            <Box mt={1.2} mr={1.5}>
              <IoIosArrowDropleft
                onClick={() => setSingleSection(null)}
                className={styles.icon}
                size={35}
              />
            </Box>
          )}
          <h3>{title}</h3>
          <span className={styles.search__found}>
            Found: <strong>{posts[section] ? posts[section].length : 0}</strong> items
          </span>
        </Box>
        {!singleSection && (
          <Box>
            <Button
              title={(buttonText && buttonText[currentLanguage.languageTag]) || 'View More'}
              onClick={() => setSingleSection(section)}
              redirectArrow
              variant="outlined"
              size="xs"
            />
          </Box>
        )}
      </Box>
    )
  }

  async function search() {
    if (categories.length > 0) {
      // let webinars =
      if (
        searchTerm &&
        (searchTerm.length == 3 || (searchTerm.length > 3 && (searchTerm.length - 3) % 3 == 0))
      ) {
        await client
          .fetch(ROUTES_BY_TERM, {term: searchTerm, urlTag: currentCountry.urlTag})
          .then((res) => {
            setRoutes(res)
          })
        await client
          .fetch(POSTS_BY_TERM, {
            term: `${searchTerm}*`,
            languageTag: currentLanguage.languageTag,
          })
          .then(async (res) => {
            let postsIds = []
            res.map((p) => postsIds.push(p._id))
            await client.fetch(NEWS_CARD_BY_TERM, {postsIds}).then((res) => filterPosts(res))
          })
      }
    }
  }

  function filterOrder(evt) {
    setFilterDropdownValue(evt)
    let filteredPosts = posts
    if (filteredPosts && evt.value == 'most_recent') {
      categories.map((c) =>
        filteredPosts[c].sort((a, b) => new Date(b.post.publishedAt) - new Date(a.post.publishedAt))
      )
      setPosts(filteredPosts)
    }
    if (filteredPosts && evt.value == 'relevancy') {
      filterPosts(data, false)
    }
  }

  function filterPosts(posts, independentSearch = true) {
    let filteredPosts = {}
    categories.map((c) => (filteredPosts[c] = []))
    posts.map((p) => {
      p.post &&
        p.post.categories.map((c) => {
          categories.indexOf(c.searchId) >= 0 && filteredPosts[c.searchId].push(p)
        })
    })
    if (independentSearch && filterDropdownValue && filterDropdownValue.value == 'most_recent') {
      categories.map((c) =>
        filteredPosts[c].sort((a, b) => new Date(b.post.publishedAt) - new Date(a.post.publishedAt))
      )
    }
    setData(posts)
    setPosts(filteredPosts)
  }

  async function fetchCategories() {
    await client.fetch(CATEGORIES).then((res) => {
      let categoryIds = []
      res.map((r) => categoryIds.push(r.searchId))
      setCategories(categoryIds)
    })
  }

  useEffect(() => {
    categories && categories.length == 0 && fetchCategories()
    search()
  }, [searchTerm, filterDropdownValue])

  useEffect(() => {
    singleSection && setSections([singleSection])
  }, [singleSection])

  return (
    <>
      <Box pb={10} bgcolor={'#f9f9f9'}>
        <Container maxWidth={'lg'}>
          <Box py={2}>
            <Form
              value={searchTerm}
              onChange={(e) => handleSearch(e)}
              placeholder={'Type in your search terms and press enter'}
            />
            {!singleSection && (
              <Grid container sx={{display: {md: 'none', sm: 'flex'}}} mt={1} spacing={2}>
                <Grid item xs={6}>
                  <Dropdown
                    value={filterDropdownValue}
                    className={styles.search__dropdown__mobile}
                    title="Relevancy"
                    onChange={(e) => filterOrder(e)}
                    itens={filterDropdownItems}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Dropdown
                    value={sectionDropdownValue}
                    className={styles.search__dropdown__mobile}
                    title="All"
                    isMulti
                    onChange={(e) => filterSections(e)}
                    itens={localeSectionDropdownItems}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
          {!singleSection && (
            <>
              <Box my={2} sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  {routes.length > 0 && (
                    <>
                      <h3>Page Results</h3>
                      <span className={styles.search__found}>
                        Found: <strong>{`${routes.length} items`}</strong>
                      </span>
                    </>
                  )}
                </Box>
                <Box sx={{display: {md: 'flex', xs: 'none'}}}>
                  <Box mr={3}>
                    <Dropdown
                      value={filterDropdownValue}
                      className={styles.search__dropdown__mobile}
                      title="Relevancy"
                      onChange={(e) => filterOrder(e)}
                      itens={filterDropdownItems}
                    />
                  </Box>
                  <Box>
                    <Dropdown
                      value={sectionDropdownValue}
                      className={styles.search__dropdown}
                      title="All"
                      isMulti
                      onChange={(e) => filterSections(e)}
                      itens={localeSectionDropdownItems}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{display: 'block'}}>
                {routes.map((route) => (
                  <Link
                    href={{
                      pathname: '/LandingPage',
                      query: {slug: route.slug.current},
                    }}
                    as={`/${route.slug.current}`}
                  >
                    <h5 className={styles.search__route}>
                      {route.page.title[currentLanguage.languageTag]}
                    </h5>
                  </Link>
                ))}
              </Box>
            </>
          )}

          {showNotFoundText() && (
            <div className={styles.notFound}>
              {/* <p>Sorry, there are no results for {searchTerm}. Please try again.</p> */}
              <SimpleBlockContent blocks={notFoundText} />
            </div>
          )}
          {(currCountry == 'ca' || currCountry == 'us') && showSection('research_papers_blogs') && (
            <Box my={6}>
              {renderHeader('Articles & Reports', 'research_papers_blogs')}
              <Grid container spacing={6}>
                {posts &&
                  posts.research_papers_blogs &&
                  filterQuantity(posts.research_papers_blogs).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.research_papers_blogs.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {currCountry == 'ae' && showSection('articles_ae') && (
            <Box my={6}>
              {renderHeader('Articles & Reports', 'articles_ae')}
              <Grid container spacing={6}>
                {posts &&
                  posts.articles_ae &&
                  filterQuantity(posts.articles_ae).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.articles_ae.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {/* {showSection('research_papers_blogs') && (
            <Box my={6}>
              {renderHeader('Articles & Reports', 'research_papers_blogs')}
              <Grid container spacing={6}>
                {posts &&
                  posts.research_papers_blogs &&
                  filterQuantity(posts.research_papers_blogs).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.research_papers_blogs.length)}
                      key={item._id}
                    >
                      {singleSection ? (
                        <SearchCard {...item} currentLanguage={currentLanguage} />
                      ) : (
                        <Card {...item} currentLanguage={currentLanguage} />
                      )}
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )} */}
          {showSection('digital_asset_bulletin') && (
            <Box my={6}>
              {renderHeader('Digital Asset Bulletin', 'digital_asset_bulletin')}
              <Grid container spacing={6}>
                {posts &&
                  posts.digital_asset_bulletin &&
                  filterQuantity(posts.digital_asset_bulletin, 2).map((item) => (
                    <Grid item xs={12} md={6} key={item._id}>
                      <Card {...item} imageLayout currentLanguage={currentLanguage} currentCountry={currentCountry} />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {showSection('digital_markets_weekly') && (
            <Box my={6}>
              {renderHeader('Digital Markets Weekly', 'digital_markets_weekly')}
              <Grid container spacing={6}>
                {posts &&
                  posts.digital_markets_weekly &&
                  filterQuantity(posts.digital_markets_weekly, 2).map((item) => (
                    <Grid item xs={12} md={6} key={item._id}>
                      <Card {...item} imageLayout currentLanguage={currentLanguage} />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {showSection('videos_webinars') && (
            <Box my={6}>
              {renderHeader('Videos', 'videos_webinars')}
              <Grid container spacing={6}>
                {posts &&
                  posts.videos_webinars &&
                  filterQuantity(posts.videos_webinars).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.videos_webinars.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {showSection('podcasts') && (
            <Box my={6}>
              {renderHeader('Podcasts', 'podcasts')}
              <Grid container spacing={6}>
                {posts &&
                  posts.podcasts &&
                  filterQuantity(posts.podcasts).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.podcasts.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {showSection('webinar') && (
            <Box my={6}>
              {renderHeader('Webinars', 'webinar')}
              <Grid container spacing={6}>
                {posts &&
                  posts.webinar &&
                  filterQuantity(posts.webinar, 2).map((item) => (
                    <Grid item xs={12} md={6} key={item._id}>
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {showSection('metaverse') && (
            <Box my={6}>
              {renderHeader('Metaverse', 'metaverse')}
              <Grid container spacing={6}>
                {posts &&
                  posts.metaverse &&
                  filterQuantity(posts.metaverse).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.metaverse.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {(currCountry == 'ca' || currCountry == 'ae') && showSection('press_media') && (
            <Box my={6}>
              {renderHeader('Press Releases', 'press_media')}
              <Grid container spacing={6}>
                {posts &&
                  posts.press_media &&
                  filterQuantity(posts.press_media).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.press_media.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {currCountry == 'us' && showSection('pr_us') && (
            <Box my={6}>
              {renderHeader('Press Releases', 'pr_us')}
              <Grid container spacing={6}>
                {posts &&
                  posts.pr_us &&
                  filterQuantity(posts.pr_us).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.pr_us.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {currCountry == 'ca' && showSection('pr_bitcoin_etf') && (
            <Box my={6}>
              {renderHeader('Press Release 3iQ Bitcoin ETF', 'pr_bitcoin_etf')}
              <Grid container spacing={6}>
                {posts &&
                  posts.pr_bitcoin_etf &&
                  filterQuantity(posts.pr_bitcoin_etf).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.pr_bitcoin_etf.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {currCountry == 'ca' && showSection('pr_ether_etf') && (
            <Box my={6}>
              {renderHeader('Press Release 3iQ Ether ETF', 'pr_ether_etf')}
              <Grid container spacing={6}>
                {posts &&
                  posts.pr_ether_etf &&
                  filterQuantity(posts.pr_ether_etf).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.pr_ether_etf.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {currCountry == 'ca' && showSection('pr_bitcoin_fund') && (
            <Box my={6}>
              {renderHeader('Press Release The Bitcoin Fund', 'pr_bitcoin_fund')}
              <Grid container spacing={6}>
                {posts &&
                  posts.pr_bitcoin_fund &&
                  filterQuantity(posts.pr_bitcoin_fund).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.pr_bitcoin_fund.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {currCountry == 'ca' && showSection('pr_ether_fund') && (
            <Box my={6}>
              {renderHeader('Press Release The Ether Fund', 'pr_ether_fund')}
              <Grid container spacing={6}>
                {posts &&
                  posts.pr_ether_fund &&
                  filterQuantity(posts.pr_ether_fund).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.pr_ether_fund.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {currCountry == 'ca' && showSection('pr_global_asset') && (
            <Box my={6}>
              {renderHeader('Press Release 3iQ Global Cryptoasset Fund', 'pr_global_asset')}
              <Grid container spacing={6}>
                {posts &&
                  posts.pr_global_asset &&
                  filterQuantity(posts.pr_global_asset).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.pr_global_asset.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
          {currCountry == 'ae' && showSection('pr_bitcoin_fund_dubai') && (
            <Box my={6}>
              {renderHeader('Press Release The Bitcoin Fund', 'pr_bitcoin_fund_dubai')}
              <Grid container spacing={6}>
                {posts &&
                  posts.pr_bitcoin_fund_dubai &&
                  filterQuantity(posts.pr_bitcoin_fund_dubai).map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={handleCardSize(posts.pr_bitcoin_fund_dubai.length)}
                      key={item._id}
                    >
                      <SearchCard
                        {...item}
                        currentLanguage={currentLanguage}
                        currentCountry={currentCountry}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}

Search.propTypes = {
  heading: PropTypes.string,
}

export default Search
