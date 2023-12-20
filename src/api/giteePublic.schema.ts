import {Platform} from 'react-native/types';
import Ajv, {JTDSchemaType} from 'ajv/dist/jtd';

const ajv = new Ajv();

export interface VersionItem {
  platform: (typeof Platform.OS)[];
  updateLink?: string;
  versionName: string;
  versionCode: number;
  desc: string;
}

const Schema: JTDSchemaType<VersionItem[]> = {
  elements: {
    properties: {
      platform: {
        elements: {
          enum: ['android', 'ios'],
        },
      },
      versionName: {
        type: 'string',
      },
      versionCode: {
        type: 'int32',
      },
      desc: {
        type: 'string',
      },
    },
    optionalProperties: {
      updateLink: {
        type: 'string',
      },
    },
  },
};
export const giteePublic = {
  validateVersion: ajv.compile(Schema),
};
