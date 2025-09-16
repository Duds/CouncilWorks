import type { Meta, StoryObj } from '@storybook/react';
import { MFASetup } from '@/components/auth/mfa-setup';

const meta: Meta<typeof MFASetup> = {
  title: 'Auth/MFA Setup',
  component: MFASetup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onComplete: { action: 'completed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onComplete: () => console.log('MFA setup completed'),
  },
};
