'use server';
import { signIn as si, signOut as so } from '../auth';

export async function signOut() {
  await so({ redirectTo: '/' });
}

export async function signIn(formData: FormData) {
  await si('google', formData);
}
