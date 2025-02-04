import Typography from '@mui/material/Typography'
import React, {useState} from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import PropTypes from 'prop-types'
import CustomTabItem from '../CustomTabItem'

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

export default function CustomTab(props) {
  const {items, currentLanguage} = props
  const [value, setValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Box>
        <Tabs
          value={value}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{style: {background: 'transparent', transition: 'none'}}}
          sx={{marginBottom: '-2px'}}
        >
          {items.map((item, index) => (
            <Tab
                key={`tab_${index}`}
              style={{
                marginRight: '-2px',
                border: value === index && '2px solid #dc6e19',
                borderBottom: value === index && '2px solid white',
                fontFamily: 'Europa',
                fontSize: '20px',
                color: value === index ? '#dc6e19' : '#0082e5',
                fontWeight: 'bold',
                lineHeight: '32px',
                textTransform: 'none',
                padding: '20px',
                maxWidth: '200px',
                textAlign: 'left',
              }}
              disableRipple
              label={item.localeName[currentLanguage.languageTag]}
            />
          ))}
        </Tabs>
      </Box>
      {items.map((item, index) => (
        <TabPanel key={`tabPanel_${index}`} style={{border: '2px solid #dc6e19'}} value={value} index={index}>
          <CustomTabItem
            {...item}
            currentLanguage={currentLanguage}
          />
        </TabPanel>
      ))}
    </Box>
  )
}

CustomTab.propTypes = {
    items: PropTypes.object,
    currentLanguage: PropTypes.oject
}

TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number ,
    index: PropTypes.number ,
    other: PropTypes.object
}
