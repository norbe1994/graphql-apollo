import 'cross-fetch/polyfill'
import ApolloClient from 'apollo-boost'
import 'dotenv/config'
import * as QUERIES from './graphql/queries'

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    })
  },
})

const userCredentials = { firstname: 'Robin' }
const userDetails = { nationality: 'German' }

const user = {
  ...userCredentials,
  ...userDetails,
}

client
  .query({
    query: QUERIES.GET_REPOSITORIES_OF_ORGANIZATION,
    variables: {
      organization: 'the-road-to-learn-react',
      cursor: undefined,
    },
  })
  .then(result => {
    const { pageInfo, edges } = result.data.organization.repositories
    const { endCursor, hasNextPage } = pageInfo

    result.data.organization.repositories.edges.forEach(repository => {
      console.log(repository)
    })

    return pageInfo
  })
  .then(({ endCursor, hasNextPage }) => {
    if (!hasNextPage) throw Error('no next page')

    return client.query({
      query: QUERIES.GET_REPOSITORIES_OF_ORGANIZATION,
      variables: {
        organization: 'the-road-to-learn-react',
        cursor: endCursor,
      },
    })
  })
  .then(result => {
    const { pageInfo, edges } = result.data.organization.repositories
    const { endCursor, hasNextPage } = pageInfo

    result.data.organization.repositories.edges.forEach(repository => {
      console.log(repository)
    })

    return pageInfo
  })
  .catch(error => {
    console.log(error)
  })

client
  .mutate({
    mutation: QUERIES.ADD_STAR,
    variables: {
      repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
    },
  })
  .then(result => {
    console.log(result.data.addStar.starrable, 'HEREEEE')
  })
