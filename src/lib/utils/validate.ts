import { studentsStore } from "../stores/stores";

export function validateStudent(studentName: string, cwid: string): string {
  if (!studentName.length) {
    return "Name cannot be empty.";
  }
  if (!cwid.length) {
    return "CWID cannot be empty.";
  }
  if (cwid.length != 9) {
    return "CWID should be 9 digits long.";
  }
  if (cwid[0] != "8") {
    return "CWID should start with an 8.";
  }

  for (const char of cwid) {
    if (char < "0" || char > "9") {
      return "CWID should only contain digits.";
    }
  }
  return "";
}

export function addStudent(name: string, cwid: string): string {
  const error = validateStudent(name, cwid);
  if (error) return error;

  studentsStore.update((students) => {
    const newStudents = [...students, {
      name,
      cwid,
      checkedForAttendance: true
    }];
    newStudents.sort((a, b) => a.name.localeCompare(b.name));
    return newStudents;
  });
  return "";
}

export function deleteStudent(index: number): void {
  studentsStore.update((students) => {
    const newStudents = [...students];
    newStudents.splice(index, 1);
    return newStudents;
  })
}

// Used when inputting multiple students through the textarea
export function formatMultipleStudents(input: string): { success: boolean, students: { name: string, cwid: string }[], errorMessage: string } {
  const studentEntries = input.split("\n");
  const formattedStudents: { name: string, cwid: string }[] = [];
  let errorMessage = "";
  for (let i = 0; i < studentEntries.length; i++) {
    const studentEntry = studentEntries[i].trim();
    if (!studentEntry) continue;

    // Try splitting by tabs first
    const splitByTab = studentEntry.split("\t");
    if (splitByTab.length === 2) {
      const [studentName, studentCWID] = splitByTab;
      const validationError = validateStudent(studentName, studentCWID);
      if (validationError) {
        errorMessage = validationError;
        return { success: false, students: [], errorMessage };
      }
      formattedStudents.push({ name: studentName, cwid: studentCWID });
    } else {
      // Look for a colon ":"
      const splitByColon = studentEntry.split(":");
      if (splitByColon.length !== 2) {
        errorMessage = "Invalid format! Use either Tab or Colon to separate name and CWID.";
        return { success: false, students: [], errorMessage };
      }

      const studentName = splitByColon[0].trim();
      const studentCWID = splitByColon[1].trim();
      const validationError = validateStudent(studentName, studentCWID);
      if (validationError) {
        errorMessage = validationError;
        return { success: false, students: [], errorMessage };
      }
      formattedStudents.push({ name: studentName, cwid: studentCWID });
    }
  }

  return { success: true, students: formattedStudents, errorMessage: "" };
}
