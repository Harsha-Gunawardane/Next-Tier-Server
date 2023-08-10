const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { User } = require("../config/roleList");
const prisma = new PrismaClient();


const createPost = asyncHandler(async (req, res) => {
    const user = req.user;
    const { title, message, attachement } = req.body;
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
            },
        });


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


module.exports = {
    createPost,
    deletePost,
    getPostById,
}







