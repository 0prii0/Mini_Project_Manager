import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput, registerSchema, loginSchema } from '../validators/auth.validator';
import { HttpError } from '../utils/errors';

export interface SafeUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResult {
  token: string;
  user: SafeUser;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<SafeUser> {
    const validated = registerSchema.parse(input);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new HttpError(409, 'Email is already registered');
    }

    const hashedPassword = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }

  /**
   * Authenticate user and issue JWT
   */
  async login(input: LoginInput): Promise<LoginResult> {
    const validated = loginSchema.parse(input);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(validated.password, user.password);

    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Retrieve current authenticated user profile
   */
  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new HttpError(401, 'User not found or unauthenticated');
    }

    return user;
  }
}

export const authService = new AuthService();
