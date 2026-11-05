const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username:   {type:String, required: true},
        password:   {type:String, required: true},
        name:       { type: String, required: true, trim: true },
        email:      { type: String, required: true, trim: true },
        role:       { type: String, enum: ["user", "admin"], default: "user" },
        approved:   { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
