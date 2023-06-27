const { Schema, default: mongoose } = require("mongoose");
const { String, ObjectId } = Schema.Types;

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        fname: String,
        lname: String,
        location: String,
        country: String,
        friends: {
            type: [ObjectId],
            ref: "User",
        },
    },
    {
        virtuals: {
            fullName: {
                get() {
                    return this.fname + " " + this.lname;
                },
            },
        },
    }
);

module.exports.User = mongoose.model("User", userSchema);
