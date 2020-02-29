import * as azure from 'azure-devops-node-api';
import { IGitApi } from 'azure-devops-node-api/GitApi';
import { ICoreApi } from 'azure-devops-node-api/CoreApi';
import { IPolicyApi } from 'azure-devops-node-api/PolicyApi';
import {
  getPersonalAccessTokenHandler,
  getBearerHandler,
  getBasicHandler,
} from 'azure-devops-node-api';
import { IRequestHandler } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces';
import * as hostRules from '../../util/host-rules';
import { PLATFORM_TYPE_AZURE } from '../../constants/platforms';
import { HostRule } from '../../util/host-rules';
import { logger } from '../../logger';

const hostType = PLATFORM_TYPE_AZURE;
let endpoint: string;

function getAuthenticationHandler(config: HostRule): IRequestHandler {
  switch (config.authenticationType) {
    case 'bearerToken':
      return getBearerHandler(config.token);
    case 'basic':
      return getBasicHandler(config.username, config.password);
    case 'personalAccessToken':
      return getPersonalAccessTokenHandler(config.token);
    default:
      if (config.authenticationType) {
        logger.warn(
          `Unrecognized authentication type '${config.authenticationType}'. Using default authentication type 'personal access token'`
        );
      } else {
        logger.debug(
          "Using default authentication type 'personal access token'"
        );
      }
      return getPersonalAccessTokenHandler(config.token);
  }
}

export function azureObj(): azure.WebApi {
  const config = hostRules.find({ hostType, url: endpoint });
  const authHandler = getAuthenticationHandler(config);
  return new azure.WebApi(endpoint, authHandler);
}

export function gitApi(): Promise<IGitApi> {
  return azureObj().getGitApi();
}

export function coreApi(): Promise<ICoreApi> {
  return azureObj().getCoreApi();
}

export function policyApi(): Promise<IPolicyApi> {
  return azureObj().getPolicyApi();
}

export function setEndpoint(e: string): void {
  endpoint = e;
}
