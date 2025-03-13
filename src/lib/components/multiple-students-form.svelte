<script lang="ts">
  import { formatMultipleStudents, addStudent } from "../utils/validate";
  import { newStudentsErrorMessage } from "../stores/stores";

  let newStudents: string = "";

  const textareaPlaceholder = `Enter students' information separated by a new line. You can either:

1. Enter the student's name and their CWID separated by a tab (e.g "Doe, John<TAB>881234567") OR
2. Enter the student's name followed by a colon (":") and the student's CWID (e.g "Doe, John: 881234567").`;

  function handleAddMultipleStudents() {
    const result = formatMultipleStudents(newStudents);
    if (!result.success) {
      $newStudentsErrorMessage = result.errorMessage;
      return;
    }

    for (const student of result.students) {
      addStudent(student.name, student.cwid);
    }
    $newStudentsErrorMessage = "";
    newStudents = "";
  }
</script>

<div class="add-multiple-students-container">
  <textarea bind:value={newStudents} placeholder={textareaPlaceholder} />
  <button class="btn-contrast" on:click={handleAddMultipleStudents}>
    Add Students
  </button>
</div>

{#if $newStudentsErrorMessage}
  <p style="color: rgb(var(--color-foreground-red))">
    {$newStudentsErrorMessage}
  </p>
{/if}

<style>
  .add-multiple-students-container {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .add-multiple-students-container > textarea {
    width: 100%;
    height: 300px;
    resize: vertical;
    background-color: rgb(var(--color-background-500));
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-family: "Lato", sans-serif;
    font-size: 1rem;
  }

  .add-multiple-students-container > button {
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>
