const asyncHandler = require("express-async-handler");
// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const { User } = require("../config/roleList");
const prisma = new PrismaClient();


const getForumDetails = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const take = req.query.take ? parseInt(req.query.take) : 0;

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
                id: id,
            },
            include: {
                posts: {
                    include: {
                        post_reactions: {
                            where: {
                                user_id: user.id,
                            },
                            select: {
                                islike: true,
                            },
                        },
                        comments: {
                            include: {
                                comment_reactions: {
                                    where: {
                                        user_id: user.id,
                                    },
                                    select: {
                                        islike: true,
                                    },
                                },
                            },
                        },
                    },
                },

            },
        })

        if (!foundForum) {
            return res.status(404).json({
                message: `Forum not found`,
            });
        }

        res.status(200).json(foundForum);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }
})

const getPosts = asyncHandler(async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const take = req.query.take ? parseInt(req.query.take) : 10;


    try {
        const foundUser = await prisma.users.findFirst({
            where: {
                username: user,
            },
        });


        const foundForum = await prisma.forum.findFirst({
            where: {
                id: id,
            },
            include: {
                posts: {
                    include: {
                        post_reactions: {
                            where: {
                                user_id: user.id,
                            },
                            select: {
                                islike: true,
                            },
                        },
                        comments: {
                            include: {
                                comment_reactions: {
                                    where: {
                                        user_id: user.id,
                                    },
                                    select: {
                                        islike: true,
                                    },
                                },
                            },
                        },
                    },
                    skip: skip,
                    take: take,
                },

            },
        })

        if (!foundForum) {
            return res.status(404).json({
                message: `Forum not found`,
            });
        }

        res.status(200).json(foundForum.posts);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }
})



const addReaction = asyncHandler(async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const islike = JSON.parse(req.body.islike);

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

        const foundReaction = await prisma.post_reactions.findFirst({
            where: {
                user_id: foundUser.id,
                post_id: foundPost.id,
            },
        });

        if (foundReaction) {
            const updatedReaction = await prisma.post_reactions.update({
                where: {
                    id: foundReaction.id,
                },
                data: {
                    islike: islike,
                },
            });

            return res.status(200).json({
                message: `Reaction updated`,
                data: updatedReaction,
            });
        }

        const createdReaction = await prisma.post_reactions.create({
            data: {
                islike: islike,
                user_id: foundUser.id,
                post_id: foundPost.id,
                content_id: null,
            },
        });

        res.status(201).json({
            message: `Reaction created`,
            data: createdReaction,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }
})




module.exports = {
    getForumDetails,
    getPosts,
    addReaction,


}