import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {ColorItem} from './schema';

export async function dbGetColors(): Promise<Readonly<ColorItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<ColorItem>(SchemaName.Color);

  return res.toJSON() as any;
}
