import { getServerSession } from "next-auth";
import User from "../models/user";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const isAuthenticatedUser = async (req, res) => {
  const session = await getServerSession(auth);

  if (!session) {
    return res.json(
      { success: false, message: "Login first to access this route" },
      { status: 401 },
    );
  }

  req.user = session.user;
};

const authorizeRoles = (res, ...roles) => {
  return async (req) => {
    const user = await User.findOne({ email: req.user.email }).select("role");

    if (!roles.includes(user.role)) {
      return res.json(
        {
          success: false,
          message: `Role (${user.role}) is not allowed to access this resource.`,
        },
        { status: 401 },
      );
    }
  };
};

export { isAuthenticatedUser, authorizeRoles };
