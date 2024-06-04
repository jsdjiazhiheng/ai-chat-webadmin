import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AssistantVO, AssistantForm, AssistantQuery } from '@/api/gpt/assistant/types';

/**
 * 查询AI助手列表
 * @param query
 * @returns {*}
 */

export const listAssistant = (query?: AssistantQuery): AxiosPromise<AssistantVO[]> => {
  return request({
    url: '/gpt/assistant/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询AI助手详细
 * @param id
 */
export const getAssistant = (id: string | number): AxiosPromise<AssistantVO> => {
  return request({
    url: '/gpt/assistant/' + id,
    method: 'get'
  });
};

/**
 * 新增AI助手
 * @param data
 */
export const addAssistant = (data: AssistantForm) => {
  return request({
    url: '/gpt/assistant',
    method: 'post',
    data: data
  });
};

/**
 * 修改AI助手
 * @param data
 */
export const updateAssistant = (data: AssistantForm) => {
  return request({
    url: '/gpt/assistant',
    method: 'put',
    data: data
  });
};

/**
 * 删除AI助手
 * @param id
 */
export const delAssistant = (id: string | number | Array<string | number>) => {
  return request({
    url: '/gpt/assistant/' + id,
    method: 'delete'
  });
};
