import { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Mini Project Manager',
  description: 'Sign in to access your projects and tasks',
};

export default function LoginPage() {
  return <LoginForm />;
}
