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

        //structure data to send
        const course = {
            id: foundCourse.id,
            title: foundCourse.title,
            description: foundCourse.description,
            tutor: {
                id: foundCourse.tutor.id,
                name: `${foundCourse.tutor.user.first_name} ${foundCourse.tutor.user.last_name}`,
                medum: foundCourse.tutor.medium,
                school: foundCourse.tutor.school,
                subjects: foundCourse.tutor.subjects,
                qualifications: foundCourse.tutor.qualifications,
            },
            forum: {
                id: foundCourse.forum[0].id,
                title: foundCourse.forum[0].title,
            },
        }


        res.status(200).json(course);

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