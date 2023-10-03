const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { User } = require("../config/roleList");
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const { json } = require("body-parser");
const { fileBucket } = require("../middleware/fileUpload/fileUploadPublic");
const { Console } = require("console");
const uuid = require("uuid").v4;



const createPost = asyncHandler(async (req, res) => {
    const user = req.user;
    const { title, message } = req.body;
    const files = req.files;
    const forum_id = req.params.id;

    try {

        const foundUser = await prisma.users.findFirst({
            where: {
                username: user,
            },
        });

        if (!foundUser) {
            return res.status(400).json({
                message: `Bad request`,
            });
        }

        const foundForum = await prisma.forum.findFirst({
            where: {
                id: forum_id,
            },
        });

        if (!foundForum) {
            return res.status(404).json({
                message: `Forum not found`,
            });
        }

        const createdPost = await prisma.posts.create({
            data: {
                title: title,
                message: message,
                user_id: foundUser.id,
                forum_id: forum_id,
            },
            include: {
                post_reactions: {
                    where: {
                        user_id: foundUser.id,
                    },
                    select: {
                        islike: true,
                    },
                },
                comments: {
                    include: {
                        comment_reactions: {
                            where: {
                                user_id: foundUser.id,
                            },
                            select: {
                                islike: true,
                            },
                        },
                    },
                },
                attachments: true,
                user: true,
                _count: {
                    select: {
                        comments: true,
                        post_reactions: true,
                    }
                }
            },
        });


        let date = new Date();
        date = date.toISOString();

        if (files) {
            files.forEach(async (file) => {
                const newFileName = `${date}_${uuid()}_${file.originalname.replace(/ /g, '_')}`;
                const blob = fileBucket.file(newFileName);
                const blobStream = blob.createWriteStream();
                blobStream.on('finish', () => {
                    console.log('success')
                })
                blobStream.end(file.buffer);
                await prisma.attachments.create({
                    data: {
                        post_id: createdPost.id,
                        type: file.mimetype === 'application/pdf' ? 'DOCUMENT' : 'IMAGE',
                        file_path: `https://storage.googleapis.com/${fileBucket.name}/${newFileName}`,
                    },
                });
            });
        }

        res.status(201).json({
            message: `Post created`,
            data: createdPost
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }



    // return res.status(201).json({
    //     message: `Post created`,
    //     data: req.body
    // });


})

const deletePost = asyncHandler(async (req, res) => {
    const user = req.user;
    const id = req.params.id;

    try {
        const foundUser = await prisma.users.findFirst({
            where: {
                username: user,
            },
        });

        if (!foundUser) {
            return res.status(400).json({
                message: `Bad request`,
            });
        }

        const foundPost = await prisma.posts.findFirst({
            where: {
                id: id,
            },
        });

        if (!foundPost) {
            return res.status(404).json({
                message: `Post not found`,
            });
        }

        if (foundPost.user_id !== foundUser.id) {
            return res.status(403).json({
                message: `Forbidden`,
            });
        }

        const deletedPost = await prisma.posts.delete({
            where: {
                id: id,
            },
        });

        res.status(200).json({
            message: `Post deleted`,
            data: deletedPost,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }
})

const addReaction = asyncHandler(async (req, res) => {
    const user = req.user;
    const post_id = req.query.post_id ? req.query.post_id : null;
    const islike = JSON.parse(req.body.islike);
    console.log("here")
    console.log(req.body)

    try {

        const foundUser = await prisma.users.findFirst({
            where: {
                username: user,
            },
        });

        if (!foundUser) {
            return res.status(400).json({
                message: `Bad request`,
            });
        }


        // Check if the comment exists in the database and find the user's reaction for the comment in a single query
        const postWithReaction = await prisma.posts.findFirst({
            where: {
                id: post_id,
            },
            include: {
                post_reactions: {
                    where: {
                        user_id: foundUser.id,
                    },
                },
            },
        });

        if (!postWithReaction) {
            // Return 404 status if the content is not found
            return res.status(404).json({
                message: `Content not found`,
            });
        }

        console.log(postWithReaction);
        const foundReaction = postWithReaction.post_reactions[0];

        if (foundReaction) {
            if (foundReaction.islike === islike) {
                await prisma.post_reactions.delete({
                    where: {
                        id: foundReaction.id,
                    },
                })

                res.status(200).json({
                    message: `Reaction removed`,
                    // data: []
                });
            } else {
                await prisma.post_reactions.update({
                    where: {
                        id: foundReaction.id,
                    },
                    data: {
                        islike: islike,
                    },
                })

                const updatedReaction = await prisma.post_reactions.findFirst({
                    where: {
                        user_id: foundReaction.user_id,
                        post_id: post_id,
                    },
                })


                res.status(200).json({
                    message: `Reaction updated`,
                    // data: updatedReaction
                });
            }


        } else {
            const createdReaction = await prisma.post_reactions.create({
                data: {
                    islike: islike,
                    user_id: foundUser.id,
                    post_id: post_id,
                },
            })

            res.status(200).json({
                message: `Reaction added`,
                // data: createdReaction
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }
})


const getPostById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
        const foundPost = await prisma.posts.findFirst({
            where: {
                id: id,
            },
            include: {
                post_reactions: {
                    where: {
                        user_id: req.user.id,
                    },
                    select: {
                        islike: true,
                    },
                },
                comments: {
                    include: {
                        comment_reactions: {
                            where: {
                                user_id: req.user.id,
                            },
                            select: {
                                islike: true,
                            },
                        },
                    },
                },
            },
        })

        if (!foundPost) {
            return res.status(404).json({
                message: `Post not found`,
            });
        }

        res.status(200).json(foundPost);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }
})

const getComments = asyncHandler(async (req, res) => {
    // console.log("getComments");
    const id = req.params.post_id;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const take = req.query.take ? parseInt(req.query.take) : 10;

    console.log(req.query);
    console.log(id);

    if (id === undefined || id === null) {
        return res.status(400).json({
            message: `Bad request`,
        });
    }


    try {
        const foundPost = await prisma.posts.findUnique({
            where: {
                id: id,
            },

            select: {
                id: true,
                // Include comments along with an aggregation function to get the reply count for each comment isLike
                comments: {
                    where: {
                        parent_id: null, // Fetch only top-level comments
                    },
                    orderBy: {
                        posted_at: "desc",
                    },
                    skip: skip,
                    take: take,
                    include: {
                        commenter: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                            },
                        },
                        comment_reactions: {
                            where: {
                                user_id: req.user.id,
                            },
                            select: {
                                islike: true,
                            },
                        },
                        replies: {
                            orderBy: {
                                posted_at: "asc",
                            },
                            skip: 0,
                            take: 0,
                        },
                        _count: {
                            select: {
                                replies: true,
                                comment_reactions: {
                                    where: {
                                        islike: true,
                                    }
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    }
                },

            }

        })

        console.log("foundPost");
        console.log(foundPost);

        if (!foundPost) {
            return res.status(401).json({
                message: `Content not found`,
            });
        }

        res.status(200).json(foundPost);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }

})






module.exports = {
    createPost,
    deletePost,
    getPostById,
    addReaction,
    getComments,
}







