import supportedLanguages from '../supportedLanguages';
import { MdInsights } from "react-icons/md";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: 'document',
  name: 'fundItem',
  title: 'Fund Item',
  icon: MdInsights,
  fieldsets: [
    {
      title: 'Product Cards',
      name: 'productCards',
      description: 'Fill the fields below if you want to display the product cards',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'localeString',
      title: 'Fund item Name (*)',
      validation: Rule => Rule.error('Information required.').required(),
    },
    {
      name: 'hiddenTitle',
      type: 'boolean',
      title: 'Hidden title in Fund Sections?',
      description: 'The title will be not visible',
      initialValue: false,
    },
    {
      name: 'bgColor',
      type: 'string',
      title: 'Background Color',
    },
    {
      name: 'fundSections',
      type: 'array',
      title: 'Fund sections',
      description: "Content that will be displayed in the page with the same order",
      of: [
        {
          type: 'reference',
          to: [
            {type: 'lineChart'},
            {type: 'tableSection'},
            {type: 'fundHistoricalPerformanceTable'},
            {type: 'fundPerformanceTable'},
            {type: 'tableCripto'},
            {type: 'textSection'},
            {type: 'keyBenefits'},
            {type: 'tabsContent'},
            {type: 'awards'},
            {type: 'advertisement'},
            {type: 'note'},
            {type: 'fundsOverview'},
            {type: 'quoteHeads'},
            {type: 'quoteHeadsDubai'},
            {type: 'articles'},
            {type: 'automatedArticles'},
            {type: 'textSeparator'},
            {type: 'heroFirstVariation'}
          ]
        }
      ]
    },
    {
      name: 'firstColumnTitle',
      type: 'localeString',
      title: 'First Column Title',
      fieldset: 'productCards',
    },
    {
      name: 'codeTitle',
      type: 'localeString',
      title: 'Second Column Title',
      fieldset: 'productCards',
    },
    {
      name: 'codeObservation',
      type: 'localeString',
      title: 'Second Column Observation',
      fieldset: 'productCards',
    },
    {
      name: 'thirdColumnTitle',
      type: 'localeString',
      title: 'Third Column Title',
      fieldset: 'productCards',
    },
    {
      name: 'products',
      title: 'Products',
      description: 'Select the product(s) that will be displayed in order',
      fieldset: 'productCards',
      validation: Rule => [
        Rule.max(4).warning('Are you sure you want more than 4 items?'),
        Rule.unique().error('You have duplicate products'),
      ],
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
          title: 'Product',
        },
      ],
    },
    {
      name: 'textBetweenButtons',
      type: 'localeString',
      title: 'Text Between Buttons',
      fieldset: 'productCards',
    },
    {
      name: 'readMoreText',
      type: 'localeString',
      title: 'Read More Button text',
      description: 'Text that will be displayed in the Read More button for each product',
      fieldset: 'productCards',
    },
    {
      name: 'contactUsText',
      type: 'localeString',
      title: 'Contact Us Button text',
      description: 'Text that will be displayed in the Contact Us button for each product',
      fieldset: 'productCards',
    },
  ],
  preview: {
    select: {
      title: `name.${baseLanguage.id}`,
      fundSectionsLength: `fundSections.length`,
      productsLength: `products.length`,
    },
    prepare({ title = '', fundSectionsLength, productsLength }) {
      const subtitleText = fundSectionsLength > 0 ? fundSectionsLength + ' fund section(s) included' : (productsLength > 0 ? productsLength + ' product(s) included' : 'No fund section included')
      return {
        title,
        subtitle: subtitleText,
      };
    },
  },
};
