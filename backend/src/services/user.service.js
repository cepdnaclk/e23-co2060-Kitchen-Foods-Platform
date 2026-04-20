import User from "../models/user.model.js";

export const getAllUsersService = async () => User.findAll();

export const getUserByIdService = async (uid) => User.findById(uid);

export const getUserByEmailService = async (email) => User.findByEmail(email);

export const createUserService = async (
  full_name,
  email,
  password_hash,
  role,
) => User.create(full_name, email, password_hash, role);

export const updateUserByIdService = async (uid, full_name, email, role) =>
  User.updateById(uid, full_name, email, role);

export const deleteUserByIdService = async (uid) => User.deleteById(uid);
