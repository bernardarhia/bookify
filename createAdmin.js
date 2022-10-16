import prompt from "prompt";
import UserModel from "./models/User.js";
import dbConnect from "./utils/dbConnection.js";

const adminModel = [
  {
    name: "username",
    description: "Enter your username",
    validator: /^[a-zA-Z\s-]+$/,
    warning: "Username must be only letters, spaces, or dashes",
    required: true,
    type: "string",
  },
  {
    name: "password",
    description: "Enter your password",
    hidden: true,
    required: true,
    replace: "*",
  },
];
dbConnect();
prompt.start();

prompt.get(adminModel, async (err, result) => {
  if (err) {
    return onErr(err);
  }

  try {
    const { username, password } = result;
    const role = "admin";
    const created = await UserModel.create({ username, password, role });
    console.log(created);
    if(created) console.log({username, id:created._id})
  } catch (error) {
    console.log({ error : error.message });
  }
  process.exit(0);
});

function onErr(err) {
  console.log(err);
  return 1;
}
