import supportedLanguages from '../supportedLanguages';
import { HeartIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  name: 'services',
  type: 'document',
  title: 'Services',
  icon: HeartIcon,
  fields: [
    {
      name: 'name',
      type: 'localeString',
      title: 'Heading (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
  ],
  preview: {
    select: {
      name: `name.${baseLanguage.id}`,
    },
    prepare({name = 'No name', media}) {
      return {
        title: name,
        media,
      }
    }
  }
}