type Include<T, U> = T extends U ? T : never;
type JSONConstraint = Record<string, any>;
type ExtractValues<T, V> = {
  [Key in keyof T as T[Key] extends V ? Key : never]: T[Key];
};

type ErrorItem<T> = {[K in keyof T]?: string};

declare module 'react-native-vector-icons/Ionicons';
declare module 'utf8-byte-length';
