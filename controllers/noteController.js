const asyncHandler = require("express-async-handler");
// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getNotes = asyncHandler(async (req, res) => {
    try {
        const notes = await prisma.notes.findMany()
        console.log(notes);

        res.json(notes);
    } catch (error) {
        throw error
    }
})

module.exports = {
    getNotes
}