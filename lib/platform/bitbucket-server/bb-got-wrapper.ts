import URL from 'url';
import { GotJSONOptions } from 'got';
import got from '../../util/got';
import { GotApi, GotApiOptions, GotResponse } from '../common';
import { PLATFORM_TYPE_BITBUCKET_SERVER } from '../../constants/platforms';

let baseUrl: string;

function get(
  path: string,
  options: GotApiOptions & GotJSONOptions
): Promise<GotResponse> {
  const url = URL.resolve(baseUrl, path);
  const opts: GotApiOptions & GotJSONOptions = {
    hostType: PLATFORM_TYPE_BITBUCKET_SERVER,
    json: true,
    ...options,
  };
  opts.headers = {
    ...opts.headers,
    'X-Atlassian-Token': 'no-check',
  };
  return got(url, opts);
}

const helpers = ['get', 'post', 'put', 'patch', 'head', 'delete'];

export const api: GotApi = {} as any;

for (const x of helpers) {
  (api as any)[x] = (url: string, opts: any): Promise<GotResponse> =>
    get(url, { ...opts, method: x.toUpperCase() });
}

// eslint-disable-next-line @typescript-eslint/unbound-method
api.setBaseUrl = (e: string): void => {
  baseUrl = e;
};

export default api;
