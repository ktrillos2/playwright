import axios, { AxiosHeaders } from "axios";
import { getSession } from "next-auth/react";

interface GetRequest {
  URL: string;
  path: string;
  params?: any;
  headers?: AxiosHeaders;
  hasToken?: boolean;
}

interface PostRequest {
  URL: string;
  path: string;
  body?: any;
  params?: any;
  headers?: AxiosHeaders;
  hasToken?: boolean;
}

interface PutRequest {
  URL: string;
  path: string;
  body?: any;
  params?: any;
  headers?: AxiosHeaders;
  hasToken?: boolean;
}

class ServiceClass {

  private setToken() {

   const a = getSession()
   
    
  }

  protected async getQuery<T>({
    URL,
    path,
    params,
    headers,
  }: GetRequest): Promise<T> {
    

    return await axios
      .get<T>(`${URL}/${path}`, { headers, params })
      .then((response) => response.data)
      .catch((error) => {
        throw { ...error?.response?.data, status: error?.response?.status };
      });
  }

  protected async postQuery<T>({
    URL,
    path,
    body = {},
    params,
    headers,
  }: PostRequest): Promise<T> {
    return await axios
      .post<T>(`${URL}/${path}`, body, { headers, params })
      .then((response) => response.data)
      .catch((error) => {
        throw { ...error?.response?.data, status: error?.response?.status };
      });
  }

  protected async putQuery<T>({
    URL,
    path,
    body = {},
    params,
    headers,
  }: PutRequest): Promise<T> {
    return await axios
      .put<T>(`${URL}/${path}`, body, { headers, params })
      .then((response) => response.data)
      .catch((error) => {
        throw { ...error?.response?.data, status: error?.response?.status };
      });
  }

  protected async deleteQuery<T>({
    URL,
    path,
    params,
    headers,
  }: PutRequest): Promise<T> {
    return await axios
      .delete<T>(`${URL}/${path}`, { headers, params })
      .then((response) => response.data)
      .catch((error) => {
        throw { ...error?.response?.data, status: error?.response?.status };
      });
  }
}

export default ServiceClass;
