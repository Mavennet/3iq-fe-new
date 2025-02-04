import { SplitHorizontalIcon } from '@sanity/icons'

export default {
  type: 'document',
  name: 'heroFirstVariation',
  title: 'Hero First Variation',
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'heading',
      type: 'localePortableText',
      title: 'Heading (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'firstButton',
      type: 'localeCta',
      title: 'First button',
    },
    {
      name: 'secondButton',
      type: 'localeCta',
      title: 'Second button',
    },
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Background image (*)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bottomImage',
      type: 'image',
      title: 'Background image (*)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'icons',
      title: 'Icons',
      description: 'Select the icons that will be displayed',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Benefit Icon',
        },
      ],
    },
    {
      name: 'benefits',
      title: 'Benefits',
      description: 'Select the benefits that will be displayed',
      type: 'array',
      of: [
        {
          type: 'localeString',
          title: 'Benefit',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: `name`,
      media: 'backgroundImage',
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: 'Hero First Variation section',
        media,
      };
    },
  },
};
