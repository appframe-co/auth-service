import { Application } from "express";

export type RoutesInput = {
  app: Application,
};

export type TUserModel = {
  id: string;
  username: string;
  email: string;
  password: string;
}

export type TPassRecoveryModel = {
  id: string;
  userId: string;
  accessHash: string;
  createdAt: Date;
}

export type TUser = {
  id: string;
  email: string;
}

export type TPassRecovery = {
  id: string;
  userId: string;
  accessHash: string;
  createdAt: Date;
}

export type TSignup = {
  email: string;
  password: string;
}

export type TLogin = TSignup;

export type TPasswordReset = {
  password: string;
  passwordConfirmation: string;
  recoveryId: string;
  recoveryHash: string;
}

export type TError = {
  error: string|null;
  description?: string;
  property?: string;
}

export type TProject = {
  id: string;
}