import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, Box } from '@mui/material'
import Chart from 'chart.js/auto'
import { CSVLink } from 'react-csv'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import axios from 'axios'
import { format } from 'date-fns'
import styles from './styles.module.scss'
import { TfiDownload } from 'react-icons/tfi'

function LineChart(props) {
  const {
    _id,
    heading,
    description,
    desktopSize = 12,
    mobileSize = 12,
    chartHeight = '120',
    chartColor,
    endpoint,
    downloadFileName,
    currentLanguage,
  } = props

  const colors = ['#0082E5', '#DC6E19', '#869D7A', '#FF2205']

  const [data, setData] = React.useState()

  const canvasEl = React.useRef(null)

  const downloadText = currentLanguage.name === 'EN' ? 'Download' : 'Télécharger'

  const convertDate = (value) => {
    const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
    const dt = value.split('/')
    const newYears = new Date(parseInt(dt[2]), parseInt(dt[0]) - 1, parseInt(dt[1]), 12)
    const isEng = currentLanguage.name === "EN"
    const formattedDate = format(newYears, isEng ? 'MMM dd yyyy' : 'dd MMM yyyy', {
      locale: getLocale(currentLanguage.languageTag.replace('_', '-')),
    })
    !isEng && formattedDate.toLocaleLowerCase('fr')
    return formattedDate
  }

  let dataSet = (value) => {
    const datasets = []
    let count = 0
    if (value) {
      value.map((item) => {
        const { label } = item
        delete item.label
        datasets.push({
          backgroundColor: 'transparent',
          label: label,
          data: Object.keys(item)
            .filter((k) => k !== label)
            .sort((a, b) => {
              a = a.split('/')
              b = b.split('/')
              return a[2] - b[2] || a[0] - b[0] || a[1] - b[1]
            })
            .reduce((o, sortedKey) => {
              return { ...o, [convertDate(sortedKey)]: item[sortedKey] }
            }, {}),
          fill: true,
          borderWidth: 1,
          borderColor: chartColor ? chartColor : colors[count],
          lineTension: 1,
          pointBackgroundColor: chartColor ? chartColor : colors[count],
          pointRadius: 1,
          clip: 0
        })
        count = count + 1
        return null
      })
    }
    return { datasets }
  }

  const getChartData = () => {
    axios.get(endpoint).then((response) => setData(response.data))
  }

  React.useEffect(() => {
    // getChartData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (data) {
      const ctx = canvasEl.current.getContext('2d')

      let dataChart = dataSet(data)

      const config = {
        type: 'line',
        data: dataChart,
        options: {
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 6,
                includeBounds: true,
              },
            },
            y: {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  if (currentLanguage.name !== 'EN') {
                    if (dataChart.datasets[0].label === 'Index Value^')  dataChart.datasets[0].label = 'Valeur de l’indice^'
                    if (dataChart.datasets[0].label === 'Units Outstanding^^')  dataChart.datasets[0].label = 'Parts En Circulation^^'
                    if (dataChart.datasets[0].label === 'Market Price **')  dataChart.datasets[0].label = 'Cours Du Marché **'
                    if (dataChart.datasets[0].label === 'NAVPU *')  dataChart.datasets[0].label = 'VLPU *'
                  } 
                  const label = dataChart.datasets[0].label
                  const hasDollar =
                    label === 'Index Value^' || label === 'NAVPU *' || label === 'Market Price **'
                  return hasDollar
                    ? '$' + value
                    : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                },
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                pointStyle: 'line',
                usePointStyle: true,
                padding: 20,
                pointStyleWidth: 25,
              },
            },
          },
        },
      }

      const myLineChart = new Chart(ctx, config)

      return function cleanup() {
        myLineChart.destroy()
      }
    }
  }, [data])

  return (
    <Grid item xs={mobileSize} md={desktopSize} py={6} sx={{fontFamily: 'Europa'}}>
      <Grid id={heading} container sx={{flexDirection: 'unset'}}>
        {heading && (
          <Grid item mb={4}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: {xs: 'var(--font-size-primary-md)', md: 'var(--font-size-primary-lg)'},
                color: 'var(--black)',
              }}
            >
              {heading}
            </Typography>
          </Grid>
        )}
        {data && (
          <Grid item xs={12} mb={4} sx={{display: 'flex', justifyContent: 'flex-end', gap: 1}}>
            <CSVLink
              data={data}
              filename={downloadFileName ? `${downloadFileName}.csv` : `line-chart.csv`}
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
              }}
            >
              <TfiDownload size={15} className={styles.download__icon} />
              {downloadText}
            </CSVLink>
          </Grid>
        )}
        <Grid item xs={12} mb={2}>
          <canvas id="myChart" ref={canvasEl} height={chartHeight} />
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
