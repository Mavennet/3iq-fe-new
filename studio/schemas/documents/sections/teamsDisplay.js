import supportedLanguages from '../../supportedLanguages';
import { SplitHorizontalIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: 'document',
  name: 'teamsDisplay',
  title: 'Teams Display',
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: 'name',
      type: 'localeString',
      title: 'Name (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'description',
      type: 'localePortableText',
      title: 'Description',
      description: 'Text under the title',
    },
    {
      name: 'quotesText',
      type: 'localePortableText',
      title: 'Text under Quotes in Founder section (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'teams',
      type: 'array',
      title: 'Teams (*)',
      description: 'Select the teams that will be displayed',
      validation: Rule => [
        Rule.error('Information required.').required(),
        Rule.min(1).error('Please, select at least 1 team.'),
      ],
      of: [
        {
          type: 'reference',
          to: [{type: 'team'}],
        },
      ],
    },
    {
      name: 'textCta',
      type: 'localePortableText',
      title: 'Text CTA',
    },
    {
      name: 'buttonCta',
      type: 'localeCta',
      title: 'CTA Button',
    },
    {
      name: 'backgroundImageCta',
      type: 'image',
      title: 'CTA Background image (*)',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      name: `name.${baseLanguage.id}`,
      firstCountryName: `teams.0.countries.0.name`,
      secondCountryName: `teams.0.countries.1.name`,
      thirdCountryName: `teams.0.countries.2.name`,
      fourthCountryName: `teams.0.countries.3.name`,
      fifthCountryName: `teams.0.countries.4.name`,  // By passing the countries names, it will be able to access them within prepare() without only receiving the reference _ref
    },
    prepare({ name = '', firstCountryName = '', secondCountryName, thirdCountryName, fourthCountryName, fifthCountryName }) {
      let countryNames = firstCountryName;
      countryNames = secondCountryName ? countryNames.concat(', ' + secondCountryName) : countryNames;
      countryNames = thirdCountryName ? countryNames.concat(', ' + thirdCountryName) : countryNames;
      countryNames = fourthCountryName ? countryNames.concat(', ' + fourthCountryName) : countryNames;
      countryNames = fifthCountryName ? countryNames.concat(', ' + fifthCountryName) : countryNames;

      const title = name
      return {
        title,
        subtitle: 'Team Display section',
      };
    },
  },
};
