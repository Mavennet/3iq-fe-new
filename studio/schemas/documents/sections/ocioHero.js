import supportedLanguages from "../../supportedLanguages";
import { SplitHorizontalIcon } from "@sanity/icons";

const baseLanguage = supportedLanguages.find(l => l.isDefault);

export default {
  type: "document",
  name: "ocioHero",
  title: "Ocio Hero",
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
      title: "Description"
    },
    {
      name: "fontColor",
      type: "string",
      title: "Font color",
      description: "Default: #FFF (White)",
      options: {
        list: [
          { title: "Blue", value: "#0082E5" },
          { title: "Dark Blue", value: "#091B3F" },
          { title: "Black", value: "#28373C" },
          { title: "Green", value: "#008C86" },
          { title: "Orange", value: "#F59B1E" },
          { title: "White", value: "#FFFFFF" },
          { title: "Grey", value: "##ebebeb" }
        ],
        layout: "radio"
      }
    },
    {
      name: "backgroundImage",
      type: "image",
      title: "Background image",
      options: {
        hotspot: true
      }
    },
    {
      name: "backgroundColor",
      type: "string",
      title: "Background color",
      description: "Default: #091b3f (Blue)",
      options: {
        list: [
          { title: "Blue", value: "#0082E5" },
          { title: "Dark Blue", value: "#091B3F" },
          { title: "Green", value: "#008C86" },
          { title: "Orange", value: "#F59B1E" },
          { title: "White", value: "#FFFFFF" },
          { title: "Grey", value: "##ebebeb" }
        ],
        layout: "radio"
      }
    },
    {
      name: "buttonOne",
      type: "localeCta",
      title: "Optional button One"
    },
    {
      name: "buttonTwo",
      type: "localeCta",
      title: "Optional button Two"
    },
    {
      name: "body",
      type: "localePortableText"
    },
    {
      name: "imagesContainers",
      type: "array",
      title: "Image Containers",
      of: [
        {
          type: "reference",
          to: [{ type: "imagesContainer" }],
          title: "Images Container"
        }
      ]
    },
    {
      name: "footerText",
      type: "localePortableText",
      title: "Footer text"
    }
  ],
  preview: {
    select: {
      title: `heading.${baseLanguage.id}`,
      media: "backgroundImage"
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: "Ocio Hero section",
        media
      };
    }
  }
};
