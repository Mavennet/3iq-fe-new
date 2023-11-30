import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Typography, Container, Box, MenuItem, Menu, Button} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from './styles.module.scss'
import axios from 'axios'
import {Scrollbars} from 'react-custom-scrollbars-2'
import client from '../../../client'
import groq from 'groq'

function FundHistorialPerformanceTable(props) {
  const {
    heading,
    embed,
    colorfulLayout,
    color,
    headerTransparentLayout,
    headers,
    currentLanguage,
    headerFundPerformance,
    languageTag,
    yearlyFundReturns,
  } = props

  const [data, setData] = React.useState()
  const [date, setDate] = React.useState(null)

  const groqQuery = `*[_type == "yearFundHistorialPerformance"] | order(priority desc) {
    a1,
    a2,
    a3,
    a4,
    a5,
    a6,
    a7,
    a8,
    a9,
    a99,
    a999,
    a9999,
    a99999,
    a999999
  }`

  const [tableRow, setTableRows] = React.useState([])

  React.useEffect(() => {
    const fetchData = async (refs) => {
      const results = await client.fetch(groqQuery, {ref: refs})
      setTableRows(results)
    }
    let refs = []
    yearlyFundReturns?.forEach((row) => refs.push(row._ref))
    fetchData(refs)
  }, [])

  const typesStyle = {
    orange: styles.orange,
    lightBlue: styles.light__blue,
    darkBlue: styles.dark__blue,
  }

  const renderThumb = ({style, ...props}) => {
    const thumbStyle = {
      backgroundColor: `#0082E5`,
      borderRadius: '10px',
    }
    return <div style={{...style, ...thumbStyle}} {...props} />
  }

  const headings_en = [
    'Fund Returns ‡',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
    'Annual or YTD',
  ]

  return (
    <Container sx={{maxWidth: {sm: 'md', md: 'lg', lg: 'xl'}}}>
      <Grid container my={6} id={heading}>
        {heading && (
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography
              id={heading}
              variant="h2"
              mb={4}
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: {xs: 'var(--font-size-primary-md)', md: 'var(--font-size-primary-lg)'},
                color: 'var(--black)',
                marginBottom: {xs: 2, md: 0},
              }}
            >
              {heading}
            </Typography>
          </Grid>
        )}
        {tableRow && (
          <Grid item xs={12}>
            <Scrollbars
              autoHeight
              autoHeightMin={tableRow.length === 1 ? 200 : 300}
              autoHeightMax={500}
              className={styles.simpleBlockContent}
              renderThumbHorizontal={renderThumb}
            >
              <table>
                {
                  <thead className={headerTransparentLayout && styles.headerTransparent}>
                    <tr>
                      {headings_en.map((item, i) => {
                        return <th key={i}>{item}</th>
                      })}
                    </tr>
                  </thead>
                }
                <tbody className={colorfulLayout && `${styles.tableColorful} ${typesStyle[color]}`}>
                  {tableRow.map((item, i) => {
                    const keys = Object.keys(item).sort((a, b) => {
                      if (a < b) return -1
                      else return 1
                    })
                    return (
                      <tr key={i}>
                        {keys.map((k, i) => {
                          return (
                            <td key={i}>
                              <div className={styles.bg}>{item[k]}</div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Scrollbars>
          </Grid>
        )}
        {embed && (
          <Grid item xs={12} my={3}>
            <div className={styles.simpleBlockContent}>
              <SimpleBlockContent blocks={embed} />
              {date && (
                <Typography
                  paragraph
                  style={{color: 'var(--dark-gray)', fontWeight: '300', fontStyle: 'normal'}}
                >
                  ‡ {date}
                </Typography>
              )}
            </div>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

FundHistorialPerformanceTable.propTypes = {
  heading: PropTypes.string,
  embed: PropTypes.object,
  color: PropTypes.string,
  colorfulLayout: PropTypes.bool,
  headerTransparentLayout: PropTypes.bool,
  headers: PropTypes.array,
  currentLanguage: PropTypes.object,
  headerFundPerformance: PropTypes.bool,
  _id: PropTypes.string,
  yearlyFundReturns: PropTypes.array,
}

export default FundHistorialPerformanceTable
