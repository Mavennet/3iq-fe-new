import groq from 'groq'

const pageFragment = groq`
...,
  content[] {
    _type == 'reference' => @->{
      ...,
      post->{
        ...,
        author->
      },
    },
  }`

export const DATA_COUNTRIES = groq`
*[_type == "country"]{
  name,
  urlTag,
  mainNavigation[]-> {
  ...,
  route-> { ..., 'localeTitle': page->title },
  submenuRoutes[]-> { ..., 'localeTitle': page->title },
},
  languages[]->,
  headerLogo,
  footerLogo,
  footerNavigation[]-> { ..., 'localeTitle': page->title },
  footerSecondLeftBlockContent,
  footerAddress,
  footerEmail,
  footerPhoneNumber,
  footerSchedule,
  searchPageRoute  -> {page, slug, ...},
  footerSecondLeftBlockButton,
  braveError,
  footerBottomContent,
  newsletterBody,
  newsletterSubscribeSrc,
  followUsText,
  twitterUrl,
  linkedinUrl,
  youtubeUrl,
  shareThisStoryText,
  newsLetterText,
}
`

export const DATA_EQUALS_SLUG = groq`*[_type == "route" && slug.current == $possibleSlug && $country in countries[]->urlTag][0]{
    page-> {
      ${pageFragment}
    }
  }`

export const DATA_IN_SLUG = groq`*[_type == "route" && slug.current in $possibleSlugs && $country in countries[]->urlTag][0]{
    page-> {
      ${pageFragment}
    }
  }`

export const DATA_IN_SLUG_BY_PATH = groq`*[_type == "route" && slug.current in $possibleSlugs][0]{
    page-> {
      ${pageFragment}[]
    }
  }`

export const ROUTES = groq`
*[_type == 'route'] {...}
`

export const ROUTES_BY_TERM = groq`
*[_type == 'route' && slug.current match [$urlTag, $term]] {...,countries[]-> {urlTag}, page->{...}}
`

export const POSTS_BY_TERM = groq`*[_type == 'post' && !(_id in path('drafts.**')) && (name match $term || heading[$languageTag] match $term || categories[0].name[$languageTag] match $term)] {
      _id,
      _type,
      publishedAt,
      name,
      heading,
      categories[]-> {name},
    }`

export const NEWS_CARD_BY_TERM = groq`
*[_type == 'newsCard' && !(_id in path('drafts.**')) && post._ref in $postsIds] {
  _id,
  _type,
  _rev,
  'localeButtonText': buttonText,
  'localeShortDescription': shortDescription,
  'localeSmallCardText': smallCardText,
  newsletterNumber,
  route->,
  post-> {
    _id,
    _type,
    mainImage,
    'localeHeading': heading,
    publishedAt,
    categories[]-> {singularName, 'localeName': name, ...},
    author-> {
      _id,
      _type,
      name,
      email,
      profilePhoto,
    },
  },
}
`

export const BENEFIT_CARDS = groq`
*[_type == 'benefitCard'] {
  ...,
}
`

export const ITEMS = groq`
*[_type == 'item'] {
  ...,
}
`

export const TEAMS = groq`
*[_type == 'team'] {
  _id,
  _type,
  'localeName': name,
  'isFounder': isFounder,
  members[]-> {
    _id,
    _type,
    name,
    'localeJobTitle': jobTitle,
    'localeBio': bio,
    profilePhoto,
    linkedinUrl,
    email,
    contactText,
    readProfileText,
  },
  countries[]-> {_id},
}
`

export const TIMELINES = groq`
*[_type == 'timeline'] {
  _id,
  _type,
  _rev,
  backgroundImage,
  leftFirstTextBlock,
  leftSecondTextBlock,
  items[]-> {
    _id,
    _type,
    'localeDateText': dateText,
    'localeDescriptionText': descriptionText
  },
}
`

export const LOCATIONS_DISPLAY = groq`
*[_type == 'locationsDisplay'] {
  _id,
  _type,
  _rev,
  locations[]-> {
    _id,
    _type,
    'localeName': name,
    'localeDescription': description,
    googleMapsSrc,
    mainImage,
  }
}
`

export const LOCATIONS = groq`
*[_type == 'location' && _id in $locationIds] {
    _id,
    _type,
    'localeName': name,
    'localeDescription': description,
    googleMapsSrc,
    isMetaverse,
    redirectLink,
    mainImage,
}
`

export const TAB_ITEMS = groq`
*[_type == 'tabItem'] {
  _id,
  _type,
  _rev,
  'localecontentBlock': contentBlock,
  'localeButton': button,
  'localeName': name,
  isPaginatedNewsletter,
  isNewsCardsHorizontalLayout,
  selectedPostCategory-> {...},
  newsCards[]-> {
    _id,
    _type,
    _rev,
    'localeButtonText': buttonText,
    'localeShortDescription': shortDescription,
    'localeSmallCardText': smallCardText,
    route->,
    post-> {
      _id,
      _type,
      mainImage,
      'localeHeading': heading,
      publishedAt,
      categories[]-> {
        _id,
        _type,
        singularName,
        'localeName': name,
        ...
      },
      author-> {
        _id,
        _type,
        name,
        email,
        profilePhoto,
      },
    },
  },
}
`

export const FUND_ITEMS = groq`
*[_type == 'fundItem'] {
  _id,
  _type,
  _rev,
  'localeName': name,
  'localeCodeTitle': codeTitle,
  'firstColumnTitle': firstColumnTitle,
  'thirdColumnTitle': thirdColumnTitle,
  'localeCodeObservation': codeObservation,
  'localeReadMoreText': readMoreText,
  'localeTextBetweenButtons': textBetweenButtons,
  'localeContactUsText': contactUsText,
  'localeObservation' : observation,
  'hiddenTitle': hiddenTitle,
  'bgColor': bgColor,
  fundSections[]-> {
    ...,
    fundSidebarItem[]-> {
      _id,
      _type,
      _rev,
      'localeTitle': title,
      'localeText': text,
      'localeObservation': observation,
      mainImage,
      listImage,
      listItems
    }
  },
  products[]-> {
    _id,
    _type,
    _rev,
    codes,
    'localeName': name,
    'localeHighlights': highlights,
    mainImage,
    mailtoLink,
    buttonColor,
    productIcon,
    'localeObservation' : observation,
    readMoreRoute->,
  },
}
`

export const FUND_CARDS = groq`
*[_type == 'fundCard'] {
  _id,
  _type,
  _rev,
  'localeHeading': heading,
  codes,
  cardColor,
  'localeButton': button,
  'localeText': text,
  'localeDailyNavLabel': dailyNavLabel,
  'localeDailyNav': dailyNav,
  'endpoint': endpoint,
  'backgroundImage': backgroundImage
}
`

export const CATEGORIES = groq`
*[_type == 'category' && searchCategory == true] {...}`

export const CATEGORY_BY_ID = groq`
*[_type == 'category' && _id == $id] {...}[0]`

export const POST_BY_ID = groq`
*[_type == 'post' && _id == $id] {...}[0]`

export const SITE_CONFIG_QUERY = `
  *[_id == "global-config"] {
    ...,
    logo {asset->{extension, url}},
    mainNavigation[] -> {
      ...,
      "title": page->title
    },
    footerNavigation[] -> {
      ...,
      "title": page->title
    }
  }[0]
  `
