<script lang="ts">
  import { onMount } from "svelte";
  import AttendancePopup from "./lib/attendance-popup.svelte";

  const courses = [
    "MATH-115",
    "MATH-120",
    "MATH-125",
    "MATH-130",
    "MATH-135",
    "MATH-150",
    "MATH-250",
    "MATH-280",
  ];

  type Student = {
    name: string;
    cwid: string;
    checkedForAttendance: boolean;
  };

  type Attending = "processed" | "processing" | "none" | "failed";

  type StudentAttending = {
    student: Student;
    attending: Attending;
  };

  let students: Student[] = [];
  let studentsAttending: StudentAttending[] = [];

  let course: string = "";
  let newStudentName: string = "";
  let newStudentCWID: string = "";

  let processingAttendance = false;
  let attendanceTakenToday = false;
  let attendanceErrors: string[] = [];

  // UI variables
  let isAttendanceOpen: boolean = false;
  let newStudentErrorMessage: string = "";
  let takingAttendance: boolean = false;

  function addNewStudent() {
    if (!isValidStudent(newStudentName, newStudentCWID)) {
      return;
    }
    students = [
      ...students,
      {
        name: newStudentName,
        cwid: newStudentCWID,
        checkedForAttendance: true,
      },
    ];
    newStudentName = "";
    newStudentCWID = "";
    updateStudentsStorage();
  }

  function deleteStudent(i: number) {
    students.splice(i, 1);
    students = students;
    updateStudentsStorage();
  }

  function syncAttendanceDate() {
    attendanceTakenToday = true;
    localStorage.setItem("last-attendance-date", JSON.stringify(Date.now()));
  }

  function updateStudentsStorage() {
    localStorage.setItem("students", JSON.stringify(students));
  }

  function isValidStudent(studentName: string, cwid: string): boolean {
    if (!studentName.length) {
      newStudentErrorMessage = "Name cannot be empty.";
      return false;
    }
    if (!cwid.length) {
      newStudentErrorMessage = "CWID cannot be empty.";
      return false;
    }
    if (cwid.length != 9) {
      newStudentErrorMessage = "CWID should be 9 digits long.";
      return false;
    }
    if (cwid[0] != "8") {
      newStudentErrorMessage = "CWID should start with an 8.";
      return false;
    }

    for (const char of cwid) {
      if (char < "0" || char > "9") {
        newStudentErrorMessage = "CWID should only contain digits.";
        return false;
      }
    }
    newStudentErrorMessage = "";
    return true;
  }

  async function markAttendance() {
    (takingAttendance = true), (processingAttendance = true);
    console.log("Attendance for:", course);

    studentsAttending = students.map((student) => ({
      student,
      attending: student.checkedForAttendance ? "processing" : "none",
    }));

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      if (!student.checkedForAttendance) {
        continue;
      }
      console.log("SIGNING IN:", student.name);

      const res = await fetch(
        `https://si-attendance-api.vercel.app/signin?cwid=${student.cwid}&course=${course}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await res.json();
      console.log("response:", data);

      if (data.errmessage.length !== 0) {
        studentsAttending[i].attending = "failed";

        studentsAttending = studentsAttending;
        const responseMessage = `Failure while signing in ${student.name}: ${data.errmessage}`;
        console.log(responseMessage);
        attendanceErrors = [...attendanceErrors, responseMessage];
        continue;
      }

      studentsAttending[i].attending = "processed";
      studentsAttending = studentsAttending;
      console.log(student.name, "SIGNED IN");
    }
    processingAttendance = false;
    syncAttendanceDate();
  }

  onMount(async () => {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      students = JSON.parse(storedStudents);
    }
    course = localStorage.getItem("course") ?? course;

    const storedLastAttendanceDate = localStorage.getItem(
      "last-attendance-date",
    );
    let lastAttendanceDate = Date.now();
    if (storedLastAttendanceDate) {
      lastAttendanceDate = JSON.parse(storedLastAttendanceDate);
    }
    const hourDelta: number = Math.abs(lastAttendanceDate - Date.now()) * 36e5;
    if (hourDelta < 18) {
      attendanceTakenToday = true;
    }
  });

  $: if (course) {
    localStorage.setItem("course", course);
  }
  $: if (!isAttendanceOpen) {
    takingAttendance = false;
  }
</script>

<AttendancePopup
  bind:isOpen={isAttendanceOpen}
  bind:locked={processingAttendance}
>
  <h2>New Attendance</h2>
  {#if !takingAttendance}
    <table class="student-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>CWID</th>
          <th>Attended?</th>
        </tr>
      </thead>
      <tbody>
        {#if students.length !== 0}
          {#each students as student}
            <tr>
              <td>{student.name}</td>
              <td>{student.cwid}</td>
              <input
                name={student.name + " attendance checkbox"}
                type="checkbox"
                bind:checked={student.checkedForAttendance}
              />
            </tr>
          {/each}
        {:else}
          <div>No students signed in yet.</div>
        {/if}
      </tbody>
    </table>

    {#if attendanceTakenToday}
      <p>You already took attendance today. Do you want to do it again?</p>
    {/if}

    <button
      class="btn-contrast full-w"
      on:click={markAttendance}
      disabled={takingAttendance}
    >
      Submit Attendance
    </button>
  {:else}
    <div style="margin-top: 1rem;">
      {#if processingAttendance}
        <p>
          Taking attendance, please do not refresh this page unless you are
          sure...
        </p>
      {:else}
        <p>Done! You can close the pop up now :)</p>
      {/if}

      {#if attendanceErrors.length !== 0}
        <h3 class="error-title">Errors taking attendance! Logs:</h3>
        {#each attendanceErrors as error}
          <p>{error}</p>
        {/each}
      {/if}

      <table class="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>CWID</th>
            <th>Attended?</th>
          </tr>
        </thead>
        <tbody>
          {#each studentsAttending as studentAttending}
            <tr>
              <td>{studentAttending.student.name}</td>
              <td>{studentAttending.student.cwid}</td>
              <td style="font-weight: 500;">
                {#if studentAttending.attending === "processed"}
                  ✅
                {:else if studentAttending.attending === "processing"}
                  <img width="20" src="/loading.svg" alt="Loading Icon" />
                {:else if studentAttending.attending === "failed"}
                  Error ❌
                {:else}
                  Skipped
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</AttendancePopup>

<main>
  <h1>MATH SI Attendance</h1>

  <p>A website to make Math SI Attendance a little more bearable.</p>

  <div>
    <select name="course-select" class="select-box" bind:value={course}>
      <option value="" selected hidden> SI COURSE </option>
      {#each courses as courseOption}
        <option value={courseOption}>{courseOption}</option>
      {/each}
    </select>
  </div>

  {#if course}
    <button
      class="btn-contrast full-w"
      style="margin-top: 2rem;"
      on:click={() => {
        isAttendanceOpen = true;
      }}
    >
      New Attendance
    </button>

    <table class="student-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>CWID</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        {#if students.length !== 0}
          {#each students as student, i}
            <tr>
              <td>{student.name}</td>
              <td>{student.cwid}</td>
              <button class="btn-danger" on:click={() => deleteStudent(i)}>
                Delete Student
              </button>
            </tr>
          {/each}
        {:else}
          <div>No students signed in yet.</div>
        {/if}
      </tbody>
    </table>

    <div class="add-student-container">
      <input
        name="student-name-textbox"
        placeholder="Enter student name"
        bind:value={newStudentName}
        class="input-elem"
      />
      <input
        name="student-cwid-textbox"
        placeholder="Enter student CWID"
        bind:value={newStudentCWID}
        class="input-elem"
      />
      <button class="btn-contrast" on:click={addNewStudent}>Add Student</button>
    </div>

    {#if newStudentErrorMessage}
      <p style="color: rgb(var(--color-foreground-red))">
        {newStudentErrorMessage}
      </p>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 768px;
    margin-inline: auto;
  }

  h2 {
    margin-block: 0;
  }

  .error-title {
    color: rgb(var(--color-foreground-red));
  }

  .select-box {
    padding: 1rem 2rem;
    font-weight: bold;
    border-radius: 0.25rem;
    background-color: rgb(var(--color-background-500));
  }

  .select-box > option {
    font-size: 1.125rem;
  }

  .student-table {
    margin-top: 1rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    text-align: left;
    width: 100%;
    background-color: rgb(var(--color-background-500));
    border-spacing: 0 0.5rem;
  }

  .student-table > thead > tr > th {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid white;
  }

  .add-student-container {
    margin-block: 2rem;
    display: flex;
    gap: 0.25rem;
  }

  .input-elem {
    outline: none;
    border: none;
    width: 100%;
    padding: 0.75rem;
    border-radius: 1rem;
    background-color: rgb(var(--color-background-500));
  }

  .btn-danger {
    outline: none;
    border: 2px solid rgb(var(--color-foreground-red));
    padding: 0.75rem;
    border-radius: 1rem;
    min-width: max-content;
    cursor: pointer;
    font-weight: bold;
    background-color: rgb(var(--color-background-500));
    transition: filter 150ms ease;
  }

  .btn-contrast {
    outline: none;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    min-width: max-content;
    cursor: pointer;
    font-weight: bold;
    background-color: rgb(var(--color-foreground-blue));
    transition: filter 150ms ease;
  }

  .full-w {
    width: 100%;
    padding: 0.5rem;
  }

  .btn-contrast:hover {
    filter: brightness(1.1);
  }
</style>
