import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import * as SectionComponents from '../sections'
import capitalizeString from '../utils/capitalizeString'

function resolveSections(section) {
  // eslint-disable-next-line import/namespace
  const Section = SectionComponents[capitalizeString(section._type)]

  if (Section) {
    return Section
  }

  console.error('Cant find section', section) // eslint-disable-line no-console
  return null
}

function getContent(sectionItems, items) {
  if (sectionItems) {
    for (let index = 0; index < sectionItems.length; index++) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        if (item._id === sectionItems[index]._ref) {
          sectionItems[index] = item
          break
        }
      }
    }

    return sectionItems
  }
}

function getContentWithRoutes(sectionItems, items, countryLanguageTags, routes) {
  if (sectionItems) {
    for (let index = 0; index < sectionItems.length; index++) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        if (item._id === sectionItems[index]._ref) {
          sectionItems[index] = item

          if (sectionItems[index].localeButton) {
            countryLanguageTags.forEach(tag => {
              const localeRoute = routes?.filter((r) => r._id === sectionItems[index].localeButton[tag]?.route?._ref)[0]
              if (localeRoute) {
                sectionItems[index].localeButton[tag].route = localeRoute
              }
            })
          }
        }
      }
    }
  }

  return sectionItems
}

function RenderSections(props) {
  const { sections, routes, posts, benefits, items, teams, timelines, locationsDisplays, tabItems, fundItems, fundCards } = props

  sections.forEach((section) => {
    const toConvertItems = [
      'localeCta',
      'localeText',
      'localeString',
      'localeSimplePortableText',
      'localePortableText',
    ]
    const sectionKeys = Object.keys(section)
    const sectionValues = Object.values(section)
    const filteredSectionKeys = []
    const countryLanguageTags = section.currentCountry.languages.map(language => language.languageTag)

    sectionValues.forEach((value, index) => {
      if (value && value._type && toConvertItems.indexOf(value._type) >= 0) {
        filteredSectionKeys.push(sectionKeys[index])
      }
    })
    filteredSectionKeys.forEach((key) => {
      if (section[key] && section.currentLanguage) {
        if (section[key]._type === 'localeCta') {
          countryLanguageTags.forEach(tag => {
            const localeRoute = routes?.filter((r) => r._id === section[key][tag]?.route?._ref)[0]
            if (localeRoute) {
              section[key][tag].route = localeRoute
            }
          })
        } else {
          const localeParameter = section[key][section.currentLanguage.languageTag]
          section[key] = localeParameter
        }
      }
    })


    if (section.route) {
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]

        if (route._id === section.route._ref) {
          section.route = route // TODO Add break later and verify if breaks current functionality somehow
        }
      }
    }

    if (section.benefits && section.benefits[0]._ref) {
      for (let i = 0; i < section.benefits.length; i++) {
        for (let j = 0; j < benefits.length; j++) {
          const currBenefit = benefits[j]

          if (currBenefit._id === section.benefits[i]._ref) {
            section.benefits[i] = currBenefit
            break
          }
        }
      }
    }

    if (section.items && section.items[0]._ref) {
      for (let i = 0; i < section.items.length; i++) {
        for (let j = 0; j < items.length; j++) {
          const currItems = items[j]

          if (currItems._id === section.items[i]._ref) {
            section.items[i] = currItems
            break
          }
        }
      }
    }

    // if (section.teams) {
    //   for (let index = 0; index < section.teams.length; index++) {
    //     for (let i = 0; i < teams.length; i++) {
    //       const team = teams[i]

    //       if (team._id === section.teams[index]._ref) {
    //         section.teams[index] = team // TODO Add break later and verify if breaks current functionality somehow
    //       }
    //     }
    //   }
    // }

    // if (section.fundItems) {
    //   for (let index = 0; index < section.fundItems.length; index++) {
    //     for (let i = 0; i < fundItems.length; i++) {
    //       const item = fundItems[i]

    //       if (item._id === section.fundItems[index]._ref) {
    //         section.fundItems[index] = item
    //         break
    //       }
    //     }
    //   }
    // }

    if (section._type === 'timeline') {
      for (let i = 0; i < timelines.length; i++) {
        const timeline = timelines[i]

        if (timeline._id === section._id) {
          section.items = timeline.items
          break
        }
      }
    }

    if (section._type === 'locationsDisplay') {
      for (let i = 0; i < locationsDisplays.length; i++) {
        const locDisplay = locationsDisplays[i]

        if (locDisplay._id === section._id) {
          section.locations = locDisplay.locations
          break
        }
      }
    }

    // if (section.tabItems) {
    //   for (let index = 0; index < section.tabItems.length; index++) {
    //     for (let i = 0; i < tabItems.length; i++) {
    //       const item = tabItems[i]

    //       if (item._id === section.tabItems[index]._ref) {
    //         section.tabItems[index] = item

    //         if (section.tabItems[index].localeButton) {
    //           countryLanguageTags.forEach(tag => {
    //             const localeRoute = routes.filter((r) => r._id === section.tabItems[index].localeButton[tag]?.route?._ref)[0]
    //             if (localeRoute) {
    //               section.tabItems[index].localeButton[tag].route = localeRoute
    //             }
    //           })
    //         }

    //         break
    //       }
    //     }
    //   }
    // }

    // if (section.fundCards) {
    //   for (let index = 0; index < section.fundCards.length; index++) {
    //     for (let i = 0; i < fundCards.length; i++) {
    //       const item = fundCards[i]

    //       if (item._id === section.fundCards[index]._ref) {
    //         section.fundCards[index] = item

    //         if (section.fundCards[index].localeButton) {
    //           countryLanguageTags.forEach(tag => {
    //             const localeRoute = routes.filter((r) => r._id === section.fundCards[index].localeButton[tag]?.route?._ref)[0]
    //             if (localeRoute) {
    //               section.fundCards[index].localeButton[tag].route = localeRoute
    //             }
    //           })
    //         }

    //         break
    //       }
    //     }
    //   }
    // }


    section.tabItems = getContentWithRoutes(section.tabItems, tabItems, countryLanguageTags, routes)
    section.fundCards = getContentWithRoutes(section.fundCards, fundCards, countryLanguageTags, routes)
    section.fundItems = getContent(section.fundItems, fundItems)
    section.teams = getContent(section.teams, teams)

    if (section._type === 'fundsContent') {
      section.allRoutes = routes
      section.allBenefits = benefits
      section.allItems = items
      section.allPosts = posts
      section.allTeams = teams
      section.allTimelines = timelines
      section.allLocationsDisplays = locationsDisplays
      section.allTabItems = tabItems
    }
  })

  if (!sections) {
    console.error('Missing section')
    return <div>Missing sections</div>
  }

  return (
    <Fragment>
      {sections.map((section) => {
        const SectionComponent = resolveSections(section)
        if (!SectionComponent) {
          return <div key={1}>Missing section {section._type}</div>
        }
        return <SectionComponent {...section} key={section._id} />
      })}
    </Fragment>
  )
}

RenderSections.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      _type: PropTypes.string,
      _key: PropTypes.string,
      section: PropTypes.instanceOf(PropTypes.object),
    })
  ),
  routes: PropTypes.array,
  posts: PropTypes.array,
  fundsContent: PropTypes.array,
  teams: PropTypes.array,
  timelines: PropTypes.array,
  locationsDisplays: PropTypes.array,
  tabItems: PropTypes.array,
  fundItems: PropTypes.array,
  fundCards: PropTypes.array,
  items: PropTypes.array,
  benefits: PropTypes.array,
}

export default RenderSections
