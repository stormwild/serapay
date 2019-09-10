
import axios, { AxiosRequestConfig } from 'axios';
import { stringify } from 'querystring';

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

export interface IConfigCache {
  cashIn: ICashIn | null;
  cashOutNatual: ICashOutNatural | null;
  cashOutJuridical: ICashOutJuridical | null;
}

class Config {
  private readonly configCache: IConfigCache = {
    cashIn: null,
    cashOutJuridical: null,
    cashOutNatual: null,
  };

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
    if (!this.configCache.cashIn) {
      const { data } = await axios.get(url);
      this.configCache.cashIn = data;
    }
    return (this.configCache.cashIn as ICashIn);
  }

  public async cashOutNatural(url: string = 'config/cash-out/natural'): Promise<ICashOutNatural> {
    if (!this.configCache.cashOutNatual) {
      const { data } = await axios.get(url);
      this.configCache.cashOutNatual = data;
    }
    return this.configCache.cashOutNatual as ICashOutNatural;
  }

  public async cashOutJuridical(url: string = 'config/cash-out/juridical')
    : Promise<ICashOutJuridical> {
    if (!this.configCache.cashOutJuridical) {
      const { data } = await axios.get(url);
      this.configCache.cashOutJuridical = data;
    }
    return this.configCache.cashOutJuridical as ICashOutJuridical;
  }
}

export default Config;
