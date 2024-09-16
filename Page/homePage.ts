import { Page, expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import { PageManager } from './pageManager';

export class HomePage extends HelperBase {
  private pm: PageManager | null = null; // Lazy initialization

  constructor(page: Page) {
    super(page);
  }

  // Lazy initialize PageManager when needed
  private getPageManager(): PageManager {
    if (!this.pm) {
      this.pm = new PageManager(this.page);
    }
    return this.pm;
  }

  async navigateToAccountsPage() {
    await this.page.locator('[href="/crm/accounts"]').click();
  }

  async searchForAccountFromHomePage(accountName: string) {
    try {
      const pm = this.getPageManager(); // Lazy initialization
      const onAccountsPage = pm.onAccountsPage();

      await this.navigateToAccountsPage();
      await onAccountsPage.searchAccount(accountName);

    } catch (error) {
      console.error(`Error searching for account: ${accountName}`, error);
      throw error;
    }
  }
}
