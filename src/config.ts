
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

const defaultConfig = {
  baseURL: 'http://private-38e18c-uzduotis.apiary-mock.com',
  headers: {
    get: {
      Accept: 'application/json',
    },
  },
};

class Config {
  constructor(config: AxiosRequestConfig = defaultConfig) {
    config.baseURL = config.baseURL || 'http://private-38e18c-uzduotis.apiary-mock.com';
    config.headers.get.Accept = config.headers.get.Accept || 'application/json';
    axios.defaults = config;
  }

  public async cashIn(
    url: string = 'config/cash-in',
    config?: AxiosRequestConfig,
  ): Promise<ICashIn> {
    return await axios.get(url, config);
  }

  public async cashOutNatural(
    url: string = 'config/cash-out/natural',
    config?: AxiosRequestConfig,
  ): Promise<ICashOutNatural> {
    return await axios.get(url, config);
  }

  public async cashOutJuridical(
    url: string = 'config/cash-out/juridical',
    config?: AxiosRequestConfig,
  ): Promise<ICashOutJuridical> {
    return await axios.get(url, config);
  }
}

export default Config;
