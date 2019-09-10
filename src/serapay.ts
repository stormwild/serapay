import fs from 'fs';
// tslint:disable-next-line: import-name
import _ from 'lodash';
// tslint:disable-next-line: import-name
import Config, { ICashIn } from './config';

export interface IInput {
  date: string;
  user_id: number;
  user_type: UserType;
  type: TransactionType;
  operation: IOperation;
}

export enum UserType {
  natural = 'natural',
  juridical = 'juridical',
}

export enum TransactionType {
  cash_out = 'cash_out',
  cash_in = 'cash_in',
}

export interface IOperation {
  amount: number;
  currency: string;
}

export interface ITransaction {
  date: Date;
  type: TransactionType;
  operation: IOperation;
}

export interface IUser {
  id: number;
  type: UserType;
  transactions: ITransaction[];
}

class Serapay {
  private readonly users: IUser[] = [];
  private readonly input: IInput[] = [];
  private readonly commissions: number[] = [];

  constructor(private config: Config) { }

  public process(path: string): void {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) throw err;
      this.load(this.input.concat(JSON.parse(data)));
    });
  }

  private load(data: IInput[]) {
    // map the transaction list to a collection of users with a history of transactions
    _.each(data, (t: IInput) => {
      if (_.findIndex(this.users, u => u.id === t.user_id) === -1) {
        this.users.push({
          id: t.user_id,
          transactions: [{
            date: new Date(t.date),
            operation: t.operation,
            type: (TransactionType as any)[t.type],
          }],
          type: (UserType as any)[t.user_type],
        });
      } else {
        const user: IUser = _.find(this.users, u => u.id === t.user_id) as IUser;
        user.transactions.push({
          date: new Date(t.date),
          operation: t.operation,
          type: (TransactionType as any)[t.type],
        });
      }
    });

    _.each(data, async (t: IInput) => {
      const c = await this.computeCommission(t, this.config, this.users);
      this.commissions.push(c);
      // tslint:disable-next-line: no-console
      console.log(c, t.user_id, t.user_type, t.type, t.operation.amount);
    });

    // // tslint:disable-next-line: no-console
    // console.log(this.users.length);
    // _.each(this.users, (u) => {
    //   // tslint:disable-next-line: no-console
    //   console.log(u.transactions.length);
    // });
    // // tslint:disable-next-line: no-console
    // console.log(data.length);
    // // tslint:disable-next-line: no-console
    // console.log(JSON.stringify(this.users));
  }

  private async computeCommission(t: IInput, config: Config, users: IUser[]): Promise<number> {
    // identify the transaction as cashin
    if ((TransactionType as any)[t.type] === TransactionType.cash_in) {
      // Percentage from amount is calculated and maximum amount is applied for cash in commissions.
      // You should fetch configuration from this endpoint.
      // In current state, this means that commission fee is 0.03% from total amount, 
      // but no more than 5.00 EUR.
      const cashIn = await config.cashIn();
      const result = t.operation.amount * (cashIn.percents / 100);
      const commission = Math.ceil(result * 100) / 100;
      // tslint:disable-next-line: no-console tslint:disable-next-line: max-line-length
      console.log('cashin', t.operation.amount, cashIn.percents, result, commission, cashIn.max.amount, commission > cashIn.max.amount);
      return commission > cashIn.max.amount ? cashIn.max.amount : commission;
    }

    if ((UserType as any)[t.user_type] === UserType.natural) {
      // Percentage from amount is applied. Also natural persons get specific amount per week 
      // (from Monday to Sunday) free of charge.
      // You should fetch configuration from this endpoint.
      // In current API state, this means that default commission fee is 0.3% 
      // from cash out amount, but 1000.00 EUR per week (from monday to sunday) is free of charge.
      // If total cash out amount is exceeded - commission is calculated only 
      // from exceeded amount (that is, for 1000.00 EUR there is still no commission fee).
      const cashOutNatural = await config.cashOutNatural();
      //const commission = 
    }

    if ((UserType as any)[t.user_type] === UserType.juridical) {
      // Percentage from amount is calculated and minimum amount is applied for commissions.
      // You should fetch configuration from this endpoint.
      // In current API state, this means that commission fee is 0.3% from amount, 
      // but not less than 0.50 EUR for operation.
    }

    // Rounding After calculating commission fee, 
    // it's rounded to the smallest currency item (for example, for EUR currency - cents) 
    // to upper bound (ceiled). For example, 0.023 EUR should be rounded to 3 Euro cents.
    return 0;
  }

}

export default Serapay;
