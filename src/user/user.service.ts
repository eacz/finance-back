import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { User } from 'src/auth/entities/user.entity';
import { getProfileResumeResponse } from './interfaces/get-profile-resume-response';

@Injectable()
export class UserService {
  constructor(private readonly accountService: AccountService) {}

  async getProfileResume(user: User): Promise<getProfileResumeResponse> {
    const userAccounts = await this.accountService.getAccountByUser(user.id);    
    const totalFunds = userAccounts.reduce(
      (prev, account) => prev + account.funds,
      0,
    );
    const accounts = userAccounts.map((account) => ({
      accountId: account.id,
      currency: account.currency.code,
    }));

    return {
      user: {
        country: user.country,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        username: user.username,
      },
      accounts,
      totalFunds,
    };
  }
}
