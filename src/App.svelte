<script lang="ts">
  import { onMount } from "svelte";
  import AttendancePopup from "./lib/attendance-popup.svelte";

  const courses = [
    // "MATH-115A",
    // "MATH-115B",
    "MATH-115",
    "MATH-120",
    "MATH-125",
    "MATH-130",
    "MATH-135",
    "MATH-150",
    // "MATH-150A",
    // "MATH-150B",
    "MATH-250",
    // "MATH-250A",
    // "MATH-250B",
    "MATH-280",
  ];

  type Student = {
    name: string;
    cwid: string;
    checkedForAttendance: boolean;
  };

  let students: Student[] = [];

  let course: string = "";
  let newStudentName: string = "";
  let newStudentCWID: string = "";

  // UI variables
  let isAttendanceOpen: boolean = false;
  let newStudentErrorMessage: string = "";
  let loading: boolean = false;

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
    let responseMessage = "";
    loading = true;
    for (const student of students) {
      if (!student.checkedForAttendance) {
        continue;
      }
      console.log(course);
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
      if (data.errmessage.length === 0) {
        // response = 1;
      } else {
        responseMessage = data["errmessage"];
        console.log(responseMessage);
      }

      if (responseMessage.length) {
        loading = false;
        return;
      }
      console.log(student.name, "SIGNED IN");
    }
    loading = false;
    isAttendanceOpen = false;
  }

  onMount(async () => {
    const storedStudents = localStorage.getItem("students");
    const storedCourse = localStorage.getItem("course");
    if (storedStudents) {
      students = JSON.parse(storedStudents);
    }
    if (storedCourse) {
      course = storedCourse;
    }
  });

  $: if (course) {
    localStorage.setItem("course", course);
  }
</script>

<AttendancePopup bind:isOpen={isAttendanceOpen}>
  <h2>New Attendance</h2>
  <table class="student-table">
    <thead>
      <tr class="border-b-2 border-foreground-400">
        <th>Name</th>
        <th>CWID</th>
        <th>Attended?</th>
      </tr>
    </thead>
    <tbody>
      {#if students.length !== 0}
        {#each students as student}
          <tr class="space-under">
            <td>{student.name}</td>
            <td>{student.cwid}</td>
            <input
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
  <button
    class="btn-contrast full-w"
    on:click={markAttendance}
    disabled={loading}
  >
    {#if loading}
      Processing...
    {:else}
      Submit Attendance
    {/if}
  </button>
</AttendancePopup>

<main>
  <h1>MATH SI Attendance</h1>

  <p>A website to make Math SI Attendance a little more bearable.</p>

  <div>
    <select class="select-box" bind:value={course}>
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
        <tr class="border-b-2 border-foreground-400">
          <th>Name</th>
          <th>CWID</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        {#if students.length !== 0}
          {#each students as student, i}
            <tr class="space-under">
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
        class="input-elem"
        placeholder="Enter student name"
        bind:value={newStudentName}
      />
      <input
        class="input-elem"
        placeholder="Enter student CWID"
        bind:value={newStudentCWID}
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
    margin-top: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    text-align: left;
    width: 100%;
    background-color: rgb(var(--color-background-500));
    border-spacing: 0 0.5rem;
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
