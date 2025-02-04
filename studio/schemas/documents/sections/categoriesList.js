import supportedLanguages from "../../supportedLanguages";
import { SplitHorizontalIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {

  type: "document",
  name: "categoriesList",
  title: "Categories List",
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: "heading",
      type: "localeString",
      title: "First Item"
    },
    {
      name: 'route',
      type: 'reference',
      title: 'Route (*)',
      description: "Select the route that points to this post's Page",
      validation: Rule => Rule.error('Information required.').required(),
      to: [
        {
          type: 'route',
        },
      ],
    },
    {
      name: 'categories',
      type: 'array',
      title: 'Categories',
      description: 'Select one or more categories that this post belongs to',
      validation: Rule => [
        Rule.unique().error('You have duplicate categories'),
        Rule.error('Information required.').required(),
        Rule.min(1).error('Please, select at least 1 category'),
      ],
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: `heading.${baseLanguage.id}`
    },
    prepare({ title }) {
      return {
        title,
        subtitle: "Categories List"
      };
    }
  }
};
