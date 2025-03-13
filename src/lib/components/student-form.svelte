<script lang="ts">
  import { addStudent } from "../utils/validate";
  import { newStudentErrorMessage } from "../stores/stores";

  let studentName: string = "";
  let studentCWID: string = "";

  function handleAddStudent() {
    const error = addStudent(studentName, studentCWID);
    if (error) {
      $newStudentErrorMessage = error;
    } else {
      $newStudentErrorMessage = "";
      studentName = "";
      studentCWID = "";
    }
  }
</script>

<div class="add-student-container">
  <input
    name="student-name-textbox"
    placeholder="Enter student name"
    bind:value={studentName}
    class="input-elem"
  />
  <input
    name="student-cwid-textbox"
    placeholder="Enter student CWID"
    bind:value={studentCWID}
    class="input-elem"
  />
  <button class="btn-contrast" on:click={handleAddStudent}>
    Add Student
  </button>
</div>

{#if $newStudentErrorMessage}
  <p style="color: rgb(var(--color-foreground-red))">
    {$newStudentErrorMessage}
  </p>
{/if}

<style>
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
</style>
