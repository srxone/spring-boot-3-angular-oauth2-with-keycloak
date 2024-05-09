import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';


export const authCodeFlowConfig: AuthConfig ={
  issuer: 'https://cloak.srxone.dynu.net/realms/test-realm',
  tokenEndpoint: 'https://cloak.srxone.dynu.net/realms/test-realm/protocol/openid-connect/token',
  redirectUri: window.location.origin,
  clientId: 'test-client',
  responseType: 'code',
  scope: 'openid profile',
}

function initializeOAuth(oauthService: OAuthService): Promise<void> {
  return new Promise( (resole) => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndLogin().then( () => resole() );
  })
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          initializeOAuth(oauthService);
        }
      },
      multi: true,
      deps: [
        OAuthService
      ]
    }
  ]
};
