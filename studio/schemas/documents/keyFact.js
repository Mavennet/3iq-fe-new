import supportedLanguages from '../supportedLanguages';
import { BookIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: 'keyFact',
  type: 'document',
  title: 'Key Fact',
  icon: BookIcon,
  fields: [
    {
      name: 'name',
      type: 'localeString',
      title: 'Name (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'keyFactTitle',
      type: 'localeString',
      title: 'Key Fact Title (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'keyFactValue',
      type: 'localeString',
      title: 'Key Fact Value (*)',
    },
  ],
  preview: {
    select: {
      name: `name.${baseLanguage.id}`,
    },
    prepare({ name }) {
      return {
        title: `${name}`,
      }
    },
  },

}
