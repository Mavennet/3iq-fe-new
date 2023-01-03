import { ComponentIcon } from '@sanity/icons'

export default {
  type: 'document',
  name: 'fundsContent',
  title: 'Funds Content',
  icon: ComponentIcon,
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'isLightBlueLayout',
      type: 'boolean',
      title: 'Layout with light blue color?',
      description: 'Enable this to use light blue layout',
      initialValue: true,
    },
    {
      name: 'showTitleSection',
      type: 'boolean',
      title: 'Show title in section?',
      description: 'Enable the title over the section',
      initialValue: false,
    },
    {
      name: 'lastItem',
      type: 'localeCta',
      title: 'Last item link (Default: Ask 3iQ) (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'fundItems',
      title: 'Fund items (*)',
      description: 'Select the fund items that will be displayed in order',
      validation: Rule => [
        Rule.max(10).warning('Are you sure you want more than 10 items?'),
        Rule.unique().error('You have duplicate items'),
        Rule.min(1).error('Please, select at least 1 item.'),
      ],
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'fundItem' }],
          title: 'Fund item',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: `name`,
      fundItemsLength: `fundItems.length`,
    },
    prepare({ title = '', fundItemsLength }) {
      const fundItemsLengthText = fundItemsLength > 0 ? ' - ' + fundItemsLength + ' fund item(s)' : ''
      return {
        title,
        subtitle: 'Funds Content section' + fundItemsLengthText,
      };
    },
  },
};
