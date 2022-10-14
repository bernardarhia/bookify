const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Hash user password before save
userSchema.pre("save", async function (next) {
  const userExists = await User.findOne({ username: this.username });
  if (userExists) throw new Error("User already exists");

  if (!this.isModified("password")) return next();

  const hash = await bcrypt.hash(this.password, Number(process.env.SALT));
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);
module.exports = User;
