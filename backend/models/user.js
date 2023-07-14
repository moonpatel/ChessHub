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
        games: [
            {
                type: ObjectId,
                ref: "Game",
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
            _friends_: {
                async get() {
                    await this.populate("friends", "username email");
                    // console.log(this.friends);
                    return this.friends.map((friend) => {
                        return {
                            username: friend.username,
                            email: friend.email,
                            id: friend.id,
                        };
                    });
                },
            },
            _games_: {
                async get() {
                    await this.populate("games");
                    return this.games;
                },
            },
        },
        methods: {
            async getFriends() {
                await this.populate("friends", "username email");
                // console.log(this.friends);
                return this.friends.map((friend) => {
                    return {
                        username: friend.username,
                        email: friend.email,
                        id: friend.id,
                    };
                });
            },
            async getGames() {
                await this.populate("games");
                return this.games;
            },
        },
    }
);

userSchema.index({ username: "text" });

const User = mongoose.model("User", userSchema);
module.exports = { User };
