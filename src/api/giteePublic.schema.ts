import {Platform} from 'react-native/types';
import Ajv, {JTDSchemaType} from 'ajv/dist/jtd';

const ajv = new Ajv();

export interface UpdateLinkItem {
  updateLink: string;
  platform: typeof Platform.OS;
}

export interface VersionItem {
  platform: (typeof Platform.OS)[];
  updateLink?: string;
  updateLinks?: UpdateLinkItem[];
  versionName: string;
  versionCode: number;
  desc: string;
}

const SchemaVersionList: JTDSchemaType<VersionItem[]> = {
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
      updateLinks: {
        elements: {
          properties: {
            updateLink: {
              type: 'string',
            },
            platform: {
              enum: ['android', 'ios'],
            },
          },
        },
      },
    },
  },
};
export const giteePublic = {
  validateVersion: ajv.compile(SchemaVersionList),
};
