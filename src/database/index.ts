import Realm from 'realm';
import {ColorSchema} from './color.schema';

export function createRealm() {
  return new Realm({
    schema: [ColorSchema],
    schemaVersion: 1,
  });
}
