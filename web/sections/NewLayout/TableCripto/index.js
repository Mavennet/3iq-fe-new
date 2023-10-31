import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Typography, Box, Container} from '@mui/material'
import styles from './styles.module.scss'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import axios from 'axios'
import {CSVLink} from 'react-csv'
import {TfiDownload} from 'react-icons/tfi'
import client from '../../../client'
import groq from 'groq'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)
function TableCripto(props) {
  const {heading, description, endpoint, headers, currentLanguage, additionalTableRows} = props

  const [data, setData] = React.useState([])

  const downloadText = currentLanguage.name === 'EN' ? 'Download' : 'Télécharger'

  const getTableData = (endpoint) => {
    axios.get(endpoint).then((response) => setData(response.data))
  }

  React.useEffect(() => {
    if (endpoint) {
      getTableData(endpoint)
    }
  }, [endpoint])

  const groqQuery = `*[_type == "tiqFundPerformance" && _id in $ref] | order(priority asc) {
    cryptoName,
    cryptoLogo,
    price,
    indexWeight,
    portfolioWeight
  }`

  const [tableRow, setTableRows] = React.useState([])
  const [loadedData, setLoadedData] = React.useState([])

  React.useEffect(() => {
    const fetchDataForTableRow = async () => {
      // Create an array to store the updated data
      const updatedData = []

      for (const item of tableRow) {
        try {
          // Make an API call to get the price data
          const response = await axios.get(item.price)
          if (response.status === 200) {
            const priceData = response.data
            const firstValue = Object.values(priceData)[0]
            const usdValue = firstValue.usd
            console.log(usdValue)
            item.price = parseFloat(usdValue)
            console.log(item.price)
          } else {
            console.error('Failed to fetch data for item: ', item)
          }
        } catch (error) {
          console.error('Error fetching data: ', error)
        }

        updatedData.push(item)
      }

      setLoadedData(updatedData)
    }

    fetchDataForTableRow()
  }, [tableRow])

  React.useEffect(() => {
    // Fetch data from your Groq query and update tableRow
    const groqQuery = `*[_type == "tiqFundPerformance" && _id in $ref] | order(priority asc) {
      cryptoName,
      cryptoLogo,
      price,
      indexWeight,
      portfolioWeight
    }`

    const fetchData = async (refs) => {
      const results = await client.fetch(groqQuery, {ref: refs})
      setTableRows(results)
    }

    if (additionalTableRows && tableRow.length === 0) {
      let refs = []
      additionalTableRows.forEach((row) => refs.push(row._ref))
      fetchData(refs)
    }
  }, [])

  return (
    <Container sx={{maxWidth: {sm: 'md', lg: 'lg', xl: 'xl'}}}>
      <Grid container py={6}>
        <Grid
          id={heading}
          item
          xs={12}
          mb={2}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {heading && (
            <Typography
              id={heading}
              variant="h2"
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: {xs: 'var(--font-size-primary-md)', md: 'var(--font-size-primary-lg)'},
                color: 'var(--black)',
              }}
            >
              {heading}
            </Typography>
          )}
          <>
            <CSVLink
              data={data ? data : []}
              filename={`table.csv`}
              target="_blank"
              style={{
                textAlign: 'center',
                background: 'transparent',
                border: '2px solid #091B3F',
                color: '#091B3F',
                textDecoration: 'none',
                padding: '5px 25px',
                borderRadius: '4px',
                fontSize: '20px',
                margin: '20px 0px',
              }}
            >
              <TfiDownload size={15} className={styles.download__icon} />
              {downloadText}
            </CSVLink>
          </>
        </Grid>
        {data && (
          <Grid item xs={12}>
            <div className={styles.simpleBlockContent}>
              <table>
                {headers && (
                  <thead>
                    <tr>
                      {headers.map((item, i) => {
                        return (
                          <th key={item._key} className={i === 0 && styles.header__fixed__mobile}>
                            {item[currentLanguage?.languageTag]}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {data.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td className={styles.fixed__mobile}>
                          <div className={styles.criptoInfo}>
                            <Box
                              component="img"
                              alt={item.currency}
                              src={item.image.small}
                              sx={{
                                marginRight: '10px',
                                width: '25px',
                              }}
                            />
                            {item.currency}
                          </div>
                        </td>
                        <td className={styles.price}>
                          $ {item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                        </td>
                        <td className={styles.price}>{item.index}</td>
                        <td>{item.weight}</td>
                      </tr>
                    )
                  })}
                  {loadedData.map((item, key) => (
                    <tr key={key}>
                      <td className={styles.fixed__mobile}>
                        <div className={styles.criptoInfo}>
                          <Box
                            component="img"
                            alt={item?.cryptoName[currentLanguage?.languageTag]}
                            src={builder.image(item?.cryptoLogo).url()}
                            sx={{
                              marginRight: '10px',
                              width: '25px',
                            }}
                          />
                          {item?.cryptoName[currentLanguage?.languageTag]}
                        </div>
                      </td>
                      <td className={styles.price}>
                        {item?.price && typeof item.price === 'number'
                          ? `$ ${item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
                          : 'N/A'}
                      </td>
                      <td>{item?.portfolioWeight[currentLanguage?.languageTag]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
        )}
        {description && (
          <Grid item xs={12} mt={2}>
            <div className={styles.simple__block__content}>
              <SimpleBlockContent blocks={description} />
            </div>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

TableCripto.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  endpoint: PropTypes.string,
  headers: PropTypes.array,
  currentLanguage: PropTypes.object,
  additionalTableRows: PropTypes.array,
}

export default TableCripto
