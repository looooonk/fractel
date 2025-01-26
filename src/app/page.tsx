import { FaGear } from "react-icons/fa6";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { LuMenu } from "react-icons/lu";

import { Course } from "../models/courseSchema";

// TODO: Replace with dynamic course lists
const courses: Course[] = [
  {
    subjectName: "Computer Science",
    shortenedSubjectName: "CS",
    courseNumber: 101,
    courseName: "Introduction to Programming",
    courseSelectionId: 1,
    courseSelectionSpecifier: "A",
    creditHours: 3,
    professor: "Dr. John Smith",
    professorRating: 4.8,
    courseStartTime: 900,
    courseEndTime: 1030,
    courseDuration: 90,
    courseStartDate: 20240115,
    courseEndDate: 20240501,
    courseBuilding: "Engineering Hall",
    courseRoom: 101,
    courseDays: "MWF",
    courseLevel: false,
    courseSemester: "Spring 2024",
    courseColor: "#FF5733",
    coursePrerequisites: "None",
    courseCorequisites: "None",
    courseSpecialNotes: "Laptop required",
  },
  {
    subjectName: "Mathematics",
    shortenedSubjectName: "MATH",
    courseNumber: 201,
    courseName: "Calculus I",
    courseSelectionId: 2,
    courseSelectionSpecifier: "B",
    creditHours: 4,
    professor: "Dr. Alice Johnson",
    professorRating: 4.5,
    courseStartTime: 1100,
    courseEndTime: 1230,
    courseDuration: 90,
    courseStartDate: 20240115,
    courseEndDate: 20240501,
    courseBuilding: "Science Hall",
    courseRoom: 202,
    courseDays: "TR",
    courseLevel: true,
    courseSemester: "Spring 2024",
    courseColor: "#33A1FF",
    coursePrerequisites: "Pre-Calculus",
    courseCorequisites: "None",
    courseSpecialNotes: "Scientific calculator required",
  },
  {
    subjectName: "Physics",
    shortenedSubjectName: "PHYS",
    courseNumber: 301,
    courseName: "General Physics",
    courseSelectionId: 3,
    courseSelectionSpecifier: "C",
    creditHours: 3,
    professor: "Dr. Mark Taylor",
    professorRating: 4.3,
    courseStartTime: 1300,
    courseEndTime: 1430,
    courseDuration: 90,
    courseStartDate: 20240115,
    courseEndDate: 20240501,
    courseBuilding: "Physics Building",
    courseRoom: 305,
    courseDays: "MW",
    courseLevel: true,
    courseSemester: "Spring 2024",
    courseColor: "#FF33A1",
    coursePrerequisites: "Calculus I",
    courseCorequisites: "None",
    courseSpecialNotes: "Lab sessions required",
  },
  {
    subjectName: "History",
    shortenedSubjectName: "HIST",
    courseNumber: 102,
    courseName: "World History",
    courseSelectionId: 4,
    courseSelectionSpecifier: "D",
    creditHours: 3,
    professor: "Dr. Emma Davis",
    professorRating: 4.6,
    courseStartTime: 900,
    courseEndTime: 1030,
    courseDuration: 90,
    courseStartDate: 20240115,
    courseEndDate: 20240501,
    courseBuilding: "Humanities Building",
    courseRoom: 102,
    courseDays: "TR",
    courseLevel: false,
    courseSemester: "Spring 2024",
    courseColor: "#A1FF33",
    coursePrerequisites: "None",
    courseCorequisites: "None",
    courseSpecialNotes: "Group projects required",
  },
  {
    subjectName: "Chemistry",
    shortenedSubjectName: "CHEM",
    courseNumber: 210,
    courseName: "Organic Chemistry",
    courseSelectionId: 5,
    courseSelectionSpecifier: "E",
    creditHours: 4,
    professor: "Dr. Olivia White",
    professorRating: 4.2,
    courseStartTime: 1500,
    courseEndTime: 1630,
    courseDuration: 90,
    courseStartDate: 20240115,
    courseEndDate: 20240501,
    courseBuilding: "Science Hall",
    courseRoom: 203,
    courseDays: "MW",
    courseLevel: true,
    courseSemester: "Spring 2024",
    courseColor: "#FFAA33",
    coursePrerequisites: "General Chemistry",
    courseCorequisites: "None",
    courseSpecialNotes: "Lab coat required",
  },
];

const days = ["M", "T", "W", "R", "F"];

