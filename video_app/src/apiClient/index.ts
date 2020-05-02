import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'types/responses/axios';
import {csrfToken} from 'rails-ujs'


export class ApiClient {
    axiosInstance: AxiosInstance;
    constructor(baseURL = '') {
        this.axiosInstance = axios.create({ baseURL });
        // this.axiosInstance.defaults.headers.common['X-CSRF-Token'] = csrfToken();
        this.axiosInstance.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        this.axiosInstance.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        this.axiosInstance.defaults.withCredentials = true;

        console.log("hey")
        console.log(csrfToken());

        this.axiosInstance.interceptors.request.use(
            async (config: AxiosRequestConfig) => {
                return config;
            },
            (err: AxiosError) => {
                return Promise.reject(err);
            },
        );
    }
    async get<T = object>(path: string, params: object = {}): Promise<AxiosResponse<T>> {
        try {
            const result = await this.axiosInstance.get(path, { params });
            return this.createSuccessPromise<T>(result.data);
        } catch (e) {
            return this.createFailurePromise<T>(e);
        }
    }
    async post<T = object>(path: string, params: object = {}): Promise<AxiosResponse<T>> {
        try {
            const result = await this.axiosInstance.post<T>(path, params);
            return this.createSuccessPromise<T>(result.data);
        } catch (e) {
            return this.createFailurePromise<T>(e);
        }
    }
    async put<T = object>(path: string, params: object = {}): Promise<AxiosResponse<T>> {
        try {
            const result = await this.axiosInstance.put<T>(path, params);
            return this.createSuccessPromise<T>(result.data);
        } catch (e) {
            return this.createFailurePromise<T>(e);
        }
    }
    async delete<T = object>(path: string): Promise<AxiosResponse<T>> {
        try {
            const result = await this.axiosInstance.delete(path);
            return this.createSuccessPromise<T>(result.data);
        } catch (e) {
            return this.createFailurePromise<T>(e);
        }
    }
    async patch<T = object>(path: string, params: object = {}): Promise<AxiosResponse<T>> {
        try {
            const result = await this.axiosInstance.patch<T>(path, params);
            return this.createSuccessPromise<T>(result.data);
        } catch (e) {
            return this.createFailurePromise<T>(e);
        }
    }
    private createSuccessPromise<T>(data: T): Promise<AxiosResponse<T>> {
        return Promise.resolve<AxiosResponse<T>>({ data, isSuccess: true });
    }
    private createFailurePromise<T>(error: AxiosError): Promise<AxiosResponse<T>> {
        return Promise.resolve<AxiosResponse<T>>({ error, isSuccess: false });
    }
}
