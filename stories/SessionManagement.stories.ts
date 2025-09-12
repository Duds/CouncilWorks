import type { Meta, StoryObj } from '@storybook/react';
import { SessionManagement } from '@/components/auth/session-management';

const meta: Meta<typeof SessionManagement> = {
  title: 'Auth/Session Management',
  component: SessionManagement,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
