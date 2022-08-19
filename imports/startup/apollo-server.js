import {ApolloServer} from 'apollo-server-express';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import {WebApp} from 'meteor/webapp'

import resolverItem from '/imports/api/item/resolvers'
import typeDefsItem from '/imports/api/item/schemas'
import resolverOrder from '/imports/api/order/resolvers'
import typeDefsOrder from '/imports/api/order/schemas'

(async () => {
  const typeDefs = [typeDefsItem, typeDefsOrder];
  const resolvers = [resolverItem, resolverOrder];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  const server = new ApolloServer({
    playground: true,
    schema,
    context: '', // get client access data
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  })

  await server.start()

  /**
   * 시작된 서버가 IP 주소로 접근 할 수 있도록 applyMiddleware 설정
   */
  server.applyMiddleware({
    app: WebApp.connectHandlers,
    cors: true,
    path: '/graphql'
  })
})()