import fs from 'fs';
// tslint:disable-next-line: import-name
import _ from 'lodash';

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

    // tslint:disable-next-line: no-console
    console.log(this.users.length);
    _.each(this.users, (u) => {
      // tslint:disable-next-line: no-console
      console.log(u.transactions.length);
    });
    // tslint:disable-next-line: no-console
    console.log(data.length);
    // tslint:disable-next-line: no-console
    console.log(JSON.stringify(this.users));
  }
}

export default Serapay;
