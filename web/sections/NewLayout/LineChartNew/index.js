import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Typography, Box, MenuItem, Menu, Button} from '@mui/material'
import {CSVLink} from 'react-csv'
import * as XLSX from 'xlsx'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import axios from 'axios'
import {format} from 'date-fns'
import styles from './styles.module.scss'
import {TfiDownload} from 'react-icons/tfi'
import {RiFileExcel2Line, RiTable2} from 'react-icons/ri'
import {ResponsiveLine} from '@nivo/line'
import {isMobile} from 'react-device-detect'

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
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const convertDate = (value) => {
    const getLocale = (locale) => require(`date-fns/locale/${locale}/index.js`)
    const isEng = currentLanguage.name === 'EN'
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
    let newText = desktopSize === 12 ? text.toFixed(0) : text.toFixed(2)
    return (
      newText.replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, count) +
      (textLength > count ? '...' : '')
    )
  }

  function downloadExcel() {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `line-chart-${_id}.xlsx`)
    handleClose()
  }

  const submenuStyle = {
    //width: '160px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'var(--font-family-primary)',
    fontSize: 'var(--font-size-secondary-sm)',
    color: 'var(--black)',
    alignItems: 'center',
    margin: '0px 28.5px',
    '&:hover': {
      background: 'none',
    },
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
        // if (count % 5 !== 0) return null
        let entries = Object.entries(item)
        let newData = []
        entries.map(([key, val] = entry) => {
          const date = new Date(key)
          if (key !== 'label' && date.getDay() == 5) {
            newData.push({
              x: format(new Date(key), 'yyyy-MM-dd'),
              y: isNaN(val) ? '0' : parseFloat(val).toFixed(2),
            })
          }
        })
        datasets.push({
          id: item.label,
          color: colors[count],
          data: newData.sort((a, b) => new Date(a.x) - new Date(b.x)),
        })
        count = count + 1
        return null
      })
    }
    return datasets
  }

  return (
    <Grid item xs={mobileSize} md={desktopSize} py={6} sx={{fontFamily: 'Europa'}}>
      <Grid container sx={{flexDirection: 'unset'}}>
        {heading && (
          <Grid item mb={4}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: {
                  xs: 'var(--font-size-primary-md)',
                  md: desktopSize === 12 ? 'var(--font-size-primary-lg)' : 48,
                },
                color: 'var(--black)',
                minHeight: {md: desktopSize === 6 && '200px'},
              }}
            >
              {heading}
            </Typography>
          </Grid>
        )}
        {data && (
          <Grid
            item
            xs={12}
            mb={4}
            sx={{display: 'flex', justifyContent: {xs: 'flex-start', md: 'flex-end'}, gap: 1}}
          >
            <Button
              id="demo-positioned-button"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{
                fontFamily: 'var(--font-family-primary)',
                textAlign: 'center',
                background: 'transparent',
                border: '2px solid var(--black)',
                color: 'var(--black)',
                textDecoration: 'none',
                padding: '5px 25px',
                borderRadius: open ? '4px 4px 0px 0px' : '4px',
                fontSize: 'var(--font-size-secondary-sm)',
                textTransform: 'initial',
                borderBottom: open && 'none',
              }}
            >
              <TfiDownload size={15} className={styles.download__icon} />
              Download
            </Button>
            <Menu
              id={`menu-${_id}`}
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: 'var(--background-color)',
                  boxShadow: 'none',
                  borderRadius: '0px 0px 4px 4px',
                  borderLeft: '2px solid var(--black)',
                  borderRight: '2px solid var(--black)',
                  borderBottom: '2px solid var(--black)',
                },
              }}
            >
              <MenuItem
                onClick={() => downloadExcel()}
                sx={{borderTop: '1px solid #ececec', ...submenuStyle}}
              >
                <RiFileExcel2Line size={17} className={styles.download__icon} />
                Excel
              </MenuItem>
              <MenuItem onClick={handleClose} sx={submenuStyle}>
                <CSVLink
                  data={data}
                  onClick={handleClose}
                  filename={`line-chart-${_id}.csv`}
                  target="_blank"
                  style={{
                    textAlign: 'center',
                    background: 'transparent',
                    color: 'var(--black)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-secondary-sm)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <RiTable2 size={18} className={styles.download__icon} />
                  CSV
                </CSVLink>
              </MenuItem>
            </Menu>
          </Grid>
        )}
        <Grid item xs={12}>
          {data && (
            <Box
              sx={{
                height: {xs: '400px', md: `${chartHeight}px`},
              }}
            >
              <ResponsiveLine
                colors={{datum: 'color'}}
                data={data && dataSet(data)}
                margin={{
                  top: 50,
                  right: isMobile ? 20 : 50,
                  bottom: isMobile ? 80 : 70,
                  left: isMobile ? (desktopSize === 6 ? 70 : 40) : 80,
                }}
                xScale={{
                  type: 'time',
                  format: '%Y-%m-%d',
                  precision: 'day',
                }}
                xFormat={`time:%Y-%m-%d`}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false,
                }}
                axisLeft={{
                  format: (v) => `$ ${limitLabel(v)}`,
                }}
                axisBottom={{
                  format: (v) => convertDate(v),
                  tickRotation: isMobile ? 90 : desktopSize === 6 ? 30 : 0,
                }}
                lineWidth={2}
                pointSize={8}
                pointBorderWidth={2}
                pointColor={'var(--background-color)'}
                pointBorderColor={{from: 'serieColor'}}
                pointLabelYOffset={-12}
                useMesh={true}
                theme={{
                  textColor: 'var(--black)',
                  fontSize: 12,
                  fontFamily: 'var(--font-family-secondary)',
                }}
                legends={[
                  {
                    anchor: 'top-left',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 0,
                    itemsSpacing: 100,
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
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            </Box>
          )}
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
