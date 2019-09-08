import chai from 'chai';
const expect = chai.expect;

import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';

import axios from 'axios';
import sinon, { SinonStub } from 'sinon';

// tslint:disable-next-line: import-name
import Config from './config';

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
    expect(response.percents).to.equal(0.03);
    expect(response.max.amount).to.equal(5);
    expect(response.max.currency).to.equal('EUR');

    expect(response).to.have.property('percents');
    expect(response).to.have.property('max');
    expect(response.max).to.have.property('amount');
    expect(response.max).to.have.property('currency');

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
    expect(response.percents).to.equal(0.3);
    expect(response.week_limit.amount).to.equal(1000);
    expect(response.week_limit.currency).to.equal('EUR');

    expect(response).to.have.property('percents');
    expect(response).to.have.property('week_limit');
    expect(response.week_limit).to.have.property('amount');
    expect(response.week_limit).to.have.property('currency');

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
    expect(response.percents).to.equal(0.3);
    expect(response.min.amount).to.equal(0.5);
    expect(response.min.currency).to.equal('EUR');

    expect(response).to.have.property('percents');
    expect(response).to.have.property('min');
    expect(response.min).to.have.property('amount');
    expect(response.min).to.have.property('currency');

    stub.restore();
  });
});
