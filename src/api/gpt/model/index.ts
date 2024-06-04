import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ModelVO, ModelForm, ModelQuery } from '@/api/gpt/model/types';

/**
 * 查询模型信息列表
 * @param query
 * @returns {*}
 */

export const listModel = (query?: ModelQuery): AxiosPromise<ModelVO[]> => {
  return request({
    url: '/gpt/model/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询模型信息详细
 * @param id
 */
export const getModel = (id: string | number): AxiosPromise<ModelVO> => {
  return request({
    url: '/gpt/model/' + id,
    method: 'get'
  });
};

/**
 * 新增模型信息
 * @param data
 */
export const addModel = (data: ModelForm) => {
  return request({
    url: '/gpt/model',
    method: 'post',
    data: data
  });
};

/**
 * 修改模型信息
 * @param data
 */
export const updateModel = (data: ModelForm) => {
  return request({
    url: '/gpt/model',
    method: 'put',
    data: data
  });
};

/**
 * 删除模型信息
 * @param id
 */
export const delModel = (id: string | number | Array<string | number>) => {
  return request({
    url: '/gpt/model/' + id,
    method: 'delete'
  });
};

/**
 * 查询模型信息列表
 * @returns {*}
 */

export const getModelList = (): AxiosPromise<ModelVO[]> => {
  return request({
    url: '/gpt/model/getModelList',
    method: 'get'
  });
};
