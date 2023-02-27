import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Container, Typography, Box } from '@mui/material'
import SimpleBlockContent from '../../../components/OldLayout/SimpleBlockContent'
import styles from './styles.module.scss'
import imageUrlBuilder from '@sanity/image-url'
import client from '../../../client'
import Image from 'next/image'
import groq from 'groq'
import { pink } from '@mui/material/colors'

function OcioServices(props) {

  const { name, services, currentLanguage } = props

  const [members, setMembers] = React.useState([])

  function urlFor(source) {
    return imageUrlBuilder(client).image(source)
  }

  React.useEffect(() => {
    const fetchMember = async (ids) => {
      await client
        .fetch(
          groq`
        *[_type == 'services' && _id in $personId] {
          _id,
          _type,
          name,
          imageIcon,
          description
        }
       `,
          { personId: ids }
        )
        .then((response) => {
          setMembers(response)
        })
    }

    if (services && members.length == 0) {
      let ids = []
      services.forEach((services) => ids.push(services._ref))
      fetchMember(ids)
    }
  }, [])

  return (
    <Box pb={12}>
      <Container sx={{ maxWidth: { sm: 'md', lg: 'lg' } }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography
              variant="h2"
              mb={8}
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 24,
                color: '#8E8E8E',
                textAlign: 'left',
              }}
            >
              {name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={{xs: 2, md: 4}}>
          {
            members && members.map((item) => {
              return (
                <Grid item key={item._id} xs={12} md={4} mb={4}>
                  <Grid container>
                    {
                      item.name && (
                        <Grid item xs={12}>
                          <ul className={styles.bulletPointsUl}>
                            <li>
                          <Typography
                            variant="h4"
                            sx={{
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 23,
                              fontWeight: 100,
                              color: 'black',
                              wordBreak: 'break-word'
                            }}
                          >
                            {item.name[currentLanguage.languageTag]}
                          </Typography>
                          </li>
                          </ul>
                        </Grid>
                      )
                    }
                  </Grid>
                </Grid>
              )
            })
          }
        </Grid>
      </Container>
    </Box>
  )
}

OcioServices.propTypes = {
  name: PropTypes.string,
  services: PropTypes.object,
  currentLanguage: PropTypes.object,
}

export default OcioServices
