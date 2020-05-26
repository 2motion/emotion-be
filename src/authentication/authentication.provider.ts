import { AccountEntity } from '@app/entities/account.entity';
import { LoginHistoryEntity } from '@app/entities/login-history.entity';
import { AccountVerfiyEntity } from '@app/entities/account-verfiy.entity';
import { SmsHistoryEntity } from '@app/entities/sms-history.entity';
import { AccountProfileEntity } from '@app/entities/account-profile.entity';
import { FileEntity } from '@app/entities/file.entity';

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
  {
    provide: 'SMS_HISTORY_REPOSITORY',
    useValue: SmsHistoryEntity,
  },
  {
    provide: 'ACCOUNT_PROFILE_REPOSITORY',
    useValue: AccountProfileEntity,
  },
  {
    provide: 'FILE_REPOSITORY',
    useValue: FileEntity,
  },
];
