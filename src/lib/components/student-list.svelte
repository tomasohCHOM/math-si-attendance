<script lang="ts">
  import { studentsStore } from "../stores/stores";
  import { deleteStudent } from "../utils/validate";
</script>

<table class="student-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>CWID</th>
      <th>Options</th>
    </tr>
  </thead>
  <tbody>
    {#if $studentsStore.length !== 0}
      {#each $studentsStore as student, i}
        <tr>
          <td>{student.name}</td>
          <td>{student.cwid}</td>
          <td>
            <button class="btn-danger" on:click={() => deleteStudent(i)}>
              Delete Student
            </button>
          </td>
        </tr>
      {/each}
    {:else}
      <tr>
        <td colspan="3" class="empty-message">No students signed in yet.</td>
      </tr>
    {/if}
  </tbody>
</table>

<style>
  .empty-message {
    text-align: center;
    padding: 1rem;
  }
</style>
