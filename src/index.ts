import { PrismaClient } from "@prisma/client";
import express from "express";
import { pid } from "process";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

/**
 * Get All Data in Table
 */
app.get("/allteacher", async (req, res) => {
  const teacher = await prisma.teacher.findMany();
  res.json(teacher);
});

app.get("/allcourse", async (req, res) => {
  const course = await prisma.course.findMany();
  res.json(course);
});

/**
 * Create Data in Table
 */
app.post(`/create/teacher`, async (req, res) => {
  const { email, first_name, last_name, country } = req.body;
  const {
    course_name,
    course_description,
    course_length,
    language,
  } = req.body.course;
  const today = new Date();
  const birthDate = new Date(req.body.date_of_birth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const result = await prisma.teacher.create({
    data: {
      email,
      first_name,
      last_name,
      age: age.toString(),
      date_of_birth: birthDate,
      country,
      course: {
        create: {
          course_name,
          course_description,
          course_length,
          language,
        },
      },
    },
  });
  res.json(result);
});

/**
 * Delete Data in Table
 */

app.delete(`/teacher/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.teacher.delete({
    where: { id: Number(id) },
  });
  res.json(post);
});

app.delete(`/course/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.course.delete({
    where: { id: Number(id) },
  });
  res.json(post);
});

/**
 * Update Data in Table
 */
app.put("/teacher/update/:id", async (req, res) => {
  const { id } = req.params;
  const { email, first_name, last_name, country } = req.body;
  const today = new Date();
  const birthDate = new Date(req.body.date_of_birth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const teacher = await prisma.teacher.update({
    where: { id: Number(id) },
    data: {
      email,
      first_name,
      last_name,
      age: age.toString(),
      date_of_birth: birthDate,
      country,
    },
  });
  res.json(teacher);
});

app.put("/course/update/:id", async (req, res) => {
  const { id } = req.params;
  const { course_name, course_description, course_length, language } = req.body;
  const result = await prisma.course.update({
    where: { id: Number(id) },
    data: {
      course_name,
      course_description,
      course_length,
      language,
    },
  });
  res.json(result);
});

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);
