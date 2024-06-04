export interface AssistantVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 助手名称
   */
  name: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 所属模型
   */
  model: string;

  /**
   * 描述
   */
  description: string;

  /**
   * 招呼语
   */
  greet: string;

  /**
   * 系统提示
   */
  systemPrompt: string;

}

export interface AssistantForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 助手名称
   */
  name?: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 所属模型
   */
  model?: string;

  /**
   * 描述
   */
  description?: string;

  /**
   * 招呼语
   */
  greet?: string;

  /**
   * 系统提示
   */
  systemPrompt?: string;

}

export interface AssistantQuery extends PageQuery {

  /**
   * 助手名称
   */
  name?: string;

  /**
   * 所属模型
   */
  model?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



