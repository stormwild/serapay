
import axios, { AxiosRequestConfig } from 'axios';

export interface IMoney {
  amount: number;
  currency: string;
}

export interface ICashIn {
  percents: number;
  max: IMoney;
}

export interface ICashOutNatural {
  percents: number;
  week_limit: IMoney;
}

export interface ICashOutJuridical {
  percents: number;
  min: IMoney;
}

class Config {
  constructor(config: AxiosRequestConfig = {
    baseURL: 'http://private-38e18c-uzduotis.apiary-mock.com/',
    headers: {
      get: {
        Accept: 'application/json',
      },
    },
  }) {
    config.baseURL = config.baseURL || 'http://private-38e18c-uzduotis.apiary-mock.com/';
    config.headers.get.Accept = config.headers.get.Accept || 'application/json';
    axios.defaults = config;

    axios.interceptors.request.use(
      // tslint:disable-next-line: no-parameter-reassignment
      req => req = Object.assign(req, axios.defaults),
      error => Promise.reject(error));
  }

  public get config() {
    return axios.defaults;
  }

  public async cashIn(url: string = 'config/cash-in'): Promise<ICashIn> {
    const { data } = await axios.get(url);
    return data as ICashIn;
  }

  public async cashOutNatural(url: string = 'config/cash-out/natural'): Promise<ICashOutNatural> {
    const { data } = await axios.get(url);
    return data as ICashOutNatural;
  }

  public async cashOutJuridical(url: string = 'config/cash-out/juridical')
    : Promise<ICashOutJuridical> {
    const { data } = await axios.get(url);
    return data as ICashOutJuridical;
  }
}

export default Config;
