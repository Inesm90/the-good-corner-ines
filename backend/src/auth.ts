import jwt from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { User } from "./entities/User";
import Cookies from "cookies";

export type ContextType = {
  req: any;
  res: any;
  user?: User;
};

export const customAuthChecker: AuthChecker<ContextType> = async (
  { context },
  roles
) => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token");

  if (!token) {
    console.error("Missing token");
    return false;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    console.log(payload)
    if (typeof payload === "object" && "userId" in payload) {
      const user = await User.findOneBy({ id: payload.userId });

      if (user !== null) {
        context.user = Object.assign(user, { hashedPassword: undefined });
        return true;
      } else {
        console.error("User not found");
        return false;
      }
    } else {
      console.error("Invalid token, msising userId");
      return false;
    }
  } catch {
    console.error("Invalid token");
    return false;
  }
};
