import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/menu/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getMenuList = (current, size, params) => {
  return request({
    url: '/api/blade-system/menu/menu-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/menu/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/menu/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/menu/submit',
    method: 'post',
    data: row
  })
}

export const getMenu = (id) => {
  return request({
    url: '/api/blade-system/menu/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getTopMenu = () => request({
  url: '/api/blade-system/menu/top-menu',
  method: 'get'
});

export const getRoutes = (topMenuId) => request({
  url: '/api/blade-system/menu/routes',
  method: 'get',
  params: {
    topMenuId,
  }
});
