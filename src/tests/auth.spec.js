const authService = require("../services/authService.js"); 
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

jest.mock("../models/userModel.js");
jest.mock("bcrypt");

describe("authService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should create a new user", async () => {
      const mockUserData = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "password123",
      };
      const mockUser = new User(mockUserData);
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.prototype.save.mockResolvedValue(mockUser);

      const result = await authService.signUp(mockUserData); // Changed userService to authService

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockUser._id,
        first_name: mockUser.first_name,
        last_name: mockUser.last_name,
        email: mockUser.email,
      });
    });

    it("should throw an error if user with email already exists", async () => {
      const mockUserData = {
        email: "john@example.com",
      };
      User.findOne.mockResolvedValue({});

      await expect(authService.signUp(mockUserData)).rejects.toThrow(
        "User with this email already exists"
      );
    });
  });

  describe("signIn", () => {
    it("should sign in the user and return a token", async () => {
      const mockEmail = "john@example.com";
      const mockPassword = "password123";
      const mockUser = {
        _id: "mockUserId",
        email: mockEmail,
        password: "hashedPassword",
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.signIn(mockEmail, mockPassword);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockPassword,
        mockUser.password
      );
      expect(result).toHaveProperty("user", mockUser);
      expect(result).toHaveProperty("token");
    });

    it("should throw an error if user is not found", async () => {
      const mockEmail = "john@example.com";
      User.findOne.mockResolvedValue(null);

      await expect(
        authService.signIn(mockEmail, "password123")
      ).rejects.toThrow("User not found");
    });

    it("should throw an error if password is invalid", async () => {
      const mockEmail = "john@example.com";
      const mockUser = {
        email: mockEmail,
        password: "hashedPassword",
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.signIn(mockEmail, "invalidPassword")
      ).rejects.toThrow("Invalid Password");
    });
  });
});
