import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { WebApp } from 'meteor/webapp'

import resolverItem from '/imports/api/item/resolvers'
import typeDefsItem from '/imports/api/item/schemas'
import resolverOrder from '/imports/api/order/resolvers'
import typeDefsOrder from '/imports/api/order/schemas'
import typeDefsAuth from '/imports/api/auth/resolvers'
import resolversAuth from '/imports/api/auth/schemas'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql/execution';
import { getUser } from "meteor/apollo";

(async () => {
  const typeDefs = [typeDefsItem, typeDefsOrder, typeDefsAuth];
  const resolvers = [resolverItem, resolverOrder, resolversAuth];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  // WebSocket
  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: async (connectionParams, websocket, context) => {
      console.log('SubscriptionClient Connect.')
    },
    onDisconnect: async (connectionParams, websocket, context) => {
      console.log('SubscriptionClient DisConnect.')
    }
  }, {
    server: WebApp.httpServer,
    path: '/graphql'
  })

  const server = new ApolloServer({
    playground: true,
    schema,
    context: async ({ req }) => ({ // get client access data
      user: await getUser(req.headers.authorization),
      userToken: req.headers.authorization
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground
      (),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            }
          }
        }
      }
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