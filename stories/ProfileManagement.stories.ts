import type { Meta, StoryObj } from '@storybook/react';
import { ProfileManagement } from '@/components/auth/profile-management';

const meta: Meta<typeof ProfileManagement> = {
  title: 'Auth/Profile Management',
  component: ProfileManagement,
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
