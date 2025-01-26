export interface Course {
    subjectName: string;
    shortenedSubjectName: string;
    courseNumber: number;
    courseName: string;
    courseSelectionId: number;
    courseSelectionSpecifier: string;
    creditHours: number;
    professor: string;
    professorRating: number;
    courseStartTime: number;
    courseEndTime: number;
    courseDuration: number;
    courseStartDate: number;
    courseEndDate: number;
    courseBuilding: string;
    courseRoom: number;
    courseDays: string;
    courseLevel: boolean;
    courseSemester: string;
    courseColor: string;
    coursePrerequisites: string;
    courseCorequisites: string;
    courseSpecialNotes: string;
  }