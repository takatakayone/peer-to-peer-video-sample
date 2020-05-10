import { ApiClient } from "./index";

const baseURL = '/apis';
const apiClient = new ApiClient(baseURL);

const AUTHENTICATE_PATH = '/authenticate';

export interface PostAuthenticateApiRequestParams {
    peerId: string
    sessionToken: string
}

export class AuthenticatePeerApi {
    static post(params: PostAuthenticateApiRequestParams): Promise<{}> {
        return apiClient.post(AUTHENTICATE_PATH, params);
    }
}
