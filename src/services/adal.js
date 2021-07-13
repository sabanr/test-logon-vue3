import { ref } from "vue";

export class AdalImplementation {
  authorizationContext = null;
  isAuthenticated = ref(false);
  account = ref(null);
  hasError = ref(null);
  errorMessage = ref("");

  constructor(authorizationContext) {
    this.authorizationContext = authorizationContext;
    this.hasError.value = false;
    this.errorMessage.value = "";

    try {
      if (
        this.authorizationContext.isCallback(window.location.hash) ||
        window.self !== window.top
      ) {
        this.authorizationContext.handleWindowCallback();
      }
    } catch (error) {
      this.hasError.value = true;
      this.errorMessage.value = this.authenticationContext.getLoginError();
    }

    this.account.value = this.authorizationContext.getCachedUser();
    this.isAuthenticated.value = this.account.value !== null;
  }
  signIn() {
    this.hasError.value = false;
    this.errorMessage.value = "";
    this.authorizationContext.login();
  }
  signOut() {
    this.hasError.value = false;
    this.errorMessage.value = "";
    this.isAuthenticated.value = false;
    this.account.value = null;
    this.authorizationContext.logOut();
  }
  acquireToken() {
    return this.authorizationContext.getCachedToken(
      this.authorizationContext.config.clientId
    );
  }
}
