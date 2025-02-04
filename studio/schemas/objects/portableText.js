export default {
  title: "Portable Text",
  name: "portableText",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" }
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" }
        ],
        annotations: [
          {
            title: "URL",
            type: "object",
            name: "link",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
                validation: Rule =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"]
                  })
              },
              {
                title: "Open in new window",
                type: "boolean",
                name: "blank",
                initialValue: false
              }
            ]
          },
          { name: "color", title: "Color", type: "color" }
          // { type: 'internalLink' }
        ]
      }
    },
    { type: "figure" },
    { type: "youtube" },
    { type: "embedHTML" }
  ]
};
