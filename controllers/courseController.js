const asyncHandler = require("express-async-handler");
// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const { User } = require("../config/roleList");
const prisma = new PrismaClient();

const getAllCourses = asyncHandler(async (req, res) => {
    try {
        const courses = await prisma.courses.findMany();
        console.log(courses);

        res.json(courses);
    } catch (error) {
        throw error;
    }
});


const getCourseById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
        const foundCourse = await prisma.courses.findFirst({
            where: {
                id: id,
            },
            include: {
                tutor: {
                    include: {
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                            }
                        }
                    }
                },
                forum: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
            },
        })

        if (!foundCourse) {
            return res.status(404).json({
                message: `Course not found`,
            });
        }

        res.status(200).json(foundCourse);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error: ${error.message}`,
        });
    }
})





module.exports = {
    getAllCourses,
    getCourseById,
}