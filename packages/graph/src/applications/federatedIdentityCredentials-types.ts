// DO NOT EDIT THIS FILE
import type { Operation } from './../common.ts';

export interface Endpoints {
  /**
   * Delete a federatedIdentityCredential object from an application.
   */
  'DELETE /applications/{application-id}/federatedIdentityCredentials/{federatedIdentityCredential-id}': Operation<
    '/applications/{application-id}/federatedIdentityCredentials/{federatedIdentityCredential-id}',
    'delete'
  >;
  /**
   * Get a list of the federatedIdentityCredential objects and their properties.
   */
  'GET /applications/{application-id}/federatedIdentityCredentials': Operation<
    '/applications/{application-id}/federatedIdentityCredentials',
    'get'
  >;
  /**
   * Read the properties and relationships of a federatedIdentityCredential object.
   */
  'GET /applications/{application-id}/federatedIdentityCredentials/{federatedIdentityCredential-id}': Operation<
    '/applications/{application-id}/federatedIdentityCredentials/{federatedIdentityCredential-id}',
    'get'
  >;
  /**
   * Create a new federatedIdentityCredential object for an application if it doesn&#x27;t exist, or update the properties of an existing federatedIdentityCredential object. By configuring a trust relationship between your Microsoft Entra application registration and the identity provider for your compute platform, you can use tokens issued by that platform to authenticate with Microsoft identity platform and call APIs in the Microsoft ecosystem. Maximum of 20 objects can be added to an application.
   */
  'PATCH /applications/{application-id}/federatedIdentityCredentials/{federatedIdentityCredential-id}': Operation<
    '/applications/{application-id}/federatedIdentityCredentials/{federatedIdentityCredential-id}',
    'patch'
  >;
  /**
   * Create a new federatedIdentityCredential object for an application. By configuring a trust relationship between your Microsoft Entra application registration and the identity provider for your compute platform, you can use tokens issued by that platform to authenticate with Microsoft identity platform and call APIs in the Microsoft ecosystem. Maximum of 20 objects can be added to an application.
   */
  'POST /applications/{application-id}/federatedIdentityCredentials': Operation<
    '/applications/{application-id}/federatedIdentityCredentials',
    'post'
  >;
}
