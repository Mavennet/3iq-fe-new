import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { Container, Grid, Box } from '@mui/material'
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri'
import Button from '../../../components/NewLayout/Button'

function renderCards(items, languageTag) {
    const cardStyles = [
        {
            card: styles.box__container__card,
            background: styles.box__container__card__background,
            button: styles.box__container__card__button
        },
        {
            card: styles.box__container__card__2,
            background: styles.box__container__card__2__background,
            button: styles.box__container__card__2__button
        },
        {
            card: styles.box__container__card__3,
            background: styles.box__container__card__3__background,
            button: styles.box__container__card__3__button
        },
      
    ]

    const cards = items.map((item) => {
        return (
            <Box sx={{ minWidth: { sm: '500px', xs: '300px' } }} className={item.cardColor ? cardStyles[item.cardColor].card : cardStyles[0].card}>
                <div className={item.cardColor ? cardStyles[item.cardColor].background : cardStyles[0].background}>
                    <div className={styles.box__container__card__content}>
                        <div className={styles.box__container__title}>
                            <h4>{item.localeHeading[languageTag] || ''}</h4>
                        </div>
                        <div className={styles.box__container__span}>
                            <span>TSX: {item.codes.map((code, i) => i == item.codes.length - 1 ? `${code}` : `${code}, `)}</span>
                        </div>
                        <div className={styles.box__container__text}>
                            <p className='p__secondary__sm'>
                                {item.localeText[languageTag] || ''}
                            </p>
                        </div>
                        <div className={styles.box__container__price}>
                            <span className='p__secondary__sm'>Daily NAV</span>
                            <h5>{item.localeDailyNav[languageTag] || ''}</h5>
                        </div>
                        {item.localeButton[languageTag] && (
                            <Box className={styles.box__container__card__button__grid} sx={{ justifyContent: { sm: 'end', xs: 'center' } }}>
                                <Button {...item.localeButton[languageTag]} title={item.localeButton[languageTag].title} className={item.cardColor ? cardStyles[item.cardColor].button : cardStyles[0].button} size="sm" />
                            </Box>
                        )}

                    </div>
                </div>
            </Box>
        )
    }
    )

    return cards

}

function OurFunds(props) {
    const {
        currentLanguage,
        fundCards
    } = props

    const boxItemSx = {
        width: {
            md: '1000px'
        },
        height: {
            md: '500px'
        }
    }

    const containerRef = React.useRef(null)

    const handleArrow = (type) => {
        if (type === 'next') {
            containerRef.current.scrollLeft = containerRef.current.scrollLeft + 300
        } else {
            containerRef.current.scrollLeft = containerRef.current.scrollLeft - 300
        }
    }

    return (
        <section className={styles.our__funds__section}>
            <Container sx={{maxWidth: { sm: 'md', md: 'lg', lg: 'xl' }}}>
                <Grid container mb={4}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Our Funds</h3>
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
                            />
                        </div>
                    </Grid>
                </Grid>
            </Container>
            <div className={styles.box}>
                <div className={styles.box__container} ref={containerRef}>
                    {renderCards(fundCards, currentLanguage.languageTag)}
                </div>
            </div>
        </section>
    )
}

OurFunds.propTypes = {
    heading: PropTypes.string,

}

export default OurFunds
