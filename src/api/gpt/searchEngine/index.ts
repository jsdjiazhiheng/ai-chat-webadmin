import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SearchEngineVO, SearchEngineForm, SearchEngineQuery } from '@/api/gpt/searchEngine/types';

/**
 * 查询搜索引擎列表
 * @param query
 * @returns {*}
 */

export const listSearchEngine = (query?: SearchEngineQuery): AxiosPromise<SearchEngineVO[]> => {
  return request({
    url: '/gpt/search/engine/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询搜索引擎详细
 * @param id
 */
export const getSearchEngine = (id: string | number): AxiosPromise<SearchEngineVO> => {
  return request({
    url: '/gpt/search/engine/' + id,
    method: 'get'
  });
};

/**
 * 新增搜索引擎
 * @param data
 */
export const addSearchEngine = (data: SearchEngineForm) => {
  return request({
    url: '/gpt/search/engine',
    method: 'post',
    data: data
  });
};

/**
 * 修改搜索引擎
 * @param data
 */
export const updateSearchEngine = (data: SearchEngineForm) => {
  return request({
    url: '/gpt/search/engine',
    method: 'put',
    data: data
  });
};

/**
 * 删除搜索引擎
 * @param id
 */
export const delSearchEngine = (id: string | number | Array<string | number>) => {
  return request({
    url: '/gpt/search/engine/' + id,
    method: 'delete'
  });
};
