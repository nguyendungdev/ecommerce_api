export enum OrdersMessage {
  NOT_FOUND_BY_USER_ID = 'User has no orders',
  NOT_FOUND_BY_ID = 'No order found',
  NOT_FOUND_BY_ORDER_ID = 'No order item found',
}

export enum OrdersSummary {
  CREATE_NEW = 'Create new order',
  UPDATE_BY_ID = 'Update Order by ID.',
  GET_ALL = 'Get all Orders.',
  DELETE_BY_ID = 'Delete Order by ID.',
  UPDATE_STATUS_BY_ID = "Update order's status by ID.",
  RESTORE_BY_ID = 'Restore order by ID.',
}

export enum OrdersDescription {}
