import axios, { AxiosError } from "axios";

export class AxiosAdapter {
  static createAxiosAdapter = (baseURL: string) => {
    return axios.create({ baseURL: baseURL });
  };
}
