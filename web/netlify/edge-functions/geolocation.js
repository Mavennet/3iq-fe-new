export default async (request, context) => {
  const translations = {
    UNKNOWN: "ae",
    US: "us",
    AE: "ae",
  };

  const countryCode = context.geo?.country?.code;
  const translation = translations[countryCode] || translations["UNKNOWN"];
  const countryNameURL = "/" + translation + "/home";

  return context.rewrite(countryNameURL);
};
export const config = { path: "/" }
