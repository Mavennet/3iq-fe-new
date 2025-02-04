import supportedLanguages from '../../supportedLanguages';
import { SplitHorizontalIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: 'document',
  name: 'heroWithImage',
  title: 'Hero with Image',
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
      title: "Align text to",
      name: "align",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "flex-start" },
          { title: "Right", value: "flex-end" },
        ],
        layout: "radio"
      }
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
      name: 'button',
      type: 'localeCta',
      title: 'Main button (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'stripes',
      type: 'boolean',
      title: 'Display stripes in Layout?',
      description: 'Enable to show 3 stripes in footer layout.',
      initialValue: false,
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
        subtitle: 'Hero With Image section',
        media,
      };
    },
  },
};
