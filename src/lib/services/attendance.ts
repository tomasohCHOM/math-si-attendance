import { get } from 'svelte/store';
import {
  studentsStore,
  studentsAttendingStore,
  processingAttendanceStore,
  attendanceErrors,
  courseStore,
  syncAttendanceDate
} from '../stores/stores';

export async function markStudentAttendance() {
  processingAttendanceStore.set(true);
  const students = get(studentsStore);
  const course = get(courseStore);

  attendanceErrors.set([]);
  let currentErrors: string[] = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (!student.checkedForAttendance) {
      console.log("Attendance skipped for:", student.name);
      continue;
    }
    console.log("Signing in:", student.name);

    try {
      const res = await fetch(
        `https://si-attendance-api.vercel.app/signin?cwid=${student.cwid}&course=${course}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: Error with the server`);
      }
      const data = await res.json();
      console.log("API Response:", data);
      if (data.errmessage.length !== 0) {
        // If failed to sign in this student, continue to next one
        studentsAttendingStore.update(attending => {
          attending[i].attending = "failed";
          return attending;
        });

        const responseMessage = `Failure while signing in ${student.name}: ${data.errmessage}`;
        console.log(responseMessage);
        currentErrors = [...currentErrors, responseMessage];
        attendanceErrors.set(currentErrors);
        continue;
      }
      studentsAttendingStore.update(attending => {
        attending[i].attending = "processed";
        return attending;
      });
    } catch (error: any) {
      // If error with the server, stop immediately
      studentsAttendingStore.update(attending => {
        attending[i].attending = "failed";
        // Skip other students as well
        for (let j = i + 1; j < attending.length; j++) {
          attending[j].attending = "none";
        }
        return attending;
      });

      const errorMessage = `Error signing in ${student.name} - ${error.message}`;
      console.log(errorMessage);
      currentErrors = [...currentErrors, errorMessage];
      attendanceErrors.set(currentErrors);
      break;
    }
  }

  processingAttendanceStore.set(false);
  syncAttendanceDate();
}
