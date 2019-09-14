import chai from 'chai';
const expect = chai.expect;

import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';

import axios from 'axios';
import sinon, { SinonStub } from 'sinon';

// tslint:disable-next-line: import-name
import Config, { ICashIn } from './config';

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('Config class', () => {
  let config: Config;

  before(() => {
    const defaultConfig = {
      baseURL: 'http://private-38e18c-uzduotis.apiary-mock.com/',
      headers: {
        get: {
          Accept: 'application/json',
        },
      },
    };
    config = new Config(defaultConfig);
  });

  it('getConfig should return IConfig', async () => {
    const cfg = await config.getConfig();
    expect(cfg).to.have.property('cashIn');
    expect(cfg).to.have.property('cashOutNatural');
    expect(cfg).to.have.property('cashOutJuridical');

    expect(cfg.cashIn).to.have.property('percents');
    expect(cfg.cashIn).to.have.property('max');
    expect(cfg.cashIn.max).to.have.property('amount');
    expect(cfg.cashIn.max).to.have.property('currency');

    expect(cfg.cashOutNatural).to.have.property('percents');
    expect(cfg.cashOutNatural).to.have.property('week_limit');
    expect(cfg.cashOutNatural.week_limit).to.have.property('amount');
    expect(cfg.cashOutNatural.week_limit).to.have.property('currency');

    expect(cfg.cashOutJuridical).to.have.property('percents');
    expect(cfg.cashOutJuridical).to.have.property('min');
    expect(cfg.cashOutJuridical.min).to.have.property('amount');
    expect(cfg.cashOutJuridical.min).to.have.property('currency');
  });

  it('should make successful api calls', async () => {
    expect(config.config).to.have.property('baseURL', 'http://private-38e18c-uzduotis.apiary-mock.com/');
    expect(config.config.headers.get).to.have.property('Accept', 'application/json');

    const cashInResponse = await config.cashIn();
    expect(cashInResponse).to.have.property('percents', 0.03).that.is.a('number');
    expect(cashInResponse).to.have.property('max').that.is.a('object');
    expect(cashInResponse.max).to.have.property('amount', 5).that.is.a('number');
    expect(cashInResponse.max).to.have.property('currency', 'EUR').that.is.a('string');

    const cashOutNaturalResponse = await config.cashOutNatural();
    expect(cashOutNaturalResponse).to.have.property('percents', 0.3).that.is.a('number');
    expect(cashOutNaturalResponse).to.have.property('week_limit').that.is.a('object');
    expect(cashOutNaturalResponse.week_limit).to.have.property('amount', 1000).that.is.a('number');
    expect(cashOutNaturalResponse.week_limit).to.have.property('currency', 'EUR')
      .that.is.a('string');

    const cashOutJuridicalResponse = await config.cashOutJuridical();
    expect(cashOutJuridicalResponse).to.have.property('percents', 0.3).that.is.a('number');
    expect(cashOutJuridicalResponse).to.have.property('min').that.is.a('object');
    expect(cashOutJuridicalResponse.min).to.have.property('amount', 0.5).that.is.a('number');
    expect(cashOutJuridicalResponse.min).to.have.property('currency', 'EUR')
      .that.is.a('string');
  });

  it('should return ICashIn when cashIn is invoked', async () => {
    const stub: SinonStub = sinon.stub(axios, 'get');
    stub.resolves({
      data: {
        max: {
          amount: 5,
          currency: 'EUR',
        },
        percents: 0.03,
      },
    });

    const response = await config.cashIn();
    expect(response).to.have.property('percents', 0.03).that.is.a('number');
    expect(response).to.have.property('max').that.is.a('object');
    expect(response.max).to.have.property('amount', 5).that.is.a('number');
    expect(response.max).to.have.property('currency', 'EUR').that.is.a('string');

    stub.restore();
  });

  it('should return ICashOutNatural when cashOutNatural is invoked', async () => {
    const stub: SinonStub = sinon.stub(axios, 'get');
    stub.resolves({
      data: {
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: 'EUR',
        },
      },
    });

    const response = await config.cashOutNatural();
    expect(response).to.have.property('percents', 0.3).that.is.a('number');
    expect(response).to.have.property('week_limit').that.is.a('object');
    expect(response.week_limit).to.have.property('amount', 1000).that.is.a('number');
    expect(response.week_limit).to.have.property('currency', 'EUR').that.is.a('string');

    stub.restore();
  });

  it('should return ICashOutJuridical when cashOutJuridical is invoked', async () => {
    const stub: SinonStub = sinon.stub(axios, 'get');
    stub.resolves({
      data: {
        min: {
          amount: 0.5,
          currency: 'EUR',
        },
        percents: 0.3,
      },
    });

    const response = await config.cashOutJuridical();
    expect(response).to.have.property('percents', 0.3).that.is.a('number');
    expect(response).to.have.property('min').that.is.a('object');
    expect(response.min).to.have.property('amount', 0.5).that.is.a('number');
    expect(response.min).to.have.property('currency', 'EUR').that.is.a('string');

    stub.restore();
  });
});
