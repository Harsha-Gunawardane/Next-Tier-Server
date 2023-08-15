const asyncHandler = require("express-async-handler");
// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const { User } = require("../config/roleList");
const prisma = new PrismaClient();


//videoStream
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const m3u8stream = require('m3u8stream');

const getAllContent = asyncHandler(async (req, res) => {
    try {

    } catch (error) {

    }
})

const getRecommendedContent = asyncHandler(async (req, res) => {
    try {

    } catch (error) {

    }
})

const getContentById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const take = req.query.take ? parseInt(req.query.take) : 5;

    if (id === undefined || id === null) {
        return res.status(401).json({
            message: `Content not found`,
        });
    }

    try {
        const foundUser = await prisma.users.findFirst({
            where: {
                username: user,
            },
        });

        if (!foundUser) {
            return res.status(401).json({
                message: `User not found`,
            });
        }


        const foundContent = await prisma.content.findUniqueOrThrow({
            where: {
                id: id,
            },
            include: {
                // Include comments along with an aggregation function to get the reply count for each comment isLike
                _count: {
                    select: {
                        comments: {
                            where: {
                                parent_id: null, // Fetch only top-level comments
                            },
                        },
                        content_views: true,
                        //counts of likes and dislikes. dislikes are false likes are true in the column
                        content_reactions: {
                            where: {
                                islike: true,
                            },
                        },
                        // comments: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
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
                                user_id: foundUser.id,
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
                content_reactions: {
                    where: {
                        user_id: foundUser.id,
                    },
                },
            }

        })

        if (!foundContent) {
            return res.status(401).json({
                message: `Content not found`,
            });
        }

        const contentDetails = {
            id: foundContent.id,
            title: foundContent.title,
            description: foundContent.description,
            uploader: foundContent.user,
            type: foundContent.type,
            subject: foundContent.subject,
            subject_areas: foundContent.subject_areas,
            uploadDate: foundContent.uploaded_at,
            status: foundContent.status,
            file_path: foundContent.file_path,
            thumbnail: foundContent.thumbnail,
            reactions: foundContent.reactions,
            comments: foundContent.comments,
            likes: foundContent._count.content_reactions,
            views: foundContent._count.content_views,
            commentCount: foundContent._count.comments,
            liked: foundContent.content_reactions.length > 0 ? foundContent.content_reactions[0].islike : null,
        }

        // console.log("contentDetails");
        // console.log(foundContent);
        res.status(200).json(contentDetails);

    } catch (error) {
        console.log(error);
    }
})

const addReaction = asyncHandler(async (req, res) => {
    const user = req.user;
    const id = req.params.id ? req.params.id : null;
    console.log("HERE")
    const islike = JSON.parse(req.body.islike);

    try {

        const foundUser = await prisma.users.findFirst({
            where: {
                username: user,
            },
        });


        // Check if the comment exists in the database and find the user's reaction for the comment in a single query
        const contentWithReaction = await prisma.content.findFirst({
            where: {
                id: id,
            },
            include: {
                content_reactions: {
                    where: {
                        user_id: foundUser.id,
                    },
                },
            },
        });

        if (!contentWithReaction) {
            // Return 404 status if the content is not found
            return res.status(404).json({
                message: `Content not found`,
            });
        }

        console.log(contentWithReaction);
        // Check if the user already has a reaction for the content
        const foundReaction = contentWithReaction.content_reactions[0];

        if (foundReaction) {
            if (foundReaction.islike === islike) {
                await prisma.content_reactions.delete({
                    where: {
                        id: foundReaction.id,
                    },
                })

                res.status(200).json({
                    message: `Reaction removed`,
                    // data: []
                });
            } else {
                await prisma.content_reactions.update({
                    where: {
                        id: foundReaction.id,
                    },
                    data: {
                        islike: islike,
                    },
                })

                const updatedReaction = await prisma.content_reactions.findFirst({
                    where: {
                        user_id: foundReaction.user_id,
                        content_id: id,
                    },
                })


                res.status(200).json({
                    message: `Reaction updated`,
                    // data: updatedReaction
                });
            }


        } else {
            const createdReaction = await prisma.content_reactions.create({
                data: {
                    islike: islike,
                    user_id: foundUser.id,
                    content_id: id,
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

const getComments = asyncHandler(async (req, res) => {
    // console.log("getComments");
    const id = req.params.id;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const take = req.query.take ? parseInt(req.query.take) : 10;

    console.log(req.query);
    console.log(id);

    if (id === undefined || id === null) {
        return res.status(401).json({
            message: `Content not found`,
        });
    }


    try {
        const foundContent = await prisma.content.findFirst({
            where: {
                content_id: id,
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

        console.log("foundContent");
        console.log(foundContent);

        if (!foundContent) {
            return res.status(401).json({
                message: `Content not found`,
            });
        }

        res.status(200).json(foundContent);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }

})

const test = asyncHandler(async (req, res) => {
    console.log("test");

    return res.status(200).json({
        message: `test`,
    });

})

const uploadVideo = asyncHandler(async (req, res) => {
    console.log("uploadVideo");

    return res.status(200).json({
        message: `uploadVideo`,
    });

})

// controllers/contentController.js


const serveHLS = (req, res) => {
    console.log(req.params);
    const hlsFilePath = path.join(__dirname, `../uploads/videos/${req.params.videoName}/hls/output.m3u8`);
    console.log(hlsFilePath);
    fs.readFile(hlsFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error reading HLS manifest');
        } else {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.send(data);
        }
    });

    res.status(201)
};


const serveHLSSegment = (req, res) => {
    console.log(req.params);
    const videoName = req.params.videoName;
    const segmentName = req.params.segmentName;
    const segmentFilePath = path.join(__dirname, `../uploads/videos/${videoName}/hls/${segmentName}`);
    console.log(segmentFilePath);

    fs.readFile(segmentFilePath, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error reading HLS segment');
        } else {
            res.setHeader('Content-Type', 'video/MP2T');
            res.send(data);
        }
    });

    // res.sendFile(segmentFilePath);
};






module.exports = {
    getContentById,
    getAllContent,
    getRecommendedContent,
    addReaction,
    getComments,
    uploadVideo,
    test,
    serveHLS,
    serveHLSSegment
}