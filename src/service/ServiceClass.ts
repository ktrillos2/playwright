import { getServerAuthSession } from "@/config";
import axios, { AxiosHeaders } from "axios";
import { getSession } from "next-auth/react";

interface GetRequest {
  URL: string;
  path: string;
  params?: any;
  headers?: any;
  hasToken?: boolean;
}

interface PostRequest {
  URL: string;
  path: string;
  body?: any;
  params?: any;
  headers?: any;
  hasToken?: boolean;
}

interface PutRequest {
  URL: string;
  path: string;
  body?: any;
  params?: any;
  headers?: any;
  hasToken?: boolean;
}

class ServiceClass {

  private async setToken(headers: any) {
    
try {
  const session = await getServerAuthSession()
  if (session?.accessToken) headers["x-token"] = session.accessToken;
} catch (error) {
  
}

  }

  protected async getQuery<T>({
    URL,
    path,
    params,
    headers = {},
    hasToken = false
  }: GetRequest): Promise<T> {
    if (hasToken) await this.setToken(headers);
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
    headers = {},
    hasToken = false
  }: PostRequest): Promise<T> {
    if (hasToken) await this.setToken(headers);

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
    headers = {},
    hasToken = false
  }: PutRequest): Promise<T> {
    if (hasToken) await this.setToken(headers);

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
