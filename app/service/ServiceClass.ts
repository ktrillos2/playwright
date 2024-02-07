import axios, { AxiosHeaders } from "axios";

interface GetRequest {
  URL: string;
  path: string;
  params?: any;
  headers?: AxiosHeaders;
}

interface PostRequest {
  URL: string;
  path: string;
  body?: any;
  params?: any;
  headers?: AxiosHeaders;
}

interface PutRequest {
  URL: string;
  path: string;
  body?: any;
  params?: any;
  headers?: AxiosHeaders;
}

class ServiceClass {
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
}

export default ServiceClass;
