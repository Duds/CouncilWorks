import type { Meta, StoryObj } from '@storybook/react';

const AuthenticationDocumentation = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Authentication System</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive authentication and security features for Aegrid
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multi-Factor Authentication */}
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h2 className="text-xl font-semibold">Multi-Factor Authentication</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• TOTP (Time-based One-Time Password) support</li>
            <li>• QR code generation for authenticator apps</li>
            <li>• Backup codes for account recovery</li>
            <li>• SMS/Email fallback options</li>
            <li>• Integration with Google Authenticator, Authy, etc.</li>
          </ul>
        </div>

        {/* Profile Management */}
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-xl font-semibold">Profile Management</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Personal information updates</li>
            <li>• Avatar upload and management</li>
            <li>• Timezone and language preferences</li>
            <li>• Phone number and bio fields</li>
            <li>• Real-time profile updates</li>
          </ul>
        </div>

        {/* Password Security */}
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-xl font-semibold">Password Security</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• bcrypt hashing with 12 salt rounds</li>
            <li>• Password strength validation</li>
            <li>• Time-limited reset tokens</li>
            <li>• Secure password change flow</li>
            <li>• Password history prevention</li>
          </ul>
        </div>

        {/* OAuth Integration */}
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-xl font-semibold">OAuth Providers</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Google OAuth integration</li>
            <li>• Microsoft Azure AD support</li>
            <li>• Seamless account linking</li>
            <li>• Profile synchronization</li>
            <li>• Error handling and fallbacks</li>
          </ul>
        </div>

        {/* Activity Logging */}
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-xl font-semibold">Activity Logging</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Comprehensive audit trail</li>
            <li>• Login/logout tracking</li>
            <li>• Security event monitoring</li>
            <li>• IP address and device tracking</li>
            <li>• Real-time activity display</li>
          </ul>
        </div>

        {/* Session Management */}
        <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-semibold">Session Management</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Multi-device session tracking</li>
            <li>• Device identification</li>
            <li>• Session revocation</li>
            <li>• Browser and OS detection</li>
            <li>• Location tracking</li>
          </ul>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Security Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">ISO 27001</div>
            <div className="text-sm text-muted-foreground">Information Security Management</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">ISO 27002</div>
            <div className="text-sm text-muted-foreground">Security Controls</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">ISO 22301</div>
            <div className="text-sm text-muted-foreground">Business Continuity</div>
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Implementation Notes
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• All authentication features are fully implemented and tested</li>
          <li>• Components follow Australian English standards</li>
          <li>• Security best practices are enforced throughout</li>
          <li>• Real data testing approach (no mocks)</li>
          <li>• Comprehensive error handling and user feedback</li>
          <li>• Mobile-responsive design for all components</li>
        </ul>
      </div>
    </div>
  );
};

const meta: Meta<typeof AuthenticationDocumentation> = {
  title: 'Documentation/Authentication System',
  component: AuthenticationDocumentation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <AuthenticationDocumentation />,
};
