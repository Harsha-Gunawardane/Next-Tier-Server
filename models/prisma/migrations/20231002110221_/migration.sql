-- CreateEnum
CREATE TYPE "content_type" AS ENUM ('TUTE', 'VIDEO');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('PUBLIC', 'PAID', 'HOLD');

-- CreateEnum
CREATE TYPE "available_status" AS ENUM ('AVAILABLE', 'PENDING', 'ERROR');

-- CreateEnum
CREATE TYPE "study_pack_type" AS ENUM ('NORMAL', 'PAID');

-- CreateEnum
CREATE TYPE "visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "payment_type" AS ENUM ('ONLINE', 'PHYSICAL');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "payment_for" AS ENUM ('EXTEND', 'PURCHASE');

-- CreateEnum
CREATE TYPE "course_visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "course_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "schedule_type" AS ENUM ('RECURRING', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "complaint_type" AS ENUM ('COURSE_RELATED', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('NEW', 'IN_ACTION');

-- CreateEnum
CREATE TYPE "attachment_type" AS ENUM ('IMAGE', 'DOCUMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "registration_id" INTEGER,
    "gender" TEXT,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT DEFAULT '',
    "NIC" TEXT,
    "join_date" TIMESTAMP(3) NOT NULL,
    "DOB" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "refresh_token" TEXT,
    "prefered_language" TEXT NOT NULL DEFAULT 'English',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_picture" TEXT NOT NULL DEFAULT 'https://th.bing.com/th/id/R.bae2d37c4317140a408aef6671346186?rik=2DNeSZ%2fD0xtseQ&pid=ImgRaw&r=0',
    "roles" JSONB NOT NULL,
    "otp" TEXT,
    "otp_expire_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password" (
    "username" TEXT NOT NULL,
    "otp_verified" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reset_password_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" TEXT NOT NULL,
    "grade" TEXT,
    "medium" TEXT NOT NULL DEFAULT 'Sinhala',
    "stream" TEXT,
    "emergency_contact" JSONB,
    "school" TEXT,
    "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weak_areas" JSONB,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "tutor" (
    "tutor_id" TEXT NOT NULL,
    "description" TEXT,
    "medium" TEXT[] DEFAULT ARRAY['Sinhala']::TEXT[],
    "school" TEXT,
    "subjects" TEXT[],
    "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email" TEXT NOT NULL,

    CONSTRAINT "tutor_pkey" PRIMARY KEY ("tutor_id")
);

-- CreateTable
CREATE TABLE "supporting_staff" (
    "staff_id" TEXT NOT NULL,
    "staff_title" TEXT NOT NULL,

    CONSTRAINT "supporting_staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "staffOnTutor" (
    "staff_id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "joined_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "no_marked_papers" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "staffOnTutor_pkey" PRIMARY KEY ("staff_id","tutor_id")
);

-- CreateTable
CREATE TABLE "admin" (
    "admin_id" TEXT NOT NULL,
    "emergency_No" TEXT NOT NULL,
    "admin_role" TEXT NOT NULL,
    "qualifications" TEXT[],

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "instStaff" (
    "inst_staff_id" TEXT NOT NULL,
    "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emergency_No" TEXT,

    CONSTRAINT "instStaff_pkey" PRIMARY KEY ("inst_staff_id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tute_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutes" (
    "id" TEXT NOT NULL,
    "folder_id" TEXT NOT NULL DEFAULT '',
    "user_name" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "recent_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT NOT NULL,
    "type" "content_type" DEFAULT 'VIDEO',
    "subject" TEXT NOT NULL DEFAULT '',
    "subject_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "uploaded_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "content_status" DEFAULT 'PUBLIC',
    "file_path" TEXT,
    "thumbnail" TEXT DEFAULT '',
    "reactions" JSONB DEFAULT '{}',
    "available_status" "available_status" DEFAULT 'AVAILABLE',

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_reactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL DEFAULT '',
    "islike" BOOLEAN,

    CONSTRAINT "content_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_views" (
    "user_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "watch_time" TEXT,

    CONSTRAINT "content_views_pkey" PRIMARY KEY ("user_id","content_id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content_id" TEXT DEFAULT '',
    "post_id" TEXT DEFAULT '',
    "message" TEXT NOT NULL,
    "parent_id" TEXT DEFAULT '',
    "replied_to" TEXT DEFAULT '',
    "reply_count" INTEGER NOT NULL DEFAULT 0,
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_reactions" (
    "user_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "islike" BOOLEAN,

    CONSTRAINT "comment_reactions_pkey" PRIMARY KEY ("user_id","comment_id")
);

-- CreateTable
CREATE TABLE "study_pack" (
    "id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "subject_areas" TEXT[],
    "thumbnail" TEXT,
    "type" "study_pack_type" NOT NULL,
    "visibility" "visibility" NOT NULL DEFAULT 'PRIVATE',
    "price" INTEGER NOT NULL,
    "access_period" JSONB DEFAULT '{}',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content_ids" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "public_ids" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "expire_date" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "month" TIMESTAMP(3),

    CONSTRAINT "study_pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_purchase_studypack" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "pack_id" TEXT NOT NULL,
    "reciept_location" TEXT NOT NULL,
    "ammount" INTEGER NOT NULL,
    "type" "payment_type" NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_date" TIMESTAMP(3) NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "payment_for" "payment_for" NOT NULL DEFAULT 'PURCHASE',

    CONSTRAINT "student_purchase_studypack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "monthly_fee" INTEGER NOT NULL,
    "visibility" "course_visibility" NOT NULL DEFAULT 'PRIVATE',
    "hall_id" TEXT,
    "content_ids" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "announcements" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studypack_ids" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "schedule" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "status" "course_status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrolled_course" (
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_enrolled_course_pkey" PRIMARY KEY ("student_id","course_id")
);

-- CreateTable
CREATE TABLE "papers" (
    "paper_id" TEXT NOT NULL,
    "course_id" TEXT DEFAULT '',
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subject" TEXT,
    "subject_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "papers_pkey" PRIMARY KEY ("paper_id")
);

-- CreateTable
CREATE TABLE "student_marks" (
    "student_id" TEXT NOT NULL,
    "paper_id" TEXT NOT NULL,
    "course_id" TEXT DEFAULT '',
    "marks" INTEGER DEFAULT 0,

    CONSTRAINT "student_marks_pkey" PRIMARY KEY ("student_id","paper_id")
);

-- CreateTable
CREATE TABLE "student_attendance" (
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "is_present" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "student_attendance_pkey" PRIMARY KEY ("student_id","course_id","date")
);

-- CreateTable
CREATE TABLE "halls" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "hall_profile" TEXT NOT NULL,
    "facilities" TEXT NOT NULL,
    "schedule" JSONB[] DEFAULT ARRAY[]::JSONB[],

    CONSTRAINT "halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_schedule" (
    "hall_id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "type" "schedule_type" NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "hall_schedule_pkey" PRIMARY KEY ("hall_id","day","start_time","end_time")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "complaint_type" NOT NULL,
    "course_id" TEXT,
    "action" TEXT DEFAULT '',
    "post_id" TEXT,
    "message" TEXT NOT NULL,
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcq_category" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number_of_questions" INTEGER NOT NULL,
    "question_ids" TEXT[],

    CONSTRAINT "mcq_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" TEXT NOT NULL,
    "course_id" TEXT DEFAULT '',
    "study_pack_id" TEXT,
    "title" TEXT NOT NULL,
    "schedule_time" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "duration" TEXT,
    "subject" TEXT NOT NULL,
    "subject_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "question_ids" TEXT[],
    "number_of_questions" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "difficulty_level" TEXT NOT NULL,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "explanation" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "subject_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "correct_answer" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_attempt_quiz" (
    "student_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "answers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "student_attempt_quiz_pkey" PRIMARY KEY ("student_id","quiz_id")
);

-- CreateTable
CREATE TABLE "student_generate_quiz" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "mcq_ids" TEXT[],
    "user_answers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "correct_answers" INTEGER[],
    "subject" TEXT NOT NULL,
    "quiz_name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "date" TIMESTAMP(3) NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "mark" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_generate_quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "forum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "forum_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactions" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_reactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL DEFAULT '',
    "islike" BOOLEAN,

    CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "type" "attachment_type" NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "votes" JSONB NOT NULL DEFAULT '{}',
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_follow_tutor" (
    "student_id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,

    CONSTRAINT "student_follow_tutor_pkey" PRIMARY KEY ("student_id","tutor_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT,
    "sender_id" TEXT NOT NULL,
    "reciver_id" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_schedule" (
    "id" TEXT NOT NULL,
    "schedule" JSONB NOT NULL DEFAULT '{}',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "reading_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "reset_password" ADD CONSTRAINT "reset_password_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor" ADD CONSTRAINT "tutor_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supporting_staff" ADD CONSTRAINT "supporting_staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffOnTutor" ADD CONSTRAINT "staffOnTutor_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "supporting_staff"("staff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffOnTutor" ADD CONSTRAINT "staffOnTutor_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instStaff" ADD CONSTRAINT "instStaff_inst_staff_id_fkey" FOREIGN KEY ("inst_staff_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutes" ADD CONSTRAINT "tutes_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reactions" ADD CONSTRAINT "content_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reactions" ADD CONSTRAINT "content_reactions_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_views" ADD CONSTRAINT "content_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_views" ADD CONSTRAINT "content_views_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_replied_to_fkey" FOREIGN KEY ("replied_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_pack" ADD CONSTRAINT "study_pack_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_pack" ADD CONSTRAINT "study_pack_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_purchase_studypack" ADD CONSTRAINT "student_purchase_studypack_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_purchase_studypack" ADD CONSTRAINT "student_purchase_studypack_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "study_pack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_course" ADD CONSTRAINT "student_enrolled_course_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_course" ADD CONSTRAINT "student_enrolled_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_marks" ADD CONSTRAINT "student_marks_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_marks" ADD CONSTRAINT "student_marks_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("paper_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hall_schedule" ADD CONSTRAINT "hall_schedule_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hall_schedule" ADD CONSTRAINT "hall_schedule_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attempt_quiz" ADD CONSTRAINT "student_attempt_quiz_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attempt_quiz" ADD CONSTRAINT "student_attempt_quiz_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum" ADD CONSTRAINT "forum_id_fkey" FOREIGN KEY ("id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll" ADD CONSTRAINT "poll_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_follow_tutor" ADD CONSTRAINT "student_follow_tutor_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_follow_tutor" ADD CONSTRAINT "student_follow_tutor_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_schedule" ADD CONSTRAINT "reading_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
