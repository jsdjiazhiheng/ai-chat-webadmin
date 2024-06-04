import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ChatMessageVO, ChatMessageForm, ChatMessageQuery } from '@/api/gpt/chatMessage/types';

/**
 * 查询对话消息列表
 * @param query
 * @returns {*}
 */

export const listChatMessage = (query?: ChatMessageQuery): AxiosPromise<ChatMessageVO[]> => {
  return request({
    url: '/gpt/chat/message/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询对话消息详细
 * @param id
 */
export const getChatMessage = (id: string | number): AxiosPromise<ChatMessageVO> => {
  return request({
    url: '/gpt/chat/message/' + id,
    method: 'get'
  });
};

/**
 * 新增对话消息
 * @param data
 */
export const addChatMessage = (data: ChatMessageForm) => {
  return request({
    url: '/gpt/chat/message',
    method: 'post',
    data: data
  });
};

/**
 * 修改对话消息
 * @param data
 */
export const updateChatMessage = (data: ChatMessageForm) => {
  return request({
    url: '/gpt/chat/message',
    method: 'put',
    data: data
  });
};

/**
 * 删除对话消息
 * @param id
 */
export const delChatMessage = (id: string | number | Array<string | number>) => {
  return request({
    url: '/gpt/chat/message/' + id,
    method: 'delete'
  });
};
