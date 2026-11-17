import { Metadata } from 'next';
import { SignupForm } from './SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up | Mini Project Manager',
  description: 'Create an account to start managing your projects',
};

export default function SignupPage() {
  return <SignupForm />;
}
