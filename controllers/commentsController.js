const asyncHandler = require("express-async-handler");
// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const { User } = require("../config/roleList");
const prisma = new PrismaClient();

const getCommentsByContent = asyncHandler(async (req, res) => {
    try {

    } catch (error) {

    }
})


const getReplyComments = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const except = req.body.except ? req.body.except : [];
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;


        const foundComments = await prisma.comments.findMany({
            where: {
                parent_id: id,
                id: {
                    notIn: except,
                },
            },
            skip: skip,
            take: limit,
            orderBy: {
                posted_at: "asc",
            },
            include: {
                commenter: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        username: true,
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
                _count: {
                    select: {
                        comment_reactions: true,
                    },
                },
            },
        })

        if (!foundComments) {
            return res.status(401).json({
                message: `No comments found`,
            });
        }


        res.status(200).json(foundComments);

    } catch (error) {
        res.status(500).json({
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


        // Check if the comment exists in the database and find the user's reaction for the comment in a single query
        const commentWithReaction = await prisma.comments.findFirst({
            where: {
                id: id,
            },
            include: {
                comment_reactions: {
                    where: {
                        user_id: foundUser.id,
                    },
                },
            },
        });

        if (!commentWithReaction) {
            // Return 404 status if the comment is not found
            return res.status(404).json({
                message: `Comment not found`,
            });
        }

        // Check if the user already has a reaction for the comment
        const foundReaction = commentWithReaction.comment_reactions[0];

        if (foundReaction) {
            if (foundReaction.islike === islike) {
                await prisma.comment_reactions.delete({
                    where: {
                        user_id_comment_id: {
                            user_id: foundReaction.user_id,
                            comment_id: id,
                        }
                    },
                })

                res.status(200).json({
                    message: `Reaction removed`,
                    // data: []
                });
            } else {
                await prisma.comment_reactions.update({
                    where: {
                        user_id_comment_id: {
                            user_id: foundReaction.user_id,
                            comment_id: id,
                        }
                    },
                    data: {
                        islike: islike,
                    },
                })

                const updatedReaction = await prisma.comment_reactions.findFirst({
                    where: {
                        user_id: foundReaction.user_id,
                        comment_id: id,
                    },
                })


                res.status(200).json({
                    message: `Reaction updated`,
                    // data: updatedReaction
                });
            }


        } else {
            const createdReaction = await prisma.comment_reactions.create({
                data: {
                    islike: islike,
                    user_id: foundUser.id,
                    comment_id: id,
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

const createParentComment = asyncHandler(async (req, res) => {
    const user = req.user;
    const { message } = req.body;
    const parent_id = null
    const replied_to = null
    const contentId = req.params.contentId ? req.params.contentId : null;
    const post_id = req.params.post_id ? req.params.post_id : null;

    console.log(req.body);
    // console.log(contentId, post_id, message);

    try {

        if (!contentId && !post_id) {
            return res.status(400).json({
                message: `Bad request`,
            });
        }

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

        // if(!contentId && post_id){
        //     const foundPost = await prisma.posts.findFirst({
        //         where: {
        //             id: post_id,
        //         },
        //     });

        //     if (!foundPost) {
        //         return res.status(404).json({
        //             message: `Post not found`,
        //         });
        //     }
        // }

        const createdComment = await prisma.comments.create({
            data: {
                message: message,
                user_id: foundUser.id,
                content_id: contentId,
                post_id: post_id,
                parent_id: parent_id,
                replied_to: replied_to,
            },
            //return the commenter's first and last name
            include: {
                commenter: {
                    select: {
                        id: true,
                        username: true,
                        first_name: true,
                        last_name: true,
                    },
                },
                replies: {
                    skip: 0,
                    take: 0,
                },
                comment_reactions: {
                    where: {
                        user_id: foundUser.id,
                    },
                    select: {
                        islike: true,
                    },
                },
                _count: {
                    select: {
                        comment_reactions: true,
                        replies: true,
                    },
                },
            }
        });

        res.status(201).json({
            message: `Comment created`,
            data: createdComment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }

})

const createReplyComment = asyncHandler(async (req, res) => {
    const user = req.user;
    const { message, replied_to } = req.body;
    var parent_id = null;
    const comment_id = req.params.id;

    console.log(req.body);
    console.log(message)



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

        const foundComment = await prisma.comments.findFirst({
            where: {
                id: comment_id,
            },
        });

        if (!foundComment) {
            return res.status(404).json({
                message: `Comment not found`,
            });
        }

        if (foundComment.parent_id === null) {
            parent_id = comment_id
        } else {
            parent_id = foundComment.parent_id
        }

        console.log(foundComment.content_id)

        const createdComment = await prisma.comments.create({
            data: {
                message: message,
                user_id: foundUser.id,
                content_id: foundComment.content_id ? foundComment.content_id : null,
                post_id: foundComment.post_id ? foundComment.post_id : null,
                parent_id: parent_id,
                replied_to: replied_to ? replied_to : null,
            },
            include: {
                commenter: {
                    select: {
                        id: true,
                        username: true,
                        first_name: true,
                        last_name: true,
                    },
                },
                comment_reactions: {
                    where: {
                        user_id: foundUser.id,
                    },
                    select: {
                        islike: true,
                    },
                },
                _count: {
                    select: {
                        comment_reactions: true,
                        replies: true,
                    },
                },

            },
        });

        res.status(201).json({
            message: `Comment created`,
            data: createdComment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }

})



const deleteComment = asyncHandler(async (req, res) => {
    const { user, comment_id } = req.body;

    try {

        //find comment with user
        const commentWithUser = await prisma.comments.findFirst({
            where: {
                id: comment_id,
            },
            include: {
                commenter: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        if (!commentWithUser) {
            return res.status(404).json({
                message: `Comment not found`,
            });
        }

        if (commentWithUser.commenter.username !== user) {
            return res.status(401).json({
                message: `Unauthorized`,
            });
        }

        const deletedComment = await prisma.comments.delete({
            where: {
                id: comment_id,
            },
        });

        res.status(200).json({
            message: `Comment deleted`,
            data: deletedComment
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }
})









module.exports = {
    getCommentsByContent,
    getReplyComments,
    addReaction,
    createParentComment,
    createReplyComment,
    deleteComment,
}