'use client';

import { useSession } from 'next-auth/react';

/**
 * Debug Session Component
 * Shows what's actually in the session for debugging
 */
export function DebugSession() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <div>No session found</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-2">🔍 Session Debug Info</h3>
      <div className="space-y-2">
        <div><strong>Status:</strong> {status}</div>
        <div><strong>User ID:</strong> {session.user?.id}</div>
        <div><strong>Email:</strong> {session.user?.email}</div>
        <div><strong>Name:</strong> {session.user?.name}</div>
        <div><strong>Role:</strong> {session.user?.role}</div>
        <div><strong>Organisation:</strong> {session.user?.organisation?.name}</div>
        <div><strong>MFA Required:</strong> {session.user?.mfaRequired ? 'Yes' : 'No'}</div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold">Raw Session Data:</h4>
        <pre className="text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
