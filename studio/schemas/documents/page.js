
import supportedLanguages from '../supportedLanguages';
import { MasterDetailIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: 'page',
  type: 'document',
  title: 'Page',
  icon: MasterDetailIcon,
  fieldsets: [
    {
      title: 'SEO & metadata',
      name: 'metadata',
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Title (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'content',
      type: 'array',
      title: 'Page sections (*)',
      validation: Rule => [
        Rule.error('Information required.').required(),
        Rule.min(1).error('Please, select a country.'),
      ],
      of: [
        {
          type: 'reference',
          to: [
            {type: 'post'},
            {type: 'newsCard'},
            {type: 'textSection'},
            {type: 'hero'},
            {type: 'timeline'},
            {type: 'heroWithImage'},
            {type: 'imageBesideText'},
            {type: 'sideBySideImages'},
            {type: 'doubleOptions'},
          ]
        }
      ]
    },
    {
      name: 'countries',
      title: 'Countries (*)',
      description: 'Choose the country that this content will be displayed into',
      type: 'array',
      validation: Rule => [
        Rule.error('Information required.').required(),
        Rule.min(1).error('Please, select a country.'),
      ],
      of: [{type: 'reference', to: {type: 'country'}}],
    },
    {
      name: 'description',
      type: 'localeText',
      title: 'Description',
      description: 'This description populates meta-tags on the webpage',
      fieldset: 'metadata',
    },
    {
      name: 'openGraphImage',
      type: 'image',
      title: 'Open Graph Image',
      description: 'Image for sharing previews on Facebook, Twitter etc.',
      fieldset: 'metadata',
    },
  ],

  preview: {
    select: {
    },
  },
  preview: {
    select: {
      title: `title.${baseLanguage.id}`,
      media: 'openGraphImage',
      countryName: 'countries.0.name',
    },
    prepare({ title, media, countryName = '' }) {
      const subtitle = countryName ? countryName : ''
      return {
        title,
        media,
        subtitle: `${subtitle}`,
      };
    },
  },
}
