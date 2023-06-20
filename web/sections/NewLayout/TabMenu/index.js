import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Container, Typography, Box, Tabs, Tab} from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from './styles.module.scss'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import Image from 'next/image'
import groq from 'groq'
import {TabPanel} from '@mui/lab'
import RenderSections from '../../../components/RenderSections'
import {useState} from 'react'
import {useEffect} from 'react'

function TabMenu(props) {
  const {name, newTabItems, currentLanguage, currentCountry} = props
  const [tabMenus, setTabMenus] = useState([])

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

   return (
     <Box pt={12}>
       <Container sx={{maxWidth: {sm: 'md', lg: 'lg'}}}>
         <Box sx={{borderBottom: 2, position: 'sticky', top: 0, zIndex: 1}}>
           <Tabs
             value={value}
             onChange={handleChange}
             aria-label="basic tabs example"
             centered
             style={{backgroundColor: '#28373c', padding: '20px'}}
           >
             <Tab
               label="3iQ Staking Products"
               wrapped
               {...a11yProps(0)}
               style={value === 0 ? {...tabStyle, ...selectedTabStyle} : tabStyle}
             />
             <Tab
               label="What is Ethereum Staking?"
               {...a11yProps(1)}
               style={value === 1 ? {...tabStyle, ...selectedTabStyle} : tabStyle}
             />
             <Tab
               label="Ethereum FAQ"
               {...a11yProps(2)}
               style={value === 2 ? {...tabStyle, ...selectedTabStyle} : tabStyle}
             />
           </Tabs>
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
       {console.log(tabMenus[0]?.newTabItems)}
     </Box>
   )
}

TabMenu.propTypes = {
  name: PropTypes.string,
  benefitys: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default TabMenu
