import supportedLanguages from '../../supportedLanguages';
import { SplitHorizontalIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: 'document',
  name: 'textAndThreeImages',
  title: 'Text And Three Images',
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
      title: 'Background image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'backgroundColor',
      type: 'string',
      title: 'Background color',
      description: 'Default: #091b3f (Blue)',
      options: {
        list: [
          { title: "Blue", value: "#0082E5" },
          { title: "Green", value: "#008C86" },
          { title: "Orange", value: "#F59B1E" },
          { title: "White", value: "#FFFFFF" }
        ],
        layout: "radio"
      }
    },
    {
      name: 'sideImage1',
      type: 'image',
      title: 'Optional Side Image 1',
      options: {
        hotspot: true,
      },
    },
    {
        name: 'sideImage2',
        type: 'image',
        title: 'Optional Side Image 2',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'sideImage3',
        type: 'image',
        title: 'Optional Side Image 3',
        options: {
          hotspot: true,
        },
      },
    {
      name: 'button',
      type: 'localeCta',
      title: 'Optional button',
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
        subtitle: 'Text And Three Images',
        media,
      };
    },
  },
};
