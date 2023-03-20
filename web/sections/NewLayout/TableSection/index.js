import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, Container, Box, MenuItem, Menu, Button } from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from './styles.module.scss'
import axios from 'axios'
import { format } from 'date-fns'
import { CSVLink } from 'react-csv'
import * as XLSX from 'xlsx'
import { RiFileExcel2Line, RiTable2 } from 'react-icons/ri'
import { TfiDownload } from 'react-icons/tfi'
import { Scrollbars } from 'react-custom-scrollbars-2'

function TableSection(props) {
  const {
    heading,
    embed,
    colorfulLayout,
    color,
    headerTransparentLayout,
    downloadButton,
    endpoint,
    headers,
    currentLanguage,
    headerFundPerformance,
    downloadFileName,
    languageTag,
    _id
  } = props

  const [data, setData] = React.useState()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const [date, setDate] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function downloadExcel() {
    const fileName = downloadFileName ? `${downloadFileName}.xlsx` : `line-chart.xlsx`
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, fileName)
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
      background: 'none'
    }
  }


  const typesStyle = {
    orange: styles.orange,
    lightBlue: styles.light__blue,
    darkBlue: styles.dark__blue
  }

  const getTableData = (endpoint) => {
    axios.get(endpoint)
      .then(response => {
        response.data[currentLanguage.languageTag] ? setData([response.data[currentLanguage.languageTag]]) : setData(response.data)
        response.data.date && setDate(response.data.date[currentLanguage.languageTag])
      })
  }

  const isDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateStr.match(regex) === null) {
      return false;
    }

    const date = new Date(dateStr);

    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }

    return date.toISOString().startsWith(dateStr);
  }

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

  React.useEffect(() => {
    if (endpoint) {
      getTableData(endpoint)
    }
  }, [endpoint, currentLanguage])

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: `#0082E5`,
      borderRadius: '10px'
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props} />
    );
  }

  return (
    <Container sx={{ maxWidth: { sm: 'md', md: 'lg', lg: 'xl' } }}>
      <Grid container my={6}>
        {
          heading && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography
                variant="h2"
                mb={!downloadButton && 4}
                sx={{
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: { xs: 'var(--font-size-primary-md)', md: 'var(--font-size-primary-lg)' },
                  color: 'var(--black)',
                  marginBottom: { xs: 2, md: 0 }
                }}
              >{heading}</Typography>
              {
                downloadButton && embed && (
                  <>
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
                        borderBottom: open && 'none'
                      }}
                    >
                      <TfiDownload
                        size={15}
                        className={styles.download__icon}
                      />
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
                        "& .MuiPaper-root": {
                          backgroundColor: "var(--background-color)",
                          boxShadow: 'none',
                          borderRadius: '0px 0px 4px 4px',
                          borderLeft: '2px solid var(--black)',
                          borderRight: '2px solid var(--black)',
                          borderBottom: '2px solid var(--black)',
                        }
                      }}
                    >
                      <MenuItem onClick={() => downloadExcel()} sx={{ borderTop: '1px solid #ececec', ...submenuStyle }}>
                        <RiFileExcel2Line
                          size={17}
                          className={styles.download__icon}
                        />
                        Excel
                      </MenuItem>
                      <MenuItem onClick={handleClose} sx={submenuStyle}>
                        <CSVLink
                          data={data}
                          onClick={handleClose}
                          filename={ downloadFileName ? `${downloadFileName}.csv` : `line-chart.csv` }
                          target="_blank"
                          style={{
                            textAlign: 'center',
                            background: 'transparent',
                            color: 'var(--black)',
                            textDecoration: 'none',
                            fontSize: 'var(--font-size-secondary-sm)',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <RiTable2
                            size={18}
                            className={styles.download__icon}
                          />
                          CSV
                        </CSVLink>
                      </MenuItem>
                    </Menu>
                  </>
                )
              }
            </Grid>
          )
        }
        {
          headerFundPerformance && (
            <Grid item xs={12} mt={5}>
              <div className={styles.fundPerformanceHeader}>
                <div className={styles.firstCell}></div>
                <div className={styles.secondCell}>
                  <p>{currentLanguage?.languageTag.startsWith('en') ? 'Total Returns' : 'Retours totaux'}</p>
                </div>
                <div className={styles.thirdCell}>
                  <p>{currentLanguage?.languageTag.startsWith('en') ? 'Annualized Returns' : 'Rendements annualisés'}</p>
                </div>
              </div>
            </Grid>
          )
        }
        {
          data && (
            <Grid item xs={12}>
               <Scrollbars
                autoHeight
                autoHeightMin={data.length === 1 ? 200 : 300}
                autoHeightMax={500}
                className={styles.simpleBlockContent}
                renderThumbHorizontal={renderThumb}
              >
                <table>
                  {
                    headers ? (
                      <thead className={headerTransparentLayout && styles.headerTransparent}>
                        <tr>
                          {
                            headers.map((item) => {
                              return (
                                <th key={item._key}>{item[currentLanguage?.languageTag]}</th>
                              )
                            })
                          }
                        </tr>
                      </thead>
                    ) : (
                      <thead className={headerTransparentLayout && styles.headerTransparent}>
                        <tr>
                          {
                            data.map((item, i) => {
                              const keys = Object.keys(item)
                              return keys.map((item, i) => {
                                return (
                                  <th key={i}>{item}</th>
                                )
                              })
                            })
                          }
                        </tr>
                      </thead>
                    )
                  }
                  <tbody className={colorfulLayout && `${styles.tableColorful} ${typesStyle[color]}`}>
                    {
                      data.map((item, i) => {
                        const values = Object.values(item)
                        const keys = Object.keys(item)
                        return (
                          <tr key={i}>
                            {
                              values.map((item, i) => {
                                return (keys[i] !== 'dateDaily' &&
                                  <td key={i}>
                                    <div className={styles.bg}>
                                      {
                                        (keys[i] === 'cad' || keys[i] === 'usd') && parseFloat(item) > 1000
                                          ? `$ ${parseFloat(item).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                          : (keys[i] === 'cad' || keys[i] === 'usd') && parseFloat(item) < 1000 ? `$ ${parseFloat(item).toFixed(4)}`
                                            : isDate(item)
                                              ? convertDate(item)
                                              : item
                                      }
                                    </div>
                                  </td>
                                )
                              })
                            }
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                {data[0].dateDaily && (
                  <Box sx={{ my: 2 }}>
                    <Typography align='right' sx={{ color: '#77757F' }}>{`${currentLanguage.name === 'EN' ? 'Price as at' : 'Prix au'} ${convertDate(data[0].dateDaily)}`}</Typography>
                  </Box>
                )}
              </Scrollbars>
            </Grid>
          )
        }
        {
          embed && (
            <Grid item xs={12} my={3}>
              <div className={styles.simpleBlockContent}>
                <SimpleBlockContent blocks={embed} />
                {date && (
                  <Typography paragraph style={{ color: 'var(--dark-gray)', fontWeight: '300', fontStyle: 'normal' }}>‡ {date}</Typography>
                )}
              </div>
            </Grid>
          )
        }
      </Grid>
    </Container>
  )
}

TableSection.propTypes = {
  heading: PropTypes.string,
  embed: PropTypes.object,
  color: PropTypes.string,
  colorfulLayout: PropTypes.bool,
  headerTransparentLayout: PropTypes.bool,
  downloadButton: PropTypes.bool,
  endpoint: PropTypes.string,
  headers: PropTypes.array,
  currentLanguage: PropTypes.object,
  headerFundPerformance: PropTypes.bool,
  _id: PropTypes.string,
}

export default TableSection
