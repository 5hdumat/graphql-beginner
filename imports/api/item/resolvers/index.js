import mutations from "./mutations";
import queries from "./queries";

/**
 * mutation, query 가 분리되어 있을 경우 하나로 모아서 내보내줘야 한다.
 * @type {{Query: {item(*, *, *, *): Promise<*|undefined>, categories(*, *, *, *): Promise<*|undefined>, items(*, *, *, *): Promise<*|undefined>, itemsPageCount(*, *, *, *): Promise<number|undefined>}, Mutation: {addItem(*, {itemName?: *, itemPrice?: *, itemImage?: *, itemCategoryId?: *}): Promise<{createdAt: Date, itemName, itemPrice, itemCategoryId, itemImage}|undefined>, uploadFile(*, {}): Promise<*>, deleteItem(*, {_id?: *}): Promise<*|undefined>, updateCategory(*, {_id: *, categoryName?: *}): Promise<*|undefined>, updateItem(*, {_id?: *, itemName?: *, itemPrice?: *, itemImage?: *, itemCategoryId?: *}): Promise<{itemName, itemPrice, itemCategoryId, itemImage}|undefined>, deleteCategory(*, {_id?: *}): Promise<*|undefined>, addCategory(*, {categoryName?: *}): Promise<*|undefined>}}}
 */
const resolvers = {
  Query: queries,
  Mutation: mutations
}

export default resolvers