export interface ChatMessageVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 模型
   */
  model: string;

  /**
   * 模型版本
   */
  modelVersion: string;

  /**
   * 角色
   */
  role: string;

  /**
   * 文本内容
   */
  content: string;

  /**
   * 图片内容
   */
  images: string;

  /**
   * 内容类型：text：文字 image : 图片
   */
  contentType: string;

  /**
   * 结束原因
   */
  finishReason: string;

  /**
   * 状态
   */
  status: number;

  /**
   * 使用token
   */
  totalTokens: number;

}

export interface ChatMessageForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 对话ID
   */
  chatId?: string | number;

}

export interface ChatMessageQuery extends PageQuery {

  /**
   * 对话ID
   */
  chatId?: string | number;

  /**
   * 消息ID
   */
  messageId?: string | number;

  /**
   * 回复消息ID
   */
  parentMessageId?: string | number;

  /**
   * 模型
   */
  model?: string;

  /**
   * 角色
   */
  role?: string;

  /**
   * 文本内容
   */
  content?: string;

  /**
   * 内容类型：text：文字 image : 图片
   */
  contentType?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



