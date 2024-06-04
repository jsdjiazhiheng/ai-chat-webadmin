export interface ModelVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 名称
   */
  name: string;

  /**
   * 图标
   */
  icon: string | number;

  /**
   * 模型值
   */
  value: string;

  /**
   * 模型Url
   */
  url: string;
}

export interface ModelForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 图标
   */
  icon?: string | number;

  /**
   * 模型值
   */
  value?: string;

  /**
   * OssId
   */
  ossId?: string;
}

export interface ModelQuery extends PageQuery {
  /**
   * 名称
   */
  name?: string;

  /**
   * 部门ID
   */
  deptId?: string | number;

  /**
   * 用户Id
   */
  userId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}
