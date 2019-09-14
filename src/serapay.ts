import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import startOfWeek from 'date-fns/startOfWeek';
import fs from 'fs';
// tslint:disable-next-line: import-name
import Config, { ICashIn, ICashOutJuridical, ICashOutNatural } from './config';

export interface IInput {
  date: Date;
  id: number;
  operation: IOperation;
  type: TransactionType;
  user_id: number;
  user_trxn_id: number;
  user_type: UserType;
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
  id: number;
  date: Date;
  type: TransactionType;
  operation: IOperation;
}

export interface IUser {
  id: number;
  type: UserType;
  transactions: ITransaction[];
}

export interface IConfig {
  cashIn: ICashIn;
  cashOutNatural: ICashOutNatural;
  cashOutJuridical: ICashOutJuridical;
}

class Serapay {
  constructor(private config: Config) { }

  public start(path: string): void {
    fs.readFile(path, 'utf8', async (err, data) => {
      if (err) throw err;
      const config = await this.getConfig();
      const input: IInput[] = this.getInput(data);
      const users: IUser[] = this.createUserCollection(input);
      const commissions = input.map((t: IInput) => this.computeCommission(t, config, users));
      // tslint:disable-next-line: no-console
      commissions.forEach(c => console.log(c.toFixed(2)));
    });
  }

  private getInput(data: string): IInput[] {
    return JSON.parse(data, (key, value) => {
      if (value.date) {
        return Object.assign(value, { date: new Date(value.date) });
      }
      return value;
    }).map((input: IInput, index: number) => {
      input.id = index + 1;
      return input;
    });
  }

  private async getConfig(): Promise<IConfig> {
    let cashIn: ICashIn;
    let cashOutNatural: ICashOutNatural;
    let cashOutJuridical: ICashOutJuridical;

    cashIn = await this.config.cashIn();
    cashOutNatural = await this.config.cashOutNatural();
    cashOutJuridical = await this.config.cashOutJuridical();
    return { cashIn, cashOutNatural, cashOutJuridical };
  }

  private createUserCollection(data: IInput[]): IUser[] {
    const users: IUser[] = [];
    data.forEach((t: IInput) => {
      if (users.findIndex(u => u.id === t.user_id) === -1) {
        users.push({
          id: t.user_id,
          transactions: [{
            date: new Date(t.date),
            id: 1,
            operation: t.operation,
            type: (TransactionType as any)[t.type],
          }],
          type: (UserType as any)[t.user_type],
        });
        t.user_trxn_id = 1;
      } else {
        const user: IUser = users.find(u => u.id === t.user_id) as IUser;
        user.transactions.push({
          date: new Date(t.date),
          id: user.transactions.length + 1,
          operation: t.operation,
          type: (TransactionType as any)[t.type],
        });
        t.user_trxn_id = user.transactions.length;
      }
    });
    return users;
  }

  private getCommission(
    amount: number,
    percentage: number,
    round: (num: number) => number = Math.ceil,
  ): number {
    return round(amount * (percentage / 100) * 100) / 100;
  }

  private computeCommission(
    t: IInput,
    config: IConfig,
    users: IUser[],
  ): number {
    if ((TransactionType as any)[t.type] === TransactionType.cash_in) {
      const commission = this.getCommission(t.operation.amount, config.cashIn.percents);
      return commission > config.cashIn.max.amount ? config.cashIn.max.amount : commission;
    }

    if ((UserType as any)[t.user_type] === UserType.juridical) {
      const commission = this.getCommission(t.operation.amount, config.cashOutJuridical.percents);
      return commission >
        config.cashOutJuridical.min.amount ? commission : config.cashOutJuridical.min.amount;
    }

    if ((UserType as any)[t.user_type] === UserType.natural) {
      const transactions = this.getPriorTransactionsInWeek(t, users);
      if (transactions) {
        // tslint:disable-next-line: no-parameter-reassignment
        const total = transactions.reduce((sum, curr) => sum += curr.operation.amount, 0);

        if (total > config.cashOutNatural.week_limit.amount) {
          return this.getCommission(t.operation.amount, config.cashOutNatural.percents);
        }

        if ((total + t.operation.amount) > config.cashOutNatural.week_limit.amount) {
          return this.getCommission(
            ((total + t.operation.amount) - config.cashOutNatural.week_limit.amount),
            config.cashOutNatural.percents,
          );
        }
      }

      if (t.operation.amount > config.cashOutNatural.week_limit.amount) {
        return this.getCommission(
          (t.operation.amount - config.cashOutNatural.week_limit.amount),
          config.cashOutNatural.percents,
        );
      }
    }

    return 0;
  }

  private getPriorTransactionsInWeek(t: IInput, users: IUser[]): ITransaction[] {
    const user = users.find(u => u.id === t.user_id);
    if (user) {
      const start = startOfWeek(t.date, { weekStartsOn: 1 });
      return user.transactions
        .filter((ut: ITransaction) => ut.type === TransactionType.cash_out)
        .filter((ut: ITransaction) => isSameDay(ut.date, start) || isAfter(ut.date, start))
        .filter((ut: ITransaction) => isBefore(ut.date, t.date) || isSameDay(ut.date, t.date))
        .filter((ut: ITransaction) => ut.id < t.user_trxn_id);
    }
    return [];
  }
}

export default Serapay;
