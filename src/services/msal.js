import * as Msal from "@azure/msal-browser";
import { ref } from "vue";

export class MsalImplementation {
  publicClient = null;
  isAuthenticated = ref(null);
  account = ref(null);
  hasError = ref(null);
  errorMessage = ref("");

  constructor(publicClient) {
    this.publicClient = publicClient;
    this.isAuthenticated.value = this.getIsAuthenticated();

    this.publicClient
      .handleRedirectResponse()
      .then((resp) => {
        this.hasError.value = false;
        if (resp !== null) {
          this.account.value = resp.account;
        } else {
          const currentAccounts = publicClient.getAllAccounts();
          if (!currentAccounts || currentAccounts.length < 1) {
            this.userAccount.value = null;
            return;
          } else if (currentAccounts.length >= 1) {
            this.account.value = currentAccounts[0];
          }
        }
        this.isAuthenticated.value = this.getIsAuthenticated();
      })
      .catch((error) => {
        this.hasError.value = true;
        this.errorMessage.value = error.errorMessage;
      });
  }

  async signIn() {
    this.hasError.value = false;
    try {
      const loginRequest = {
        scopes: ["User.Read"],
      };
      const loginResponse = await this.publicClient.loginRedirect(loginRequest);
      if (!!loginResponse.account) {
        this.isAuthenticated.value = true;
        this.account.value = loginResponse.account;
      }
      // do something with this?
    } catch (err) {
      // handle error
      if (err.errorMessage && err.errorMessage.indexOf("AADB2C90118") > -1) {
        try {
          const passwordResetResponse = await this.publicClient.loginRedirect({
            scopes: ["User.Read"],
          });
          if (!!passwordResetResponse.account) {
            this.isAuthenticated.value = true;
            this.account.value = passwordResetResponse.account;
          }
        } catch (passwordResetError) {
          this.hasError.value = true;
          this.errorMessage.value = passwordResetError.errorMessage;
        }
      } else {
        this.isAuthenticated.value = false;
        this.account.value = null;
      }
    }
  }
  async signOut() {
    this.hasError.value = false;
    await this.publicClient.logout();
    this.isAuthenticated.value = false;
    this.account.value = null;
  }
  async acquireToken() {
    this.hasError.value = false;
    const request = {
      account: this.publicClient.getAllAccounts()[0],
      scopes: ["User.Read"],
    };
    try {
      const response = await this.publicClient.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      if (error instanceof Msal.InteractionRequiredAuthError) {
        return this.publicClient
          .acquireTokenRedirect(request)
          .catch((popupError) => {
            this.hasError.value = true;
            this.errorMessage.value = popupError.errorMessage;
          });
      }
      this.hasError.value = true;
      this.errorMessage.value = passwordResetError.errorMessage;
    }
  }
  getIsAuthenticated() {
    const accounts = this.publicClient.getAllAccounts();
    if (accounts && accounts.length > 0) {
      this.account.value = accounts[0];
      return true;
    }

    this.account.value = null;
    return false;
  }
}
