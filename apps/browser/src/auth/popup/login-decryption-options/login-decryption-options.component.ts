import { Component } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { BaseLoginDecryptionOptionsComponent } from "@bitwarden/angular/auth/components/base-login-decryption-options.component";

import { postLogoutMessageListener$ } from "../utils/post-logout-message-listener";

@Component({
  selector: "browser-login-decryption-options",
  templateUrl: "login-decryption-options.component.html",
})
export class LoginDecryptionOptionsComponent extends BaseLoginDecryptionOptionsComponent {
  override async createUser(): Promise<void> {
    try {
      await super.createUser();
      await this.router.navigate(["/tabs/vault"]);
    } catch (error) {
      this.validationService.showError(error);
    }
  }

  override async logOut(): Promise<void> {
    // start listening for "switchAccountFinish" or "doneLoggingOut"
    const messagePromise = firstValueFrom(postLogoutMessageListener$);
    super.logOut();
    // wait for messages
    const command = await messagePromise;

    // We should be routed/routing very soon but just in case, turn loading back off.
    this.loading = false;

    // doneLoggingOut already has a message handler that will navigate us
    if (command === "switchAccountFinish") {
      this.router.navigate(["/"]);
    }
  }
}
