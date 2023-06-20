import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material'
import {ChevronLeft, ChevronRight} from '@mui/icons-material'
import client from '../../../client'
import RenderSections from '../../../components/RenderSections'
import {useState, useEffect} from 'react'

function TabMenu(props) {
  const {name, newTabItems, currentLanguage, currentCountry} = props
  const [tabMenus, setTabMenus] = useState([])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchTabMenus = async () => {
      try {
        const query = `*[_type == "tabMenu"]{
          name,
          newTabItems[]->{
            name,
            pageSections[]{
              ...,
              _type == "reference" => @->
            }
          }
        }`

        const result = await client.fetch(query)
        setTabMenus(result)
      } catch (error) {
        console.error('Error fetching tab menus:', error)
      }
    }

    fetchTabMenus()
  }, [])

  // Tab Menu Configurations
  function TabPanel(props) {
    const {children, value, index, ...other} = props
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{p: 3}}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    )
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }
  // End here
  const createSection = (content) => {
    const contentWithDefaultLanguage = []
    content &&
      content.map((c) => contentWithDefaultLanguage.push({...c, currentLanguage, currentCountry}))
    return contentWithDefaultLanguage
  }

  const tabStyle = {
    fontSize: '20px',
    textTransform: 'none',
    color: 'white',
    fontWeight: 'normal', // Default font weight
  }

  const selectedTabStyle = {
    fontWeight: 'bold', // Bold font weight for the selected tab
  }

  const tabsContainerStyle = {
    backgroundColor: '#28373c',
    padding: '20px',
    justifyContent: isMobile ? 'flex-start' : 'space-evenly', // Adjust alignment for mobile devices
    overflowX: isMobile ? 'auto' : 'unset', // Allow horizontal scrolling on mobile
    position: 'relative', // Position relative for arrow icons
  }

  const tabItemStyle = {
    margin: '0 40px', // Add spacing between the tab items
  }
  
const arrowButtonStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'white',
}

  return (
    <Box pt={12}>
      <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}}}>
        <Box sx={{borderBottom: 2, position: 'sticky', top: 0, zIndex: 1}}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered={true} // Center the tabs on non-mobile devices
            sx={tabsContainerStyle}
            variant={isMobile ? 'scrollable' : null}
            scrollButtons="auto"
          >
            <Tab
              label={tabMenus[0]?.newTabItems[0].name[currentLanguage.languageTag]}
              wrapped
              {...a11yProps(0)}
              style={value === 0 ? {...tabStyle, ...selectedTabStyle} : tabStyle}
              sx={tabItemStyle}
            />
            <Tab
              label={tabMenus[0]?.newTabItems[1].name[currentLanguage.languageTag]}
              {...a11yProps(1)}
              style={value === 1 ? {...tabStyle, ...selectedTabStyle} : tabStyle}
              sx={tabItemStyle}
            />
            <Tab
              label={tabMenus[0]?.newTabItems[2].name[currentLanguage.languageTag]}
              {...a11yProps(2)}
              style={value === 2 ? {...tabStyle, ...selectedTabStyle} : tabStyle}
              sx={tabItemStyle}
            />
          </Tabs>
          {isMobile && (
            <IconButton
              aria-label="Previous Tab"
              onClick={() => handleChange(null, value - 1)}
              disabled={value === 0}
              sx={{...arrowButtonStyle, left: 0}}
            >
              <ChevronLeft />
            </IconButton>
          )}
          {isMobile && (
            <IconButton
              aria-label="Next Tab"
              onClick={() => handleChange(null, value + 1)}
              disabled={value === tabMenus[0]?.newTabItems.length - 1}
              sx={{...arrowButtonStyle, right: 0}}
            >
              <ChevronRight />
            </IconButton>
          )}
        </Box>
        <TabPanel value={value} index={0}>
          {tabMenus[0]?.newTabItems[0].pageSections && (
            <RenderSections sections={createSection(tabMenus[0]?.newTabItems[0].pageSections)} />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {tabMenus[0]?.newTabItems[1].pageSections && (
            <RenderSections sections={createSection(tabMenus[0]?.newTabItems[1].pageSections)} />
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {tabMenus[0]?.newTabItems[2].pageSections && (
            <RenderSections sections={createSection(tabMenus[0]?.newTabItems[2].pageSections)} />
          )}
        </TabPanel>
      </Container>
    </Box>
  )
}

TabMenu.propTypes = {
  name: PropTypes.string,
  benefitys: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default TabMenu
