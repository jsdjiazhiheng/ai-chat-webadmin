export interface SearchEngineVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 名称
   */
  name: string;

  /**
   * 值
   */
  value: string;

  /**
   * 是否使用
   */
  used: number;
}

export interface SearchEngineForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 值
   */
  value?: string;

  /**
   * 是否使用
   */
  used?: number;
}

export interface SearchEngineQuery extends PageQuery {
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
