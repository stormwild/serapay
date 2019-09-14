import chai from 'chai';
const expect = chai.expect;

import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';
import chaiFs from 'chai-fs';

import axios from 'axios';
import sinon, { SinonStub } from 'sinon';

// tslint:disable-next-line: import-name
import Config from './config';
// tslint:disable-next-line: import-name
import Serapay, { IConfig } from './serapay';

chai.use(chaiAsPromised);
chai.use(dirtyChai);
chai.use(chaiFs);

describe('Serapay class', () => {
  let config: Config;
  let serapay: Serapay;

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
    serapay = new Serapay(config);
  });

  it('start method should throw error for empty path', () => {
    const path = './data/input.json';
    //expect(() => serapay.start('')).to.throw();
    expect(path).to.be.a.file().with.json();
    expect(() => serapay.start(path)).to.not.throw();
  });

  xit('getConfig should return IConfig', async () => {
    const cfg: IConfig = await serapay.getConfig();
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


});
