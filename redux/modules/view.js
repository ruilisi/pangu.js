import I, { Set, isImmutable } from 'immutable'
import moment from 'moment'

export const VIEW_SET = 'VIEW_SET'
export const VIEW_SET_IN = 'VIEW_SET_IN'
export const VIEW_MERGE_IN = 'VIEW_MERGE_IN'

const initialState = I.fromJS({
  signup: {
    type: 'personal',
    settings: {
      country_code: '+86'
    }
  },
  changePassword: {},
  findPassword: {},
  loginDialogOpen: false,
  signupDialogOpen: false,
  payment: {
    months: 12,
    goodId: '',
    pickedNum: 2,
    totalPrice: '',
    coupon: {
      code: ''
    },
    couponChecked: false
  },
  login: {
    mobile: '',
    mobileCountryCode: '+86',
    method: 'password'
  },
  paymentState: {
    month: moment().month(),
    year: moment().year(),
    stashed: [`${moment().year()}-${moment().month()}`]
  },
  articles: {},
  tables: {
    articles: {
      indexType: 'active',
      sort: {
        columnKey: 'created_at',
        order: 'descend'
      }
    },
    payments: {
      sort: {
        columnKey: 'created_at',
        order: 'descend'
      }
    }
  }
}).update('tables', tables =>
  tables.map(table =>
    table.mergeDeep(
      I.fromJS({
        fetching: false,
        filter: null,
        searchText: '',
        checked: Set(),
        allChecked: false
      })
    )
  )
)

export default function(aView = initialState, action) {
  let { value, path } = action
  if (!isImmutable(value)) {
    value = I.fromJS(value)
  }
  let view
  if (!isImmutable(aView)) {
    view = I.fromJS(aView)
  } else {
    view = aView
  }
  if (!Array.isArray(action.path)) {
    path = [path]
  }
  switch (action.type) {
    case VIEW_SET:
      return value
    case VIEW_SET_IN:
      return view.setIn(path, value)
    case VIEW_MERGE_IN:
      return view.mergeIn(path, value)
    default:
      return view
  }
}

export const viewSet = value => ({ type: VIEW_SET, value })
export const viewSetIn = (path, value) => ({ type: VIEW_SET_IN, path, value })
export const setSort = (table, sort) => D => D(viewSetIn(['tables', table, 'sort'], I.fromJS(sort)))
export const mergeIn = (path, value) => ({ type: VIEW_MERGE_IN, path, value })
