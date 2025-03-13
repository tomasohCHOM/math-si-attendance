import { writable } from "svelte/store"
import type { Student, StudentAttending } from "../types";

export const courses = [
  { label: "MATH-115A", value: "MATH-115A" },
  { label: "MATH-115B", value: "MATH-115B" },
  { label: "MATH-120", value: "MATH-120" },
  { label: "MATH-125", value: "MATH-125$" },
  { label: "MATH-130", value: "MATH-130" },
  { label: "MATH-135", value: "MATH-135$" },
  { label: "MATH-150", value: "MATH-150" },
  { label: "MATH-250A", value: "MATH-250A" },
  { label: "MATH-250B", value: "MATH-250B" },
  { label: "MATH-280", value: "MATH-280" },
];

// Course store
const storedCourse = localStorage.getItem("course") || "";
export const courseStore = writable<string>(storedCourse);
courseStore.subscribe((course) => {
  if (course) {
    localStorage.setItem("course", course);
  }
});

// Students store
function getInitialStudents(): Student[] {
  const storedStudents = localStorage.getItem("students");
  return storedStudents ? JSON.parse(storedStudents) : [];
}
export const studentsStore = writable<Student[]>(getInitialStudents());
studentsStore.subscribe((students) => {
  localStorage.setItem("students", JSON.stringify(students));
})

// Attendance stores
export const studentsAttendingStore = writable<StudentAttending[]>([]);
export const processingAttendanceStore = writable<boolean>(false);
export const attendanceTakenToday = writable<boolean>(false);
export const attendanceErrors = writable<string[]>([]);

// Form error messages
export const newStudentErrorMessage = writable<string>("");
export const newStudentsErrorMessage = writable<string>("");

export function syncAttendanceDate() {
  attendanceTakenToday.set(true);
  localStorage.setItem("last-attendance-date", JSON.stringify(Date.now()));
}
