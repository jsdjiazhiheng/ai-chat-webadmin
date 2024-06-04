import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ChatVO, ChatForm, ChatQuery } from '@/api/gpt/chat/types';

/**
 * 查询对话列表
 * @param query
 * @returns {*}
 */

export const listChat = (query?: ChatQuery): AxiosPromise<ChatVO[]> => {
  return request({
    url: '/gpt/chat/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询对话详细
 * @param id
 */
export const getChat = (id: string | number): AxiosPromise<ChatVO> => {
  return request({
    url: '/gpt/chat/' + id,
    method: 'get'
  });
};

/**
 * 新增对话
 * @param data
 */
export const addChat = (data: ChatForm) => {
  return request({
    url: '/gpt/chat',
    method: 'post',
    data: data
  });
};

/**
 * 修改对话
 * @param data
 */
export const updateChat = (data: ChatForm) => {
  return request({
    url: '/gpt/chat',
    method: 'put',
    data: data
  });
};

/**
 * 删除对话
 * @param id
 */
export const delChat = (id: string | number | Array<string | number>) => {
  return request({
    url: '/gpt/chat/' + id,
    method: 'delete'
  });
};
