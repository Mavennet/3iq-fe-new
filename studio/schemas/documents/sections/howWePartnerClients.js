import { BlockquoteIcon } from "@sanity/icons";
import supportedLanguages from "../../supportedLanguages";
const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: "document",
  name: "howWePartnerClients",
  title: "How We Partner Clients",
  icon: BlockquoteIcon,
  fields: [
    {
      name: "heading",
      type: "localePortableText",
      title: "Heading (*)",
      validation: Rule => Rule.error("Information required.").required()
    },
    {
      name: "hideHeading",
      type: "boolean",
      title: "Hide Heading Image?",
      description: "Enable this option to hide the title in side image.",
      initialValue: false
    },
    {
      name: "post",
      type: "reference",
      title: "Post",
      description:
        "Select the post that this card should refer to. It is a good practice to keep only 1 News Card per Post, since it will avoid duplicates being displayed when enabling the News Cards Paginated Layout on a Tab Item",
      to: [
        {
          type: "postV2"
        }
      ]
    },
    {
      name: "backgroundImage",
      type: "image",
      title: "Background image",
      validation: Rule => Rule.error("Information required.").required(),
      options: {
        hotspot: true
      }
    },
    {
      name: "greenLayout",
      type: "boolean",
      title: "Is green layout?",
      description: "Enable this option to change color to green",
      initialValue: false
    },
    {
      name: "shortDescription",
      type: "localePortableText",
      title: "Short description",
      description:
        "Optional overview about the selected post for the normal-sized News Card"
    },
    {
      name: "buttonText",
      type: "localeString",
      title: "Button text"
    },
    {
      name: 'emailUrl',
      type: 'link',
      title: 'Contact Us URL',
    },
  ],
  preview: {
    select: {
      title: `heading.${baseLanguage.id}`,
      media: "backgroundImage"
    },
    prepare({ title, media }) {
      return {
        title,
        media,
        subtitle: "How We Partner Clients section"
      };
    }
  }
};