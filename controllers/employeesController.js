const data = {
  employees: require("../models/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};
// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const { th } = require("date-fns/locale");
const { json } = require("express");
const prisma = new PrismaClient();

const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employees.findMany();
    res.json(employees);
  } catch (error) {
    throw error;
  }
};

const createNewEmployee = async (req, res) => {
  const { first_name, last_name } = req.body;

  if (!first_name || !last_name) {
    return res
      .status(400)
      .json({ message: "First and last names are required." });
  }

  const newEmployee = await prisma.employees.create({
    data: {
      first_name: first_name,
      last_name: last_name,
    },
  });

  res.status(201).json(newEmployee);
};

const updateEmployee = async (req, res) => {
  const {
    find_first_name,
    find_last_name,
    update_first_name,
    update_last_name,
  } = req.body;

  if (
    !find_first_name ||
    !find_last_name ||
    !update_first_name ||
    !update_last_name
  ) {
    return res.status(400).json({ message: "Some arguments are missing" });
  }
  try {
    // find employee registered or not
    const foundEmployee = await prisma.employees.findFirst({
      where: {
        first_name: find_first_name,
        last_name: find_last_name,
      },
    });

    if (!foundEmployee) {
      return res.status(400).json({
        message: `Employee ${find_first_name} ${find_last_name} not found`,
      });
    }
    const updatedEmployee = await prisma.users.update({
      where: {
        first_name: find_first_name,
        last_name: find_last_name,
      },
      data: {
        first_name: update_first_name,
        last_name: update_last_name,
      },
    });

    res.json(updatedEmployee);
  } catch (error) {
    throw error;
  }
};

const deleteEmployee = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // find user registered or not
    const foundEmployee = await prisma.users.findFirst({
      where: {
        id: id,
      },
    });
    if (!foundEmployee) {
      return res
        .status(400)
        .json({ message: `Employee ${req.params.first_name} not found` });
    }

    const deleteEmployee = await prisma.users.delete({
      where: { id: id },
    });

    res.json({
      message: `Employee ${req.params.foundEmployee.first_name} deleted`,
    });
  } catch (error) {
    throw error;
  }
};

const getEmployee = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // find user registered or not
    const foundEmployee = await prisma.users.findFirst({
      where: {
        id: id,
      },
    });
    if (!foundEmployee) {
      return res
        .status(400)
        .json({ message: `Employee ${req.params.first_name} not found` });
    }
    res / json(foundEmployee);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
