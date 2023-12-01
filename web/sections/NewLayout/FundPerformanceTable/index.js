import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Typography, Container, Box, MenuItem, Menu, Button} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from './styles.module.scss'
import {Scrollbars} from 'react-custom-scrollbars-2'
import client from '../../../client'
import groq from 'groq'
import {CSVLink} from 'react-csv'
import * as XLSX from 'xlsx'
import {RiFileExcel2Line, RiTable2} from 'react-icons/ri'
import {TfiDownload} from 'react-icons/tfi'

function FundPerformanceTable(props) {
  const {
    heading,
    embed,
    colorfulLayout,
    color,
    headerTransparentLayout,
    headers,
    currentLanguage,
    headerFundPerformance,
    downloadButton,
    downloadFileName,
    languageTag,
    fundPerformance,
    _id,
  } = props

  const [data, setData] = React.useState()
  const [date, setDate] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const downloadText = currentLanguage.name === 'EN' ? 'Download' : 'Télécharger'

  function downloadExcel() {
    const fileName = downloadFileName ? `${downloadFileName}.xlsx` : `fund-performance.xlsx`
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, fileName)
    handleClose()
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const groqQuery = `*[_type == "fundPerformance" && _id in $ref] | order(priority desc) {
    a1,
    a2,
    a3,
    a4,
    a5,
    a6,
    a7,
    a8,
    a9,
  }`

  const [tableRow, setTableRows] = React.useState([])

  const groqQueryData = `*[_type == "fundPerformance" && _id in $ref] | order(priority desc) {
  "1 month": a3,
    "3 month": a4,
    "6 month": a5,
    "1 YR": a6,
    "Year to Date": a7,
    "Since Inception": a8,
    "3 YR": a9
  }`

  React.useEffect(() => {
    const fetchData = async (refs) => {
      const results = await client.fetch(groqQuery, {ref: refs})
      const data = await client.fetch(groqQueryData, {ref: refs})
      setTableRows(results)
      setData(data)
    }
    let refs = []
    fundPerformance?.forEach((row) => refs.push(row._ref))
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

  const headings_en = [
    'Fund Returns ‡',
    'Inception Date',
    '1 Month',
    '3 Month',
    '6 Month',
    '1 YR	',
    'Year to Date	',
    'Since Inception	',
    '3 YR',
  ]

  const headings_fr = [
    'Rendements des fonds ‡',
    'Date de création	',
    '1 mois	',
    '3 mois	',
    '6 mois	',
    '1 an	',
    'Année à ce jour	',
    'Depuis la création	',
    '3 ans',
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
              mb={!downloadButton && 4}
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: {xs: 'var(--font-size-primary-md)', md: 'var(--font-size-primary-lg)'},
                color: 'var(--black)',
                marginBottom: {xs: 2, md: 0},
              }}
            >
              {heading}
            </Typography>
            {downloadButton && embed && (
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
                    borderBottom: open && 'none',
                  }}
                >
                  <TfiDownload size={15} className={styles.download__icon} />
                  {downloadText}
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
                      filename={downloadFileName ? `${downloadFileName}.csv` : `fund-performance.csv`}
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
              </>
            )}
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
                    {currentLanguage.name === 'EN' ? (
                      <tr>
                        {headings_en.map((item, i) => {
                          return <th key={i}>{item}</th>
                        })}
                      </tr>
                    ) : (
                      <tr>
                        {headings_fr.map((item, i) => {
                          return <th key={i}>{item}</th>
                        })}
                      </tr>
                    )}
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

FundPerformanceTable.propTypes = {
  heading: PropTypes.string,
  embed: PropTypes.object,
  color: PropTypes.string,
  colorfulLayout: PropTypes.bool,
  headerTransparentLayout: PropTypes.bool,
  headers: PropTypes.array,
  currentLanguage: PropTypes.object,
  headerFundPerformance: PropTypes.bool,
  _id: PropTypes.string,
  fundPerformance: PropTypes.array,
}

export default FundPerformanceTable
