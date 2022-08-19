import {Categories, Items} from '../collections'
import {ALL} from "../../../utils/constants";

const queries = {
  async categories(_, args, context, info) {
    try {
      return await Categories.find();
    } catch (e) {
      throw `categories Errors: ${e}`
    }
  },
  async item(_, args, context, info) {
    const id = args._id;

    try {
      return await Items.findOne(args._id)
    } catch (e) {
      throw `item Errors ${e}`
    }
  },
  async items(_, args, context, info) {
    const limit = 15;
    let skip = 0;
    let pageNumber = 0;

    let setFilters = {}
    let setOptions = {}

    if (args.pageNumber) pageNumber = Number(args.pageNumber)
    if (pageNumber <= 1) skip = 0
    else skip = ((pageNumber - 1) * limit)

    let search = '';
    if (args.search) search = args.search
    if (search) setFilters.itemName = RegExp(search)

    let itemCategoryId = ''
    if (args.itemCategoryId) itemCategoryId = args.itemCategoryId
    if (itemCategoryId === ALL) itemCategoryId = '';
    if (itemCategoryId) setFilters.itemCategoryId = itemCategoryId

    setOptions.limit = limit
    setOptions.skip = skip
    setOptions.sort = {'createdAt': -1}

    try {
      return await Items.find(setFilters, setOptions)
    } catch (e) {
      throw `items Error: ${e}`
    }
  },
  async itemsPageCount(_, args, context, info) {
    let pageSize = 15;
    let search = '';
    let setFilters = {};

    if (args.search) search = args.search
    if (search) setFilters.itemName = RegExp(search)

    let itemCategoryId = ''
    if (args.itemCategoryId) itemCategoryId = args.itemCategoryId
    if (itemCategoryId === ALL) itemCategoryId = '';
    if (itemCategoryId) setFilters.itemCategoryId = itemCategoryId

    try {
      const totalItemCount = await Items.find(setFilters).count()
      const totalPage = Math.ceil(totalItemCount / pageSize)
      return totalPage
    } catch (e) {
      throw `itemPagesCount Error: ${e}`
    }
  }
}

export default queries