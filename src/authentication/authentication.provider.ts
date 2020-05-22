import { AccountEntity } from '../entities/account.entity';
import { LoginHistoryEntity } from '../entities/login-history.entity';
import { AccountVerfiyEntity } from '@app/entities/account-verfiy.entity';

export const authenticationProvider = [
  {
    provide: 'ACCOUNT_REPOSITORY',
    useValue: AccountEntity,
  },
  {
    provide: 'LOGIN_HISTORY_REPOSITORY',
    useValue: LoginHistoryEntity,
  },
  {
    provide: 'ACCOUNT_VERFIY_REPOSITORY',
    useValue: AccountVerfiyEntity,
  },
];
