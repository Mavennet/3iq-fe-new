import React from 'react'
import PropTypes from 'prop-types'
import { Container, Grid } from '@mui/material'
import styles from './styles.module.scss'
import { BsFillArrowDownLeftCircleFill, BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import axios from 'axios'
import { format } from 'date-fns'

function QuoteHeads({ orangeBoxEndpoint, greenBoxEndpoint, currentLanguage, volumeText, dateText }) {

  const [orangeBoxData, setOrangeBoxData] = React.useState(null)
  const [greenBoxData, setGreenBoxData] = React.useState(null)

  const convertDate = (value) => {
    const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
    const dt = value.split('-')
    const newYears = new Date(parseInt(dt[0]), parseInt(dt[1]) - 1, parseInt(dt[2]), 12)
    const isEng = currentLanguage.name === "EN"
    const formattedDate = format(newYears, isEng ? 'MMMM dd, yyyy' : 'dd MMMM yyyy', {
      locale: getLocale(currentLanguage.languageTag.replace('_', '-')),
    })
    !isEng && formattedDate.toLocaleLowerCase('fr')
    return formattedDate
  }

  const getOrangeData = async (endpoint) => {
    const data = {}
    const r = await axios.get(endpoint)
    console.log(r)
    if (r.data?.results) {
      data["longname"] = r.data.results.quote[0].equityinfo.longname
      data["symbolstring"] = r.data.results.quote[0].symbolstring
      data["symbolstringCrr"] = r.data.results.quote[0].symbolstring
      data["last"] = r.data.results.quote[0].pricedata.last
      data["datetime"] = convertDate(r.data.results.quote[0].datetime)
      data["key"] = returnKeys(r.data.results.quote[0].key)
      data["change"] = r.data.results.quote[0].pricedata.change
      data["changepercent"] = r.data.results.quote[0].pricedata.changepercent
      setOrangeBoxData(data)
    } else if (r.data?.root) {
      data["longname"] = r.data.root[0].full_name
      data["symbolstring"] = r.data.root[0].code
      data["symbolstringCrr"] = r.data.root[0].code + ".U"
      data["last"] = r.data.root[0].display_price
      data["datetime"] = r.data.root[0].time_of_last_update
      data["key"] = "USD | NASDAQ DUBAI STOCK EXCHANGE | REAL TIME PRICE | END OF DAY"
      data["change"] = r.data.root[0].numerical_change
      data["changepercent"] = r.data.root[0].percentage_change
      setOrangeBoxData(data)
    }
  }

  const getGreenData = async (endpoint) => {
    const data = {}
    const r = await axios.get(endpoint)
    console.log(r)
    if (r.data?.results) {
      data["longname"] = r.data.results.quote[0].equityinfo.longname
      data["symbolstring"] = r.data.results.quote[0].symbolstring
      data["symbolstringCrr"] = r.data.results.quote[0].symbolstring
      data["last"] = r.data.results.quote[0].pricedata.last
      data["datetime"] = convertDate(r.data.results.quote[0].datetime)
      data["key"] = returnKeys(r.data.results.quote[0].key)
      data["change"] = r.data.results.quote[0].pricedata.change
      data["changepercent"] = r.data.results.quote[0].pricedata.changepercent
      setGreenBoxData(data)
    } else if (r.data?.root) {
      data["longname"] = r.data.root[0].full_name
      data["symbolstring"] = r.data.root[0].code
      data["symbolstringCrr"] = r.data.root[0].code + ".U"
      data["last"] = r.data.root[0].display_price
      data["datetime"] = r.data.root[0].time_of_last_update
      data["key"] = "USD | NASDAQ DUBAI STOCK EXCHANGE | REAL TIME PRICE | END OF DAY"
      data["change"] = r.data.root[0].numerical_change
      data["changepercent"] = r.data.root[0].percentage_change
      setGreenBoxData(data)
    }
  }

  const toCurrency = (value,symbol) => {
    if(!value) return "N/A"
    let crr = 'CAD'
    if (symbol.includes('.U')) {
      crr = 'USD'
    }
    return parseFloat(value).toLocaleString('pt-br', {
      style: 'currency',
      currency: crr,
    }).replace(',', '.')
  }

  const returnKeys = (object) => {
    var str = ''
    for (var word in object) {
      if (Object.prototype.hasOwnProperty.call(object, word)) {
        str += object[word] + ' | '
      }
    }
    return str;
  }

  React.useEffect(async () => {
    if (orangeBoxEndpoint) {
      await getOrangeData(orangeBoxEndpoint)
    }
    if (greenBoxEndpoint) {
      await getGreenData(greenBoxEndpoint)
    }
  }, [greenBoxEndpoint,orangeBoxEndpoint])

  return (
    <Grid xs={12} md={5} lg={6} py={8}>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            {
              orangeBoxData && (
                <>
                  <div className={styles.circle__top}></div>
                  <div className={`${styles.box} ${styles.down} ${parseFloat(orangeBoxData?.change) < 0 ? styles.orange : styles.green}`}>
                    <Grid container>
                      <Grid item xs={9}>
                        <h5>{orangeBoxData?.longname} ({orangeBoxData?.symbolstring})</h5>
                        <h2>{toCurrency(orangeBoxData?.last,orangeBoxData?.symbolstringCrr)} <small>{orangeBoxData?.change}({orangeBoxData?.changepercent.toFixed(2)}%)</small></h2>
                        <div className={styles.info}>
                          <div>
                            <label>{dateText && dateText}</label>
                            <h5><strong>{orangeBoxData?.datetime}</strong></h5>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {
                          parseFloat(orangeBoxData?.change) < 0 ? (
                            <BsFillArrowDownLeftCircleFill
                              size={60}
                              color={'var(--orange)'}
                            />
                          ) : (
                            <BsFillArrowUpRightCircleFill
                              size={60}
                              color={'#009A93'}
                            />
                          )
                        }
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.footer}>
                          <p>{orangeBoxData.key}</p>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </>
              )
            }
            {
              greenBoxData && (
                <>
                  <div className={`${styles.box} ${styles.up} ${parseFloat(greenBoxData?.change) < 0 ? styles.orange : styles.green}`}>
                    <Grid container>
                      <Grid item xs={9}>
                        <h5>{greenBoxData?.longname} ({greenBoxData?.symbolstring})</h5>
                        <h2>{toCurrency(greenBoxData?.last,greenBoxData?.symbolstringCrr)} <small>{greenBoxData?.change}({greenBoxData?.changepercent.toFixed(2)}%)</small></h2>
                        <div className={styles.info}>
                          <div>
                            <label>{dateText && dateText}</label>
                            <h5><strong>{orangeBoxData?.datetime}</strong></h5>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {
                          parseFloat(greenBoxData?.change) < 0 ? (
                            <BsFillArrowDownLeftCircleFill
                              size={60}
                              color={'var(--orange)'}
                            />
                          ) : (
                            <BsFillArrowUpRightCircleFill
                              size={60}
                              color={'#009A93'}
                            />
                          )
                        }
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.footer}>
                          <p>{greenBoxData?.key}</p>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <div className={styles.circle__down}></div>
                </>
              )
            }
          </Grid>
        </Grid>
      </Container>
    </Grid>
  )
}

QuoteHeads.propTypes = {
  orangeBoxEndpoint: PropTypes.string,
  greenBoxEndpoint: PropTypes.string,
  dateText: PropTypes.object,
  volumeText: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default QuoteHeads
