import fs from 'fs';

import chai from 'chai';
const expect = chai.expect;

import chaiAsPromised from 'chai-as-promised';
import chaiFs from 'chai-fs';
import dirtyChai from 'dirty-chai';

// tslint:disable-next-line: import-name
import Config, { IConfig } from './config';
// tslint:disable-next-line: import-name
import Serapay from './serapay';

chai.use(chaiAsPromised);
chai.use(dirtyChai);
chai.use(chaiFs);

describe('Serapay class', () => {
  let config: IConfig;
  let serapay: Serapay;

  before(async () => {
    const defaultConfig = {
      baseURL: 'http://private-38e18c-uzduotis.apiary-mock.com/',
      headers: {
        get: {
          Accept: 'application/json',
        },
      },
    };
    config = await new Config(defaultConfig).getConfig();
    serapay = new Serapay();
  });

  it('should return expected output when getCommission is invoked with test data', () => {
    const path = './data/input.json';
    expect(path).to.be.a.file().with.json();
    const data: string = fs.readFileSync(path, 'utf8');
    const commissions = serapay.getCommissions(data, config);
    const expected = [0.06, 0.9, 87, 3, 0.3, 0.3, 5, 0, 0, 0, 0.3];
    expect(commissions).to.eql(expected);
  });
});
