import I, { Set, isImmutable } from 'immutable'
import { HttpState } from '~/consts'

export const VIEW_SET = 'VIEW_SET'
export const VIEW_SET_IN = 'VIEW_SET_IN'
export const VIEW_MERGE_IN = 'VIEW_MERGE_IN'

const initialState = I.fromJS({
  loginDialogOpen: false,
  signupDialogOpen: false,
  login: {
    authorized: HttpState.UNKNOWN
  },
  avatars: {},
  tables: {}
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
export const viewMergeIn = (path, value) => ({ type: VIEW_MERGE_IN, path, value })
export const authorizedPath = ['login', 'authorized']
export const setAuthorized = value => D => D(viewSetIn(authorizedPath, value))
export const authorized = view => view.getIn(authorizedPath)
