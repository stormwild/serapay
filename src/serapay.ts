import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import startOfWeek from 'date-fns/startOfWeek';
import fs from 'fs';
// tslint:disable-next-line: import-name
import Config, { ICashIn, ICashOutJuridical, ICashOutNatural } from './config';

export interface IInput {
  date: Date;
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

export interface IConfig {
  cashIn: ICashIn;
  cashOutNatural: ICashOutNatural;
  cashOutJuridical: ICashOutJuridical;
}

class Serapay {
  private readonly users: IUser[] = [];
  private readonly input: IInput[] = [];
  private readonly commissions: number[] = [];

  constructor(private config: Config) { }

  public process(path: string): void {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) throw err;
      this.load(this.input.concat(JSON.parse(data, (key, value) => {
        return value.date ? Object.assign(value, { date: new Date(value.date) }) : value;
      })));
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

  private async load(data: IInput[]) {
    const config = await this.getConfig();
    // map the transaction list to a collection of users with a history of transactions
    data.forEach((t: IInput) => {
      if (this.users.findIndex(u => u.id === t.user_id) === -1) {
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
        const user: IUser = this.users.find(u => u.id === t.user_id) as IUser;
        user.transactions.push({
          date: new Date(t.date),
          operation: t.operation,
          type: (TransactionType as any)[t.type],
        });
      }
    });

    data.forEach((t: IInput) => {
      const c = this.computeCommission(t, config, this.users);
      this.commissions.push(c);
      // tslint:disable-next-line: no-console
      //console.log(t.user_id, t.user_type, t.type, t.operation.amount);
      console.log(c.toFixed(2));
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

  private computeCommission(
    t: IInput,
    config: IConfig,
    users: IUser[],
  ): number {
    // identify the transaction as cashin
    if ((TransactionType as any)[t.type] === TransactionType.cash_in) {
      // Percentage from amount is calculated and maximum amount is applied for cash in commissions.
      // You should fetch configuration from this endpoint.
      // In current state, this means that commission fee is 0.03% from total amount, 
      // but no more than 5.00 EUR.
      const cashIn = config.cashIn;
      const result = t.operation.amount * (cashIn.percents / 100);
      const commission = Math.ceil(result * 100) / 100;
      // tslint:disable-next-line: no-console tslint:disable-next-line: max-line-length
      //console.log('cashin', t.operation.amount, cashIn.percents, result, commission, cashIn.max.amount, commission > cashIn.max.amount);
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
      const cashOutNatural = config.cashOutNatural;
      // tslint:disable-next-line: max-line-length

      if (t.operation.amount > cashOutNatural.week_limit.amount) {
        const amount = t.operation.amount - cashOutNatural.week_limit.amount;
        const result = amount * (cashOutNatural.percents / 100);
        const commission = Math.ceil(result * 100) / 100;
        return commission;
      }

      // has there been any other cashout amount transacted within the current week?
      // how do we check for this
      // we can query the users transactions for cash out transactions within the current week
      // how do we compute for the current week given a date?
      // Well we compute the given day of the week from the date
      // then we compute the start and end dates for the monday and sunday
      // if yes has that amount plus this amount greater than cashOutNatural.week_limit.amount
      // if yes then charge the current operation amount with the percents
      // const result = (t.operation.amount - cashOutNatural.week_limit.amount) 
      // * (cashOutNatural.percents / 100);

      const user = users.find(u => u.id === t.user_id);
      if (user) {
        // we query the data for transactions within and prior 
        // to the current date but within the week
        const start = startOfWeek(t.date, { weekStartsOn: 1 });
        const total = user.transactions
          .filter((ut: ITransaction) => {
            return ((TransactionType as any)[ut.type] === TransactionType.cash_out)
              && (isSameDay(ut.date, start) || isAfter(ut.date, start))
              && isBefore(ut.date, t.date);
          })
          // tslint:disable-next-line: no-parameter-reassignment
          .reduce((sum, curr) => sum += curr.operation.amount, 0);

        if (total > cashOutNatural.week_limit.amount
          || (total + t.operation.amount) > cashOutNatural.week_limit.amount) {
          let result = (t.operation.amount) * (cashOutNatural.percents / 100);
          let commission = Math.ceil(result * 100) / 100;
          return commission;
        }

        return 0;
      }
      return 0;
    }

    if ((UserType as any)[t.user_type] === UserType.juridical) {
      // Percentage from amount is calculated and minimum amount is applied for commissions.
      // You should fetch configuration from this endpoint.
      // In current API state, this means that commission fee is 0.3% from amount, 
      // but not less than 0.50 EUR for operation.
      const cashOutJuridical = config.cashOutJuridical;
      let result = t.operation.amount * (cashOutJuridical.percents / 100);
      let commission = Math.ceil(result * 100) / 100;
      return commission > cashOutJuridical.min.amount ? commission : cashOutJuridical.min.amount;
    }

    // Rounding After calculating commission fee, 
    // it's rounded to the smallest currency item (for example, for EUR currency - cents) 
    // to upper bound (ceiled). For example, 0.023 EUR should be rounded to 3 Euro cents.
    return 0;
  }

}

export default Serapay;
