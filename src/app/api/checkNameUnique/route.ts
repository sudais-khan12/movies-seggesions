import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import { z } from "zod";
import { nameValidation } from "@/schemas/signUpSchema";

const userNameQuerySchema = z.object({
  username: nameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = userNameQuerySchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      const errors = result.error.format().username?._errors || [];

      return Response.json(
        {
          message: errors.join(", "),
          success: false,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const exsitingVerifiedUser = await User.findOne({
      username,
    });
    if (exsitingVerifiedUser) {
      return Response.json(
        {
          message: "Username already taken",
          success: false,
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        message: "Username is Unique",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error, "checking user name ");
    return Response.json(
      {
        message: "Error checking username",
        success: false,
      },
      { status: 500 }
    );
  }
}
