import Orders from './collections'
import {getCurrentDate} from "../../utils/formatDate";

const queries = {
  async orders(_, args, context, info) {
    try {
      return await Orders.find({orderDate: {"$gte": new Date()}}).fetch();
    } catch (e) {
      throw `orders query Error: ${e}`
    }
  }
}

const mutations = {
  async addOrder(_, {orderPriceSum, orderCount, orderItems}, {user}, info) {
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
      return result
    } catch (e) {
      throw `Order Add Error: ${e}`;
    }
  },
  async checkOrder(_, {_id, orderState}, {user}, info) {
    const changeOrderState = {
      orderState: !orderState
    }

    try {
      await Orders.update(
        {_id: _id},
        {$set: changeOrderState}
      )
    } catch (e) {
      throw `CheckOrder Update Error: ${e}`
    }

    return _id
  }
}

const resolvers = {
  Query: queries,
  Mutation: mutations
}

export default resolvers