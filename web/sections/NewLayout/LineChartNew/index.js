import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, Box } from '@mui/material'
import { CSVLink } from 'react-csv'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import axios from 'axios'
import { format } from 'date-fns'
import styles from './styles.module.scss'
import { TfiDownload } from 'react-icons/tfi'
import { ResponsiveLine } from '@nivo/line'

function LineChart(props) {
  const {
    _id,
    heading,
    description,
    desktopSize = 12,
    mobileSize = 12,
    chartHeight = '300',
    chartColor,
    endpoint,
    currentLanguage,
  } = props

  const colors = [chartColor ? chartColor : '#0082E5', '#DC6E19', '#869D7A', '#FF2205']

  const [data, setData] = React.useState()

  const convertDate = (value) => {
    const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
    const isEng = currentLanguage.name === "EN"
    const formattedDate = format(value, isEng ? 'MMM dd yyyy' : 'dd MMM yyyy', {
      locale: getLocale(currentLanguage.languageTag.replace('_', '-')),
    })
    !isEng && formattedDate.toLocaleLowerCase('fr')
    return formattedDate
  }

  const getChartData = () => {
    axios.get(endpoint).then((response) => setData(response.data))
  }

  const limitLabel = (text) => {
    let count = 6
    let textLength = text.toString().length
    return text.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, count) + (textLength > count ? "..." : "");
  }

  React.useEffect(() => {
    getChartData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dataSet = (value) => {
    const datasets = []
    let count = 0
    if (value) {
      value.map((item) => {
        let entries = Object.entries(item)
        let newData = []
        entries.map(([key, val] = entry) => {
          if (key !== 'label') {
            newData.push({
              x: format(new Date(key), 'yyyy-MM-dd'),
              y: isNaN(val) ? '0' : parseFloat(val).toFixed(2)
            })
          }
        })
        datasets.push({
          id: item.label,
          color: colors[count],
          data: newData.sort((a, b) =>  new Date(a.x) - new Date(b.x)),
        })
        count = count + 1
        return null
      })
    }
    return datasets
  }

  return (
    <Grid item xs={mobileSize} md={desktopSize} py={6} sx={{ fontFamily: 'Europa' }}>
      <Grid container sx={{ flexDirection: 'unset' }}>
        {heading && (
          <Grid item mb={4}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-primary-lg)',
                color: 'var(--black)',
                minHeight: {md: desktopSize === 6 && '200px'}
              }}
            >
              {heading}
            </Typography>
          </Grid>
        )}
        {data && (
          <Grid item xs={12} mb={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <CSVLink
              data={data}
              filename={`line-chart-${_id}.csv`}
              target="_blank"
              style={{
                textAlign: 'center',
                background: 'transparent',
                border: '2px solid #091B3F',
                color: '#091B3F',
                textDecoration: 'none',
                padding: '5px 25px',
                borderRadius: '4px',
                fontSize: '20px'
              }}
            >
              <TfiDownload
                size={15}
                className={styles.download__icon}
              />
              Download
            </CSVLink>
          </Grid>
        )}
        <Grid item xs={12}>
          {
            data && (
              <Box
                sx={{
                  height: `${chartHeight}px`,
                }}
              >
                <ResponsiveLine
                  colors={{ datum: 'color' }}
                  data={data && dataSet(data)}
                  margin={{ top: 50, right: 50, bottom: 50, left: 70 }}
                  xScale={{
                    type: "time",
                    format: "%Y-%m-%d",
                    precision: 'day'
                  }}
                  xFormat={`time:%Y-%m-%d`}
                  yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                    reverse: false
                  }}
                  axisLeft={{
                    format: v => `$ ${limitLabel(v)}`,
                  }}
                  axisBottom={{
                    format: v => convertDate(v),
                    tickRotation: desktopSize === 6 ? 30 : 0,
                  }}
                  lineWidth={2}
                  pointSize={8}
                  pointBorderWidth={2}
                  pointColor={'var(--background-color)'}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: 'top-left',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 0,
                      itemsSpacing: 40,
                      itemWidth: 80,
                      itemHeight: -50,
                      itemOpacity: 0.75,
                      symbolSize: 20,
                      symbolShape: 'square',
                      symbolBorderColor: 'rgba(0, 0, 0, .5)',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                          }
                        }
                      ]
                    }
                  ]}
                />
              </Box>
            )
          }
        </Grid>
        {description && (
          <Grid item>
            <div className={styles.simpleBlockContent}>
              <br />
              <SimpleBlockContent blocks={description} />
            </div>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

LineChart.propTypes = {
  _id: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  chartColor: PropTypes.string,
  desktopSize: PropTypes.number,
  mobileSize: PropTypes.number,
  chartHeight: PropTypes.string,
  endpoint: PropTypes.string,
  currentLanguage: PropTypes.object,
}

export default LineChart
