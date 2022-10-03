import Orders from './collections'
import { getCurrentDate } from "../../utils/formatDate";
import { PubSub, withFilter } from "graphql-subscriptions";
import { ADMIN, ORDER_ADDED } from "../../utils/constants";
import { getUser } from "meteor/apollo";

const pubSub = new PubSub()

const queries = {
  async orders(_, args, context, info) {
    try {
      return await Orders.find({ orderDate: { "$gte": new Date() } }).fetch();
    } catch (e) {
      throw `orders query Error: ${e}`
    }
  }
}

const mutations = {
  async addOrder(_, { orderPriceSum, orderCount, orderItems }, { user }, info) {
    const newDate = getCurrentDate()

    let orderValues = {
      orderDate: newDate,
      orderPriceSum: orderPriceSum,
      orderCount: orderCount,
      orderItems: orderItems,
      orderState: false
    }

    try {
      const result = await Orders.insert(orderValues);

      orderValues._id = result
      await pubSub.publish(ORDER_ADDED, { orderAdded: orderValues })

      return result
    } catch (e) {
      throw `Order Add Error: ${e}`;
    }
  },
  async checkOrder(_, { _id, orderState }, { user }, info) {
    const changeOrderState = {
      orderState: !orderState
    }

    try {
      await Orders.update(
        { _id: _id },
        { $set: changeOrderState }
      )
    } catch (e) {
      throw `CheckOrder Update Error: ${e}`
    }

    return _id
  }
}

const subscriptions = {
  orderAdded: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(ORDER_ADDED),
      async (payload, variables) => {
        const getUserRole = await getUser(variables.authToken);
        const checkRole = getUserRole.profile.role === ADMIN;
        return checkRole
      }
    )
  }
}

const resolvers = {
  Query: queries,
  Mutation: mutations,
  Subscription: subscriptions
}

export default resolvers