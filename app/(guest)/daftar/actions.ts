'use server';

import { registerController } from '@/src/controllers/auth-controller';

type RegisterActionState = {
  success?: boolean;
  message?: string;
};

export async function registerAction(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const result = await registerController(formData);

  return {
    success: result.success,
    message: result.message,
  };
}
