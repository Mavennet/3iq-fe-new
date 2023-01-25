import supportedLanguages from '../../supportedLanguages';
import { SplitHorizontalIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: 'document',
  name: 'ocioServices',
  title: 'OCIO Services',
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: 'name',
      type: 'localeString',
      title: 'Name (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'services',
      type: 'array',
      title: 'Services (*)',
      description: 'Select the services that will be displayed',
      validation: Rule => [
        Rule.error('Information required.').required(),
        Rule.min(1).error('Please, select at least 1 benefity.'),
      ],
      of: [
        {
          type: 'reference',
          to: [{type: 'services'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      name: `name.${baseLanguage.id}`,
      firstCountryName: `services.0.countries.0.name`,
      secondCountryName: `services.0.countries.1.name`,
      thirdCountryName: `services.0.countries.2.name`,
      fourthCountryName: `services.0.countries.3.name`,
      fifthCountryName: `services.0.countries.4.name`,  // By passing the countries names, it will be able to access them within prepare() without only receiving the reference _ref
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
        subtitle: 'OCIO Services section',
      };
    },
  },
};
