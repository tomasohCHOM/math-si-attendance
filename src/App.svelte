<script lang="ts">
  import { onMount } from "svelte";
  import AttendancePopup from "./lib/attendance-popup.svelte";

  type Student = {
    name: string;
    cwid: string;
  };

  let students: Student[] = [];

  let isAttendanceOpen: boolean = false;
  let newStudentName = "";
  let newStudentCWID = "";

  function addNewStudent() {
    if (!newStudentName || !newStudentCWID) {
      return;
    }
    students = [...students, { name: newStudentName, cwid: newStudentCWID }];
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

  onMount(async () => {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      students = JSON.parse(storedStudents);
    }
  });
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
            <input type="checkbox" checked />
          </tr>
        {/each}
      {:else}
        <div>No students signed in yet.</div>
      {/if}
    </tbody>
  </table>
  <button class="btn-contrast full-w">Submit Attendance</button>
</AttendancePopup>

<main>
  <h1>MATH SI Attendance</h1>

  <p>A website to make Math SI Attendance a little more bearable.</p>

  <button class="btn-contrast full-w" on:click={() => {}}>New Attendance</button
  >

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
</main>

<style>
  main {
    max-width: 768px;
    margin-inline: auto;
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
