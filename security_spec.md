# ACADIA LMS Security Specification

## 1. Data Invariants
- A User profile can only be created or modified by the authenticated user themselves or by an administrator.
- Role escalation is strictly prohibited: non-admins cannot modify their own `role` field.
- An Academy can only be created by an instructor or admin, and can only be updated/deleted by its creator (`instructorId`) or an admin.
- A Course must belong to an existing Academy, and can only be authored or updated by the course instructor or an admin.
- A Lesson must belong to an existing Course, and can only be authored, modified, or reordered by the course instructor or an admin.
- An Enrollment can only be created or updated by the student (`userId == request.auth.uid`) or an admin. Students can only modify their own completion array and progress.
- A Review can only be authored by the student who wrote it (`userId == request.auth.uid`), and can be deleted by its author or an admin.
- Path variables and IDs must be validated to prevent injection and oversized keys.

## 2. Dirty Dozen Threat Scenarios
1. Unauthenticated client writes new academy without authorization (Rejected).
2. Student sets their own role to 'admin' in user document (Rejected).
3. Student modifies instructor's course content or deletes a lesson (Rejected).
4. Attacker writes course with forged instructorId (Rejected).
5. Non-enrolled user modifies someone else's enrollment progress (Rejected).
6. Malicious actor submits review pretending to be another student (Rejected).
7. Attack payload contains oversized 2MB strings in title or description (Rejected).
8. Malicious user attempts to delete an entire collection via missing match condition (Rejected by default-deny).
9. Student attempts to forge admin marker document in `/admins/{adminId}` (Rejected).
10. Attacker submits review with invalid rating (e.g., 999 or negative) (Rejected).
11. Malicious user changes academy owner to steal ownership (Rejected).
12. Random user scrapes or overwrites lesson attachments with malicious executables (Rejected).
