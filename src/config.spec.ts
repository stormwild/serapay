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
    config = new Config();
  });

  it('should return ICashIn when cashIn is invoked', async () => {
    const stub: SinonStub = sinon.stub(axios, 'get');
    stub.resolves({
      max: {
        amount: 5,
        currency: 'EUR',
      },
      percents: 0.03,
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
      percents: 0.3,
      week_limit: {
        amount: 1000,
        currency: 'EUR',
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
      min: {
        amount: 0.5,
        currency: 'EUR',
      },
      percents: 0.3,
    });

    const response = await config.cashOutJuridical();
    expect(response).to.have.property('percents', 0.3).that.is.a('number');
    expect(response).to.have.property('min').that.is.a('object');
    expect(response.min).to.have.property('amount', 0.5).that.is.a('number');
    expect(response.min).to.have.property('currency', 'EUR').that.is.a('string');

    stub.restore();
  });
});
