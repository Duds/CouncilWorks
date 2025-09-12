import type { Meta, StoryObj } from '@storybook/react';
import { ActivityLog } from '@/components/auth/activity-log';

const meta: Meta<typeof ActivityLog> = {
  title: 'Auth/Activity Log',
  component: ActivityLog,
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
