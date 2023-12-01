type JSONConstraint = Record<string, any>;
/** 提取T中符合条件U的集合 */
type Include<T, U> = T extends U ? T : never;
/** 提取T中value符合条件V的集合 */
type ExtractValues<T, V> = {
  [Key in keyof T as T[Key] extends V ? Key : never]: T[Key];
};
/** 排除T中key符合条件K的集合 */
type ExcludedKey<T, K> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
};

type ErrorItem<T> = {[K in keyof T]?: string};

declare module 'react-native-vector-icons/Ionicons';
declare module 'utf8-byte-length';
