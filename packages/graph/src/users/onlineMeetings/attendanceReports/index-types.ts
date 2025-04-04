// DO NOT EDIT THIS FILE
import type { Operation } from './../../../common.ts';

export interface Endpoints {
  /**
   */
  'DELETE /users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports/{meetingAttendanceReport-id}': Operation<
    '/users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports/{meetingAttendanceReport-id}',
    'delete'
  >;
  /**
   * The attendance reports of an online meeting. Read-only.
   */
  'GET /users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports': Operation<
    '/users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports',
    'get'
  >;
  /**
   * The attendance reports of an online meeting. Read-only.
   */
  'GET /users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports/{meetingAttendanceReport-id}': Operation<
    '/users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports/{meetingAttendanceReport-id}',
    'get'
  >;
  /**
   */
  'PATCH /users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports/{meetingAttendanceReport-id}': Operation<
    '/users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports/{meetingAttendanceReport-id}',
    'patch'
  >;
  /**
   */
  'POST /users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports': Operation<
    '/users/{user-id}/onlineMeetings/{onlineMeeting-id}/attendanceReports',
    'post'
  >;
}
