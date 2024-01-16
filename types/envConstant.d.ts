declare namespace NSEnv {
  type ApiServerName<T> = keyof T;

  interface ApiServerItem<T> {
    /** 必须以 `/` 结尾 */
    readonly Domain: string;
    /** 不可以以 `/` 开头和结尾 */
    readonly ServerMap?: Partial<T>;
    readonly ServerEnable?: ApiServerName<T>[];
  }
  interface CEApiServerItem<T> extends ApiServerItem<T> {
    readonly ServerEnable: ApiServerName<T>[];
  }
}
