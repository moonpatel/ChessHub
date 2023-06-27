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
        friends: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
    },
    {
        virtuals: {
            fullName: {
                get() {
                    return this.fname + " " + this.lname;
                },
            },
        },
        methods: {
            async getFriends() {
                await this.populate("friends", "username");
                console.log(this.friends);
                return this.friends.map(friend => friend.username);
            },
        },
    }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
