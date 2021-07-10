import * as msal from "@azure/msal-browser";

const msconfig = {
  auth: {
    clientId: "9fd0dafb-3646-47cc-b6a8-05ca78e5fff8",
    authority:
      "https://login.microsoftonline.com/06671189-dfc0-40b6-a063-435ac5cc7b24",
  },
  cache: {
    cacheLocation: "localStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(`${loglevel} - ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Info,
    },
  },
};

export default {
  msalClientApp: null,
  isLoggedOn: false,
  userName: "",
  userRoles: [],
  userToken: "",
  initialize() {
    this.msalClientApp = new msal.PublicClientApplication(msconfig);
    this.msalClientApp
      .handleRedirectResponse()
      .then((resp) => {
        console.log("Handling redirect response!");
        let loggedInAccount = null;
        if (resp !== null) {
          loggedInAccount = resp.account;
        } else {
          console.log("getting all accounts!");
          const currentAccounts = msalClientApp.getAllAccounts();
          if (!currentAccounts || currentAccounts.length < 1) {
            console.log("no accounts found!");
            return;
          } else if (currentAccounts.length >= 1) {
            loggedInAccount = currentAccounts[0];
          }
        }

        if (loggedInAccount !== null) {
          this.userName = loggedInAccount.name;
          this.userRoles.push(...loggedInAccount.idTokenClaims.roles);
          this.isLoggedOn = true;
          //this.userToken = loggedInAccount.
        }
      })
      .catch((error) => {
        reject(`Authorization error: ${error}`);
        this.isLoggedOn = false;
      });
  },
  /**
   * @return {String} Un token de autenticacion valido
   */
  obtenerToken() {
    return this.contextoDeAutenticacion.getCachedToken(
      configuracionADD.clientId
    );
  },
  /**
   * @return {Promise.<String>} Una promesa que provee un token ADAL para acceso a recursos
   */
  obtenerTokenDeRecurso(recursoId) {
    return new Promise((resolve, reject) => {
      this.contextoDeAutenticacion.acquireToken(recursoId, (error, token) => {
        if (error || !token) {
          return reject(error);
        } else {
          return resolve(token);
        }
      });
    });
  },
  /**
   * Envia un requerimiento de autenticacion interactiva para un recurso de parte del usuario actual.
   */
  obtenerTokenInteractivo(recursoId) {
    this.contextoDeAutenticacion.acquireTokenRedirect(recursoId);
  },
  /**
   * @return {Boolean} Indica si hay un token valid y no expirado presente en localStorage.
   */
  estaAutenticado() {
    if (
      this.contextoDeAutenticacion.getCachedToken(configuracionADD.clientId)
    ) {
      return true;
    }
    return false;
  },
  /**
   * @return Object con un perfil de usuario ADAL.
   */
  obtenerPerfilDelUsuario() {
    let usuario = this.contextoDeAutenticacion.getCachedUser();

    if (usuario) {
      return usuario.profile;
    }
  },
  /**
   * @return Array con los roles del usuario.
   */
  obtenerRolesDelUsuario() {
    let perfilDeUsuario = this.obtenerPerfilDelUsuario();
    if (perfilDeUsuario) {
      let roles = [];
      for (const rol of perfilDeUsuario.roles) {
        for (const rol2 of rol.split(";")) {
          let rolMinuscula = rol2.toLowerCase();
          roles.push(rolMinuscula);
        }
      }

      return roles;
    }
  },
  async LogIn() {
    var loginRequest = {
      scopes: ["User.Read"],
    };
    await this.msalClientApp.loginRedirect(loginRequest);
  },
  async LogOff() {
    await this.msalClientApp.logoutRedirect();
  },
};
