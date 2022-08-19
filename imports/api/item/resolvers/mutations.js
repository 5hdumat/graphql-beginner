import {Categories, Items} from '../collections';
import {getCurrentDate} from "../../../utils/formatDate";

const mutations = {
  async addCategory(_, {categoryName}) {
    const categoryValue = {
      categoryName: categoryName
    }

    try {
      return await Categories.insert(categoryValue)
    } catch (e) {
      throw `Category Add Error: ${e}`
    }
  },
  async updateCategory(_, {_id, categoryName}) {
    const categoryValue = {
      categoryName: categoryName
    }

    try {
      return await Categories.update({_id: _id}, {$set: categoryValue})
    } catch (e) {
      throw `Category Update Error: ${e}`
    }
  },
  async deleteCategory(_, {_id}) {
    try {
      return await Categories.remove(_id);
    } catch (e) {
      throw `Category Delete Error: ${e}`
    }
  },
  async addItem(_, {itemName, itemPrice, itemImage, itemCategoryId}) {
    const newDate = getCurrentDate()

    const itemValue = {
      itemName: itemName,
      itemPrice: itemPrice,
      itemImage: itemImage,
      createdAt: newDate,
      itemCategoryId: itemCategoryId
    }

    try {
      let result = await Items.insert(itemValue);
      itemValue._id = result

      return itemValue
    } catch (e) {
      throw `Add Item Error ${e}`
    }
  },
  async updateItem(_, {_id, itemName, itemPrice, itemImage, itemCategoryId}) {
    const itemValue = {
      itemName: itemName,
      itemPrice: itemPrice,
      itemImage: itemImage,
      itemCategoryId: itemCategoryId
    }

    try {
      await Items.update({_id: _id}, {$set: itemValue});
      itemValue._id = _id

      return itemValue
    } catch (e) {
      throw `update Item Error ${e}`
    }
  },
  async deleteItem(_, {_id}) {
    try {
      await Items.remove(_id);
      return _id
    } catch (e) {
      throw `delete Item Error ${e}`
    }
  }
}


export default mutations