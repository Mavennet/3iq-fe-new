import supportedLanguages from '../../supportedLanguages';
import { SplitHorizontalIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: 'document',
  name: 'heroSubscribe',
  title: 'Hero Subscribe',
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: 'heading',
      type: 'localeString',
      title: 'Heading (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'description',
      type: 'localeSimplePortableText',
      title: 'Description',
    },
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Background image (*)',
      validation: Rule => Rule.error('Information required.').required(),
      options: {
        hotspot: true,
      },
    },
    {
      name: 'newsletterSubscribeSrc',
      type: 'url',
      title: 'Newsletter Subscribe Link',
    },
    {
      name: 'button',
      type: 'localeCta',
      title: 'Optional button',
      description: 'Optional button that will be displayed above the content'
    },
  ],
  preview: {
    select: {
      title: `heading.${baseLanguage.id}`,
      media: 'backgroundImage',
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: 'Hero Subscribe section',
        media,
      };
    },
  },
};
