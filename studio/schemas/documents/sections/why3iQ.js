import supportedLanguages from '../../supportedLanguages';
import { SplitHorizontalIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: 'document',
  name: 'why3iQ',
  title: 'Why 3iQ',
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: 'name',
      type: 'localeString',
      title: 'Name (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'benefitys',
      type: 'array',
      title: 'Benefitys (*)',
      description: 'Select the benefitys that will be displayed',
      validation: Rule => [
        Rule.error('Information required.').required(),
        Rule.min(1).error('Please, select at least 1 benefity.'),
      ],
      of: [
        {
          type: 'reference',
          to: [{type: 'benefity'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      name: `name.${baseLanguage.id}`,
      firstCountryName: `benefitys.0.countries.0.name`,
      secondCountryName: `benefitys.0.countries.1.name`,
      thirdCountryName: `benefitys.0.countries.2.name`,
      fourthCountryName: `benefitys.0.countries.3.name`,
      fifthCountryName: `benefitys.0.countries.4.name`,  // By passing the countries names, it will be able to access them within prepare() without only receiving the reference _ref
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
        subtitle: 'Why 3iQ section',
      };
    },
  },
};
