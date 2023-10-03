//import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const { or } = require("../../validators/student/personalInfoValidator");

// const courseregisterFormSchema = require("../../validators/courseregisterValidator");


const getAllCoursesForStudent = async (req, res) => {
    const user = req.user
    const search = req.query.search ? req.query.search.toLowerCase() : "";
    const grade = req.query.grade ? req.query.grade : "";
    const subject = req.query.subject ? req.query.subject : "";
    const skip = req.query.skip ? parseInt(req.query.skip) : undefined;
    const take = req.query.take ? parseInt(req.query.take) : undefined;


    //todo: add recommendation parameters for student
    console.log(req.query)

    let whereConditions = {}

    //prepare where condition
    if (search || grade || subject) {
        whereConditions = {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    subject: {
                        contains: subject ? subject : search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    grade: {
                        contains: grade ? grade : search,
                        mode: 'insensitive', // Default value: default
                    }
                }
            ]
        }
    } else {
        whereConditions = {}
    }

    try {
        console.log("here")
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const tutorId = user.id;

        const courses = await prisma.courses.findMany({
            skip: skip,
            take: take,
            where: whereConditions,
            include: {
                tutor: {
                    select: {
                        qualifications: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                profile_picture: true
                            }
                        }
                    }
                }
            }

        });

        res.json(courses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getAllEnrolledCoursesForStudent = async (req, res) => {
    const user = req.user
    const search = req.query.search ? req.query.search.toLowerCase() : "";
    const grade = req.query.grade ? req.query.grade : "";
    const subject = req.query.subject ? req.query.subject : "";
    const skip = req.query.skip ? parseInt(req.query.skip) : undefined;
    const take = req.query.take ? parseInt(req.query.take) : undefined;


    //todo: add recommendation parameters for student
    console.log(req.query)

    let whereConditions = {}

    //prepare where condition
    if (search || grade || subject) {
        whereConditions = {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    subject: {
                        contains: subject ? subject : search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    grade: {
                        contains: grade ? grade : search,
                        mode: 'insensitive', // Default value: default
                    }
                }
            ],
            student_enrolled_course: {
                some: {
                    student: {
                        username: user
                    }
                }
            }
        }
    } else {
        whereConditions = {
            student_enrolled_course: {
                some: {
                    student: {
                        username: user
                    }
                }
            }
        }
    }

    try {
        console.log("here")
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const tutorId = user.id;

        const courses = await prisma.courses.findMany({
            skip: skip,
            take: take,
            where: whereConditions,
            include: {
                tutor: {
                    select: {
                        qualifications: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                profile_picture: true
                            }
                        }
                    }
                }
            }

        });

        res.json(courses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getAllStudyPacksForStudent = async (req, res) => {
    const user = req.user
    const search = req.query.search ? req.query.search.toLowerCase() : "";
    const grade = req.query.grade ? req.query.grade : "";
    const subject = req.query.subject ? req.query.subject : "";
    const skip = req.query.skip ? parseInt(req.query.skip) : undefined;
    const take = req.query.take ? parseInt(req.query.take) : undefined;


    //todo: add recommendation parameters for student
    console.log(req.query)

    let whereConditions = {}

    //prepare where condition
    if (search || grade || subject) {
        whereConditions = {
            type: 'PAID',
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    subject: {
                        contains: subject ? subject : search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    grade: {
                        contains: grade ? grade : search,
                        mode: 'insensitive', // Default value: default
                    }
                }
            ]
        }
    } else {
        whereConditions = {
            type: 'PAID'
        }
    }

    try {
        console.log("here")
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const tutorId = user.id;

        const studyPacks = await prisma.study_pack.findMany({
            skip: skip,
            take: take,
            where: whereConditions,
            include: {
                tutor: {
                    select: {
                        qualifications: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                profile_picture: true
                            }
                        }
                    }
                }
            }

        });

        res.json(studyPacks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getAllPurchasedStudyPacksForStudent = async (req, res) => {
    const user = req.user
    const search = req.query.search ? req.query.search.toLowerCase() : "";
    const grade = req.query.grade ? req.query.grade : "";
    const subject = req.query.subject ? req.query.subject : "";
    const skip = req.query.skip ? parseInt(req.query.skip) : undefined;
    const take = req.query.take ? parseInt(req.query.take) : undefined;


    //todo: add recommendation parameters for student
    console.log(req.query)

    let whereConditions = {}

    //prepare where condition
    if (search || grade || subject) {
        whereConditions = {
            type: 'PAID',
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    subject: {
                        contains: subject ? subject : search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    grade: {
                        contains: grade ? grade : search,
                        mode: 'insensitive', // Default value: default
                    }
                }
            ],
            student_purchase_studypack: {
                some: {
                    student: {
                        username: user
                    }
                }
            }
        }
    } else {
        whereConditions = {
            type: 'PAID',
            student_purchase_studypack: {
                some: {
                    student: {
                        username: user
                    }
                }
            }
        }
    }

    try {
        console.log("here")
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const tutorId = user.id;

        const studyPacks = await prisma.study_pack.findMany({
            skip: skip,
            take: take,
            where: whereConditions,
            include: {
                tutor: {
                    select: {
                        qualifications: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                profile_picture: true
                            }
                        }
                    }
                }
            }

        });

        res.json(studyPacks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getAllTutorsForStudent = async (req, res) => {
    const user = req.user
    const search = req.query.search ? req.query.search.toLowerCase() : "";
    const grade = req.query.grade ? req.query.grade : "";
    const subject = req.query.subject ? req.query.subject : "";
    const skip = req.query.skip ? parseInt(req.query.skip) : undefined;
    const take = req.query.take ? parseInt(req.query.take) : undefined;


    //todo: add recommendation parameters for student
    console.log(req.query)

    let whereConditions = {}

    //prepare where condition
    if (search || grade || subject) {
        whereConditions = {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive', // Default value: default
                    }
                },
                {
                    subjects: {
                        has: subject ? subject : search,
                        mode: 'insensitive', // Default value: default
                    }
                }
            ]
        }
    } else {
        whereConditions = {
        }
    }

    try {
        console.log("here")
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const tutorId = user.id;

        const tutors = await prisma.tutor.findMany({
            skip: skip,
            take: take,
            where: whereConditions,
            include: {
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        profile_picture: true
                    }
                },
                _count: {
                    select: {
                        courses: true,
                        study_pack: true
                    }
                }
            }

        });

        res.json(tutors);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getCourseById = async (req, res) => {
    const user = req.user
    const courseId = req.params.courseId;

    try {
        console.log("here")
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const tutorId = user.id;

        const course = await prisma.courses.findUnique({
            where: {
                id: courseId
            },
            include: {
                tutor: {
                    select: {
                        qualifications: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                profile_picture: true
                            }
                        }
                    }
                },
                study_pack: {
                    orderBy: {
                        start_date: 'asc'
                    },
                    select: {
                        id: true,
                        title: true,
                        content_ids: true,
                        student_purchase_studypack: {
                            where: {
                                student: {
                                    username: user
                                }
                            }
                        },
                        start_date: true,
                        expire_date: true,
                    }
                },
                student_enrolled_course: {
                    where: {
                        student: {
                            username: user
                        }
                    }
                }
            }

        });

        res.json(course);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getStudyPackById = async (req, res) => {
    const user = req.user
    const studyPackId = req.params.studyPackId;

    try {
        console.log("here")
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const tutorId = user.id;

        const course = await prisma.study_pack.findUnique({
            where: {
                id: studyPackId
            },
            include: {
                tutor: {
                    select: {
                        medium: true,
                        subjects: true,
                        description: true,
                        qualifications: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                profile_picture: true
                            }
                        }
                    }
                },
                student_purchase_studypack: {
                    where: {
                        student: {
                            username: user
                        }
                    },
                    orderBy: {
                        purchased_at: 'desc'
                    }
                }

            }

        });

        res.json(course);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getStudyPackContent = async (req, res) => {
    const user = req.user
    const studyPackId = req.params.studyPackId;

    try {
        console.log("here")
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const contentIds = await prisma.study_pack.findUnique({
            where: {
                id: studyPackId
            },
            select: {
                content_ids: true
            }
        });

        //get content
        var studypackContent = {};
        var orCondition = [];
        var orConditionQuizzes = [];

        contentIds.content_ids.forEach(async (contentId) => {
            orCondition.push({
                id: {
                    in: contentId.video_id
                }
            })

            orCondition.push({
                id: {
                    in: contentId.tute_id
                }
            })
        });

        const content = await prisma.content.findMany({
            where: {
                OR: orCondition
            }
        });

        contentIds.content_ids.forEach(async (contentId) => {
            orConditionQuizzes.push({
                id: {
                    in: contentId.quiz_id
                }
            })
        });

        const quizzes = await prisma.quiz.findMany({
            where: {
                OR: orConditionQuizzes
            }
        });


        //make content in a way to access using their id
        content.forEach((content) => {
            studypackContent[content.id] = content;
        })

        quizzes.forEach((quiz) => {
            studypackContent[quiz.id] = quiz;
        })

        res.json(studypackContent);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getCoursePayementDetailsByCourseId = async (req, res) => {
    const user = req.user
    const courseId = req.params.courseId;

    try {
        console.log("here")


        const Payments = await prisma.student_purchase_studypack.findMany({
            where: {
                pack: {
                    course_id: courseId
                },
            },
            orderBy: {
                pack: {
                    start_date: 'asc'
                }
            },
            include: {
                pack: {
                    select: {
                        id: true,
                        title: true,
                        start_date: true,
                        expire_date: true,
                    }
                }
            }

        });

        const currentDate = new Date();

        // check if the payment contains a record for the current month
        // if not, add a record for the current month
        const currentMonthPayment = Payments.find(payment => payment.pack.start_date.getMonth() === currentDate.getMonth());

        var nextPaymentDate

        if (!currentMonthPayment) {
            // set the next payment date to the first day of the current month
            nextPaymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        } else {
            // set the next payment date to the first day of the next month
            nextPaymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }

        // get the year and month of the next payment date
        const Year = nextPaymentDate.getFullYear();
        const Month = nextPaymentDate.getMonth() + 1;




        //next payment get from course study packs and get the one where start date is in this month
        const nextPayment = await prisma.courses.findUnique({
            where: {
                id: courseId
            },
            select: {
                study_pack: {
                    where: {
                        start_date: {
                            gte: new Date(Year, Month - 1, 1).toISOString()
                        }
                    },
                    orderBy: {
                        start_date: 'asc'
                    },
                    select: {
                        id: true,
                        title: true,
                        start_date: true,
                        expire_date: true,
                    }
                }
            }
        });

        const response = {
            payments: Payments,
            nextPayment: nextPayment.study_pack[0]
        }


        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const getPaymentDetailsByStudyPackId = async (req, res) => {
    const user = req.user
    const studyPackId = req.params.studyPackId;

    try {
        console.log("here")

        const foundUser = await prisma.users.findUnique({
            where: {
                username: user
            }
        });

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }


        const Payments = await prisma.student_purchase_studypack.findMany({
            where: {
                pack_id: studyPackId,
                student_id: foundUser.id
            },
            orderBy: {
                purchased_at: 'asc'
            },
            include: {
                pack: {
                    select: {
                        id: true,
                        title: true,
                        start_date: true,
                        expire_date: true,
                    }
                }
            }

        });

        res.json(Payments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const enrollToCourse = asyncHandler(async (req, res) => {
    const user = req.user;
    const courseId = req.params.courseId;

    try {
        const foundUser = await prisma.users.findUnique({
            where: {
                username: user
            }
        });

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const course = await prisma.courses.findUnique({
            where: {
                id: courseId
            }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const student = await prisma.students.findUnique({
            where: {
                student_id: foundUser.id
            },
            include: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentEnrolledCourse = await prisma.student_enrolled_course.findUnique({
            where: {
                student_id_course_id: {
                    student_id: student.user.id,
                    course_id: course.id
                }
            }
        });

        if (studentEnrolledCourse) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        const newStudentEnrolledCourse = await prisma.student_enrolled_course.create({
            data: {
                student: {
                    connect: {
                        id: student.user.id
                    }
                },
                course: {
                    connect: {
                        id: course.id
                    }
                }
            }
        });

        res.json(newStudentEnrolledCourse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



module.exports = {
    getAllCoursesForStudent,
    getAllStudyPacksForStudent,
    getAllTutorsForStudent,
    getCourseById,
    getStudyPackContent,
    enrollToCourse,
    getCoursePayementDetailsByCourseId,
    getAllEnrolledCoursesForStudent,
    getAllPurchasedStudyPacksForStudent,
    getStudyPackById,
    getPaymentDetailsByStudyPackId
}