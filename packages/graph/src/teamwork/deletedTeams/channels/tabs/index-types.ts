// DO NOT EDIT THIS FILE
import type { Operation } from './../../../../common.ts';

export interface Endpoints {
  /**
   */
  'DELETE /teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs/{teamsTab-id}': Operation<
    '/teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs/{teamsTab-id}',
    'delete'
  >;
  /**
   * A collection of all the tabs in the channel. A navigation property.
   */
  'GET /teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs': Operation<
    '/teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs',
    'get'
  >;
  /**
   * A collection of all the tabs in the channel. A navigation property.
   */
  'GET /teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs/{teamsTab-id}': Operation<
    '/teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs/{teamsTab-id}',
    'get'
  >;
  /**
   */
  'PATCH /teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs/{teamsTab-id}': Operation<
    '/teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs/{teamsTab-id}',
    'patch'
  >;
  /**
   */
  'POST /teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs': Operation<
    '/teamwork/deletedTeams/{deletedTeam-id}/channels/{channel-id}/tabs',
    'post'
  >;
}
