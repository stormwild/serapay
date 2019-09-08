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

  it('should return ICashIn when getCashIn is invoked ', async () => {
    const stub: SinonStub = sinon.stub(axios, 'get');
    stub.resolves({
      max: {
        amount: 5,
        currency: 'EUR',
      },
      percents: 0.03,
    });

    const response = await config.cashIn('/api');
    expect(response.percents).to.equal(0.03);
    expect(response.max.amount).to.equal(5);
    expect(response.max.currency).to.equal('EUR');
    stub.restore();
  });
});
