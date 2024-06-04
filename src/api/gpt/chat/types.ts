export interface ChatVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 标题
   */
  title: string;

  /**
   * 内容类型：text：文字 image : 图片
   */
  contentType: string;

}

export interface ChatForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 标题
   */
  title?: string;

  /**
   * 内容类型：text：文字 image : 图片
   */
  contentType?: string;

}

export interface ChatQuery extends PageQuery {

  /**
   * 标题
   */
  title?: string;

  /**
   * 内容类型：text：文字 image : 图片
   */
  contentType?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



