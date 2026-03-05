import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserByIdService,
  deleteUserByIdService,
} from "../models/user.model.js";

// standard controller file for user operations

const handleRespnse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const newUser = await createUserService(name, email);
    handleRespnse(res, 201, "User created successfully", newUser);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    handleRespnse(res, 200, "Users retrieved successfully", users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(req.params.id);
    if (!user) {
      return handleRespnse(res, 404, "User not found");
    }
    handleRespnse(res, 200, "User retrieved successfully", user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await updateUserByService(
      req.params.id,
      req.body.name,
      req.body.email,
    );
    handleRespnse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserByIdService(req.params.id);
    if (!deletedUser) {
      return handleRespnse(res, 404, "User not found");
    }
    handleRespnse(res, 200, "User deleted successfully", deletedUser);
  } catch (err) {
    next(err);
  }
};
