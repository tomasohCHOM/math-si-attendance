<script lang="ts">
  import type { Student, StudentAttending } from "./types";
  import Popup from "./popup.svelte";

  export let isAttendanceOpen: boolean;
  export let processingAttendance: boolean;
  export let takingAttendance: boolean;
  export let attendanceTakenToday: boolean;

  export let markAttendance: () => void;

  export let students: Student[];
  export let studentsAttending: StudentAttending[];
  export let attendanceErrors: string[];
</script>

<Popup bind:isOpen={isAttendanceOpen} bind:locked={processingAttendance}>
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
        <p>Done! Closing the pop up now :)</p>
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
</Popup>

<style>
  h2 {
    margin-block: 0;
  }
  .error-title {
    color: rgb(var(--color-foreground-red));
  }
</style>
