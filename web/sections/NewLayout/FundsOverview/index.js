import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from './styles.module.scss'
import FundSidebarItem from '../../../components/NewLayout/FundSidebarItem'
import axios from 'axios'
import {format} from 'date-fns'
import {Typography} from '@mui/material'
import Button from '../../../components/NewLayout/Button'
import client from '../../../client'
import groq from 'groq'

function FundsOverview(props) {
  const {
    title,
    embed,
    fundSidebarItem,
    currentLanguage,
    endpoint,
    button,
    footer,
    keyFactsTableOne,
    keyFactsTableTwo,
  } = props

  const [data, setData] = React.useState(null)

  const getKeyFacts = (endpoint) => {
    axios.get(endpoint).then((response) => setData(response.data))
  }

  const groqQuery = `*[_type == "keyFact" && _id in $ref] | order(priority asc) {
    keyFactTitle,
    keyFactValue
  }`

  const [tablePartOne, setTablePartOne] = React.useState([])

  React.useEffect(() => {
    const fetchData = async (refs) => {
      const results = await client.fetch(groqQuery, {ref: refs})
      setTablePartOne(results)
    }
    if (keyFactsTableOne && tablePartOne.length == 0) {
      let refs = []
      keyFactsTableOne.forEach((keyFactsTableOne) => refs.push(keyFactsTableOne._ref))
      fetchData(refs)
    }
  }, [])

  const [tablePartTwo, setTableParTwo] = React.useState([])

  React.useEffect(() => {
    const fetchData = async (refs) => {
      const results = await client.fetch(groqQuery, {ref: refs})
      setTableParTwo(results)
    }
    if (keyFactsTableTwo && tablePartTwo.length == 0) {
      let refs = []
      keyFactsTableTwo.forEach((keyFactsTableTwo) => refs.push(keyFactsTableTwo._ref))
      fetchData(refs)
    }
  }, [])

  const convertDate = (value) => {
    const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
    const dt = value.split('-')
    const newYears = new Date(parseInt(dt[0]), parseInt(dt[1]) - 1, parseInt(dt[2]), 12)
    const isEng = currentLanguage.name === 'EN'
    const formattedDate = format(newYears, isEng ? 'MMMM dd, yyyy' : 'dd MMMM yyyy', {
      locale: getLocale(currentLanguage.languageTag.replace('_', '-')),
    })
    !isEng && formattedDate.toLocaleLowerCase('fr')
    return formattedDate
  }

  React.useEffect(() => {
    if (endpoint) {
      getKeyFacts(endpoint)
    }
  }, [endpoint])

  const localeButton = button && button[currentLanguage?.languageTag]

  return (
    <Grid xs={12} md={fundSidebarItem ? 12 : 7} lg={fundSidebarItem ? 12 : 6} py={{xs: 4, md: 15}}>
      <Container sx={{maxWidth: {sm: 'md', md: 'lg', lg: 'xl'}}}>
        <Grid container>
          <Grid item md={fundSidebarItem ? 8 : 12} pr={{xs: 0, md: fundSidebarItem ? 10 : 0}}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {embed && (
              <Box className={styles.content}>
                <SimpleBlockContent blocks={embed} />
              </Box>
            )}
            {data && (
              <Box className={styles.key__table} my={6}>
                <table>
                  <tbody>
                    {tablePartOne &&
                      tablePartOne.map((item, key) => (
                        <tr key={key}>
                          <td>
                            <strong>{item.keyFactTitle[currentLanguage?.languageTag]}</strong>
                          </td>
                          <td>{item.keyFactValue[currentLanguage?.languageTag]}</td>
                        </tr>
                      ))}
                    {Object.entries(
                      data[0].en_CA
                        ? data[0][
                            currentLanguage.languageTag.startsWith('en')
                              ? 'en_CA'
                              : currentLanguage.languageTag
                          ]
                        : data[0]
                    ).map((item, key) => {
                      const keysToExpand = [
                        'UnitsOutstanding',
                        'BTCPerUnit',
                        'UnitsPerBTC',
                        'UnitsPerETH',
                        'ETHPerUnit',
                      ]
                      const keysExpanded = [
                        'Units Outstanding',
                        'BTC per Unit',
                        'Units per BTC',
                        'Units per ETH',
                        'ETH per Unit',
                      ]
                      const frenchKeys = [
                        'Unités en circulation',
                        'BTC Par Unité',
                        'Unités Par BTC',
                        'Unités Par ETH',
                        'ETH Par Unité',
                      ]
                      const indexOfKey =
                        keysToExpand.indexOf(item[0]) === -1
                          ? frenchKeys.indexOf(item[0])
                          : keysToExpand.indexOf(item[0])
                      const isExpandKey = keysToExpand.includes(item[0])
                      const isFrenchKey = frenchKeys.includes(item[0])
                      let expandValue
                      if ((isExpandKey || isFrenchKey) && indexOfKey === 0) {
                        expandValue = `${parseFloat(item[1])
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ‡`
                      } else if (
                        (isExpandKey || isFrenchKey) &&
                        (indexOfKey === 1 || indexOfKey === 4)
                      ) {
                        expandValue = `${parseFloat(item[1]).toFixed(8)} ‡`
                      } else {
                        expandValue = `${parseFloat(item[1]).toFixed(2)} ‡`
                      }

                      return (
                        <tr key={key}>
                          <td>
                            <strong>{isExpandKey ? keysExpanded[indexOfKey] : item[0]}</strong>
                          </td>
                          <td>{isExpandKey || isFrenchKey ? expandValue : item[1]}</td>
                        </tr>
                      )
                    })}
                    {tablePartTwo &&
                      tablePartTwo.map((item, key) => (
                        <tr key={key}>
                          <td>
                            <strong>{item.keyFactTitle[currentLanguage?.languageTag]}</strong>
                          </td>
                          <td>{item.keyFactValue[currentLanguage?.languageTag]}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Box>
            )}
            {data && data[0].date && (
              <Box sx={{mt: 4}} className={styles.content}>
                <Typography
                  align="left"
                  sx={{
                    color: 'var(--black)',
                    fontFamily: 'var(--font-family-secondary)',
                    fontSize: 'var(--font-size-secondary-md)',
                  }}
                >{`‡ ${convertDate(data[0].date)}`}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item md={4}>
            {fundSidebarItem &&
              fundSidebarItem.map((fundItem, index) => (
                <FundSidebarItem
                  key={`fundSidebarItem_${index}`}
                  {...fundItem}
                  languageTag={currentLanguage.languageTag}
                />
              ))}
          </Grid>
          {footer && (
            <Grid item xs={12}>
              <div className={styles.content}>
                <SimpleBlockContent blocks={footer} />
              </div>
            </Grid>
          )}
          {localeButton && (
            <Grid item xs={12} mt={6} sx={{display: 'flex', justifyContent: 'center'}}>
              <Button variant="solidOrange" {...localeButton} title={localeButton.title} />
            </Grid>
          )}
        </Grid>
      </Container>
    </Grid>
  )
}

FundsOverview.propTypes = {
  title: PropTypes.object,
  button: PropTypes.object,
  footer: PropTypes.object,
  embed: PropTypes.object,
  currentLanguage: PropTypes.object,
  fundSidebarItem: PropTypes.array,
  endpoint: PropTypes.string,
}

export default FundsOverview
