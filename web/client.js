import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: "f4hjjbpz",
  dataset: "production",
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2022-01-31',
})

export default client
