import supportedLanguages from '../../supportedLanguages'
import { ComponentIcon } from '@sanity/icons'

const baseLanguage = supportedLanguages.find(l => l.isDefault)

export default {
  type: 'document',
  name: 'tableSection',
  title: 'Table Section',
  icon: ComponentIcon,
  fieldsets: [
    {
      title: 'Table Source',
      name: 'tableComposition',
      description: 'Select if you will use an API Endpoint as the data source or if the table will be HTML hardcoded',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'isEnableName',
      type: 'boolean',
      title: 'Is the table name visible?',
      description: 'Enable this if you want to display the table name above the table content',
      initialValue: true,
    },
    {
      name: 'headerTransparentLayout',
      type: 'boolean',
      title: 'Use layout with transparent header?',
      description: 'Header will be a white color',
      initialValue: false,
    },
    {
      name: 'colorfulLayout',
      type: 'boolean',
      title: 'Use a colorful layout?',
      description: 'First cells with orange font and last cells with background blue',
      initialValue: false,
    },
    {
      name: 'headers',
      title: 'Headers (*)',
      description: 'Create each table header item',
      type: 'array',
/*       validation: Rule => [
        Rule.error('Information required.').required(),
        Rule.min(2).max(2).error('Please, select 2 symbols.'),
      ], */
      of: [{ type: 'localeString' }],
    },
    {
      name: 'endpoint',
      type: 'url',
      title: 'API Endpoint',
      description: "Insert an optional URL for the API endpoint that will retrieve the data to populate the table automatically",
      fieldset: 'tableComposition',
      validation: Rule =>
        Rule.uri({
          allowRelative: false,
          scheme: ['https', 'http'],
        }),
    },
    {
      name: 'embed',
      type: 'localePortableText',
      title: 'HTML Table',
      description: 'Create an optional hardcoded HTML table through the EmbedHTML tag',
      fieldset: 'tableComposition',
    },
  ],
  preview: {
    select: {
      title: 'name',
      endpoint: 'endpoint',
      embed: `embed.${baseLanguage.id}`,
    },
    prepare({ title, endpoint, embed }) {
      const subtitleText = ' - ' + (endpoint ? endpoint : (embed ? 'Hardcoded table' : 'No source defined for this table'))
      return {
        title,
        subtitle: 'Custom Table section' + subtitleText,
      };
    },
  },
};
