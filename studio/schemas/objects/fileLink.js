import React from "react";

const LinkRender = ({ children }) => <span>{children} 🌍</span>;

export default {
  title: "File URL",
  name: "fileURL",
  type: "object",
  fields: [
    {
      title: "File URL",
      name: "href",
      type: "url",
      validation: Rule =>
        Rule.uri({
          allowRelative: true
        })
    },
    {
      title: "Open in new window",
      type: "boolean",
      name: "blank",
      initialValue: false
    }
  ],
  blockEditor: {
    icon: () => "🌍",
    render: LinkRender
  }
};
