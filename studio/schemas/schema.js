// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';

// Document types
import page from './documents/page';
import route from './documents/route';
import siteConfig from './documents/siteConfig';
import category from './documents/category';
import person from './documents/person';
import post from './documents/post';
import country from './documents/country';
import language from './documents/language';
import sectionHeroWithImage from './documents/sectionHeroWithImage';
import sectionHero from './documents/sectionHero';

// Object types
import cta from './objects/cta';
import embedHTML from './objects/embedHTML';
import figure from './objects/figure';
import internalLink from './objects/internalLink';
import link from './objects/link';
import portableText from './objects/portableText';
import simplePortableText from './objects/simplePortableText';
import bioPortableText from './objects/bioPortableText';
import postPortableText from './objects/postPortableText';
import localeString from './objects/localeString'
import localeText from './objects/localeText'

// Landing page sections
import imageSection from './objects/imageSection';
import mailchimp from './objects/mailchimp';
import textSection from './objects/textSection';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  name: 'default',
  // Then proceed to concatenate our our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    cta,
    embedHTML,
    figure,
    imageSection,
    internalLink,
    link,
    mailchimp,
    page,
    portableText,
    route,
    simplePortableText,
    siteConfig,
    textSection,
    bioPortableText,
    postPortableText,
    category,
    person,
    post,
    country,
    language,
    localeString,
    localeText,
    sectionHeroWithImage,
    sectionHero
  ]),
});