export default function Home() {
  let currentSemester = "Spring 2025";
  let numSchedules = 1;
  let curScheduleIndex = 1;

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  };

  return (
    <div className="flex w-full h-screen bg-white p-5 space-x-5">
      {/* Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Semester */}
        <div className="flex items-center space-x-2 mb-2 text-lg font-bold">
          <p>{currentSemester}</p>
          <LuMenu className="text-black cursor-pointer text-base" />
        </div>

        {/* Top Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Settings */}
          <div className="flex items-center">
            <FaGear className="text-black cursor-pointer text-base" />
          </div>

          {/* Calendar Options */}
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-2">
              <BiSolidLeftArrow className="text-black cursor-pointer text-base" />
              <p className="text-black font-semibold">Schedule {curScheduleIndex} / {numSchedules}</p>
              <BiSolidRightArrow className="text-black cursor-pointer text-base" />
            </div>
            <FaPlus className="text-black cursor-pointer text-base" />
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 bg-gray-100 border border-gray-300 rounded-md h-[60%] relative overflow-hidden">
          <div className="grid grid-cols-[3rem_repeat(5,1fr)] h-full">
            {/* Scrollable Days and Grid */}
            <div className="col-span-6 overflow-auto relative no-scrollbar">
              {/* Sticky Days Header */}
              <div className="grid sticky top-0 bg-gray-100 z-10"
                style={{
                  gridTemplateColumns: "repeat(5, 1fr) 0.5fr",
                }}
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", ""].map((day) => (
                  <div key={day} className="text-center py-2 font-bold border-b border-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Scrollable Grid */}
              <div className="relative">
                {Array.from({ length: 26 }).map((_, timeIndex) => (
                  <div key={timeIndex}>
                    <div
                      className={`absolute left-0 text-right right-0 ${
                        timeIndex % 2 === 0 ? "border-t border-gray-400" : "border-t border-gray-300"
                      }`}
                      style={{ top: `${(timeIndex * 100) / 26}%`, right:"9.2%" }}
                    / >
                    <p className="absolute text-left right-0 pr-2 text-sm"
                    style={{ top: `${(timeIndex * 100) / 26}%`, left:"91.8%", marginTop: "-8px"}}>
                      {(timeIndex == 0 ? "" : ((timeIndex > 11 ? (Math.floor(7 + timeIndex * 0.5 - 12)) : (Math.floor(7 + timeIndex * 0.5))) < 10 ? "0" : "") + (timeIndex > 11 ? (Math.floor(7 + timeIndex * 0.5 - 12)) : (Math.floor(7 + timeIndex * 0.5))) + (timeIndex % 2 == 1 ? ":30" : ":00") + (timeIndex > 9 ? " PM" : " AM"))}
                    </p>
                  </div>
                ))}
                <div
                  className="grid h-[800]"
                  style={{
                    gridTemplateColumns: "repeat(5, 1fr) 0.5fr",
                  }}
                >
                  {Array.from({ length: 5 }).map((_, dayIndex) => (
                    <div key={dayIndex} className="border-r border-gray-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Results, and Overview */}
      <div className="w-1/3 flex flex-col space-y-[3%]">
        {/* Search Bar */}
        <div className="h-[10%] bg-gray-200 border border-gray-300 rounded-md p-2">
            <input
              type="text"
              placeholder="Search courses, professors, or numbers"
              className="w-full h-full p-2 text-black border-none outline-none rounded-md"
            />
        </div>
        {/* Search Results */}
        <div className="h-[60%] bg-gray-100 border border-gray-300 rounded-md p-2 overflow-y-auto">
          {courses.map((course) => (
            <div
              key={course.courseSelectionId}
              className="p-2 mb-2 border rounded-md bg-white"
            >
              <h4 className="font-bold">
                {course.courseName}{" "}
                <span className="text-xs text-gray-500 font-mono ml-2">
                  {course.shortenedSubjectName} {course.courseNumber} {course.courseSelectionSpecifier}
                </span>
              </h4>
              <div className="flex justify-between mb-4 text-sm">
                <p>{course.professor}</p>
                <p className="text-gray-700 text-right">{course.creditHours} Credits</p>
              </div>
              <div className="flex justify-between items-center">
                {/* Day boxes */}
                <div className="flex space-x-1">
                  {days.map((day) => (
                    <div
                      key={day}
                      className={`text-xs w-5 h-5 flex items-center justify-center border border-black ${
                        course.courseDays.includes(day) ? "bg-gray-300" : "bg-white"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time */}
                <p className="text-sm text-gray-700 font-mono">
                  {formatTime(course.courseStartTime)} - {formatTime(course.courseEndTime)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <div className="h-[30%] bg-gray-200 border border-gray-300 rounded-md p-4">
          <h3 className="font-bold mb-2">Selected Classes</h3>
          <ul className="mb-2 flex flex-wrap gap-0">
            {courses.map((course) => (
              <li
                key={course.courseSelectionId}
                className="inline-block px-1 py-1 bg-gray-200 rounded-md"
              >
                {course.shortenedSubjectName} {course.courseNumber}
              </li>
            ))}
          </ul>
          <p>Total Credit Hours: {courses.reduce((acc, cur) => acc + cur.creditHours, 0)}</p>
          <p>
            Average Professor Rating:{" "}  
            {(
              courses.reduce((acc, cur) => acc + cur.professorRating, 0) / courses.length
            ).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}