import { SplitHorizontalIcon } from '@sanity/icons'
import supportedLanguages from '../../supportedLanguages'

const baseLanguage = supportedLanguages.find(l => l.isDefault)

export default {
  type: "document",
  name: "readMoreCard",
  title: "Read More Card",
  icon: SplitHorizontalIcon,
  fields: [
    {
      name: "heading",
      type: "localeString",
      title: "Heading (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "description",
      type: "localePortableText",
      title: "Description (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "backgroundImage",
      type: "image",
      title: "Background image (*)",
      validation: Rule => Rule.error("Information required.").required(),
      options: {
        hotspot: true
      }
    },
    {
      name: "button",
      type: "localeCta",
      title: "Main button (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "backgroundColor",
      type: "string",
      title: "Background Color",
      description:
        "Use this optional field to input the background color in the same pattern as the color '#FFFFFF'. The default color is '#E8E8EAAD'."
    },
    {
      name: "isInvertedLayout",
      type: "boolean",
      title: "Invert layout?",
      description:
        "Enable this option to invert the content and show the image on the right side",
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: `heading.${baseLanguage.id}`
    },
    prepare({ title }) {
      return {
        title,
        subtitle: "Read More Card section"
      };
    }
  }
};
