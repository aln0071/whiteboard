const axios = require("axios");
const assert = require("assert");
const apiUrl = "http://localhost:2000/api/v1";
const { DB_URI } = require("../src/config");
const mongoose = require("mongoose");
const { BoardSchema, UserSchema, QuestionSchema } = require("app-models");
const BoardModel = mongoose.model("Board", BoardSchema);
const UserModel = mongoose.model("User", UserSchema);
const QuestionModel = mongoose.model("Question", QuestionSchema);


describe("GET - get boards of a particular name", function () {
    var accessToken;
    var testBoardId;
    var testQuestionId;

    before(async function () {
        mongoose.set("strictQuery", true);
        mongoose.connect(DB_URI);
        console.log("before start");
        try {
            await UserModel.findOneAndDelete({ username: 'test@gmail.com' })
            await BoardModel.findOneAndDelete({ name: 'testBoard' })
            await QuestionModel.findOneAndDelete({ question: 'Test Question Description' })
        }
        catch {
            console.log("err");
        }
        console.log("before ends");
    }),
        it("POST API : /authentication/register", (done) => {
            axios.post(apiUrl + "/authentication/register", {
                "email": "test@gmail.com",
                "password": "pass"
            })
                .then((response) => {
                    assert.equal(response.status, 201);
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("POST API : /api/v1/authentication/login", (done) => {
            axios.post(apiUrl + "/authentication/login", {
                "email": "test@gmail.com",
                "password": "pass"
            })
                .then((response) => {
                    assert.equal(response.status, 200);
                    accessToken = response.data.accessToken;
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("GET API : /api/v1/authentication/getProfile", (done) => {
            axios.get(apiUrl + "/authentication/getProfile", {
                headers: {
                    Cookie: "jwtToken=" + accessToken
                }
            })
                .then((response) => {
                    assert.equal(response.status, 200);
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("POST API : /api/v1/authentication/updateProfile", (done) => {
            axios.post(apiUrl + "/authentication/updateProfile",
                {
                    firstName: "Test",
                    lastName: "User"
                },
                {
                    headers: {
                        Cookie: "jwtToken=" + accessToken
                    }
                }
            )
                .then((response) => {
                    assert.equal(response.status, 200);
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("POST API : /board/create/:boardname", (done) => {
            axios.post(apiUrl + "/board/create/testBoard", {},
                {
                    headers: {
                        Cookie: "jwtToken=" + accessToken
                    }
                }
            )
                .then((response) => {
                    assert.equal(response.status, 200);
                    testBoardId = response.data
                    // console.log(testBoardId, "testBoardId")
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("POST API : /board/question", (done) => {
            axios.post(apiUrl + "/board/question", {
                name: "testBoard",
                description: "Test Question Description"
            },
                {
                    headers: {
                        Cookie: "jwtToken=" + accessToken
                    }
                }
            )
                .then((response) => {
                    assert.equal(response.status, 200);
                    testQuestionId = response.data
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("POST API : /api/v1/board/fetchquestions", (done) => {
            axios.post(apiUrl + "/board/fetchquestions", {
                questionid: testQuestionId
            },
                {
                    headers: {
                        Cookie: "jwtToken=" + accessToken
                    }
                }
            )
                .then((response) => {
                    assert.equal(response.status, 200);
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("GET API : /api/v1/board/getusers/:boardname", (done) => {
            axios.get(apiUrl + "/board/getusers/testBoard",
                {
                    headers: {
                        Cookie: "jwtToken=" + accessToken
                    }
                }
            )
                .then((response) => {
                    assert.equal(response.status, 200);
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("GET API : /api/v1/board/list", (done) => {
            axios.get(apiUrl + "/board/list",
                {
                    headers: {
                        Cookie: "jwtToken=" + accessToken
                    }
                }
            )
                .then((response) => {
                    assert.equal(response.status, 200);
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("GET API : /api/v1/board/answer", (done) => {
            axios.post(apiUrl + "/board/answer", {
                description: "Test Answer",
                questionId: testQuestionId
            },
                {
                    headers: {
                        Cookie: "jwtToken=" + accessToken
                    }
                }
            )
                .then((response) => {
                    assert.equal(response.status, 200);
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        }),
        it("PUT API : /api/v1/board/sharing/:id", (done) => {
            var api = apiUrl + "/board/sharing/" + testBoardId
            axios.put(api, {},
                {
                    headers: {
                        Cookie: "jwtToken=" + accessToken
                    }
                }
            )
                .then((response) => {
                    assert.equal(response.status, 200);
                    done()
                })
                .catch((err) => {
                    done(err)
                });
        })
});