import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import {Container, Grid, Box, useMediaQuery, useTheme} from '@mui/material'
import {RiArrowRightSLine, RiArrowLeftSLine} from 'react-icons/ri'
import Button from '../../../components/NewLayout/Button'
import axios from 'axios'
import {Carousel} from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

function renderCards(items, languageTag) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  const cardStyles = [
    {
      card: styles.box__container__card,
      background: styles.box__container__card__background,
      button: styles.box__container__card__button,
    },
    {
      card: styles.box__container__card__2,
      background: styles.box__container__card__2__background,
      button: styles.box__container__card__2__button,
    },
    {
      card: styles.box__container__card__3,
      background: styles.box__container__card__3__background,
      button: styles.box__container__card__3__button,
    },
  ]

  const cards = items.map((item) => {
    const [data, setData] = React.useState(null)

    const fetchData = async () => {
      const data = {}
      const r = await axios.get(item.endpoint)
      if (
        item.localeHeading[languageTag] != '3iQ Global Cryptoasset Fund' &&
        item.localeHeading[languageTag] != 'Fonds mondial de cryptoactifs 3iQ' &&
        r.data
      ) {
        data['dailyNavCad'] = Number(r.data[0].cad)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        setData(data)
      } else {
        data['TIQ101'] = r.data[0].Daily
        data['TIQ111'] = r.data[1].Daily
        data['TIQ103'] = r.data[2].Daily
        setData(data)
      }
    }

    React.useEffect(() => {
      if (item.endpoint) {
        fetchData()
      }
    }, [item.endpoint])

    return (
      <Box
        id={item.localeHeading[languageTag].trim()}
        sx={{
          minWidth: {sm: '500px', xs: '300px'},
        }}
        className={item.cardColor ? cardStyles[item.cardColor].card : cardStyles[0].card}
      >
        <div
          className={
            item.cardColor ? cardStyles[item.cardColor].background : cardStyles[0].background
          }
        >
          <div className={styles.box__container__card__content}>
            <div className={styles.box__container__title}>
              <h4>{item.localeHeading[languageTag] || ''}</h4>
            </div>
            <div className={styles.box__container__span}>
              <span>
                TSX:{' '}
                {item.codes.map((code, i) =>
                  i == item.codes.length - 1 || code.indexOf(':' >= 0) ? `${code}` : `${code}, `
                )}
              </span>
            </div>

            <div className={styles.box__container__text}>
              <p className="p__secondary__sm">{item.localeText?.[languageTag] || <br></br>}</p>
            </div>

            {item.localeDailyNav?.[languageTag] && (
              <div className={styles.box__container__price}>
                <span className="p__secondary__sm">
                  {item.localeDailyNavlabel
                    ? item.localeDailyNavlabel[languageTag]
                    : languageTag !== 'fr_CA'
                    ? 'Daily NAV:'
                    : 'VL Quotidienne:'}
                </span>
                <h5> {data?.dailyNavCad ? 'CAD $' + data?.dailyNavCad : ''}</h5>
                {data?.TIQ101 && <h5>{'TIQ 101: CAD ' + data?.TIQ101}</h5>}
                {data?.TIQ111 && <h5>{'TIQ 111: CAD ' + data?.TIQ111}</h5>}
                {data?.TIQ103 && <h5>{'TIQ 103: CAD ' + data?.TIQ103}</h5>}
              </div>
            )}

            {item.localeButton[languageTag] && (
              <Box
                className={styles.box__container__card__button__grid}
                sx={{justifyContent: {sm: 'end', xs: 'center'}}}
              >
                <Button
                  {...item.localeButton[languageTag]}
                  title={item.localeButton[languageTag].title}
                  className={
                    item.cardColor ? cardStyles[item.cardColor].button : cardStyles[0].button
                  }
                  size="sm"
                />
              </Box>
            )}
          </div>
        </div>
      </Box>
    )
  })

  return mobile ? (
    <Carousel dynamicHeight	={true} infiniteLoop="true" swipeable={true} showThumbs={false} showStatus={false} showArrows={false}>
      {cards}
    </Carousel>
  ) : (
    cards
  )
}

function OurFunds(props) {
  const {heading, currentLanguage, fundCards} = props

  const boxItemSx = {
    width: {
      md: '1000px',
    },
    height: {
      md: '500px',
    },
  }

  const containerRef = React.useRef(null)

  const handleArrow = (type) => {
    if (type === 'next') {
      containerRef.current.scrollLeft = containerRef.current.scrollLeft + 300
    } else {
      containerRef.current.scrollLeft = containerRef.current.scrollLeft - 300
    }
  }

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <section className={styles.our__funds__section}>
      <Container sx={{maxWidth: {sm: 'md', md: 'lg', lg: 'xl'}}}>
        <Grid container mb={4}>
          <Grid
            id={heading}
            item
            xs={12}
            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <h3>{heading}</h3>
            {!mobile && (
              <div className={styles.arrows}>
                <RiArrowLeftSLine
                  className={styles.arrow}
                  size={40}
                  onClick={() => handleArrow('prev')}
                />
                <RiArrowRightSLine
                  className={styles.arrow}
                  size={40}
                  onClick={() => handleArrow('next')}
                />{' '}
              </div>
            )}
          </Grid>
        </Grid>
        <div className={styles.box}>
          <div
            className={mobile ? styles.box__container_mobile : styles.box__container}
            ref={containerRef}
          >
            {renderCards(fundCards, currentLanguage.languageTag)}
          </div>
        </div>
      </Container>
    </section>
  )
}

OurFunds.propTypes = {
  heading: PropTypes.string,
}

export default OurFunds
