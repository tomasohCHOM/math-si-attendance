<script lang="ts">
  import { onMount } from "svelte";
  import { courseStore, attendanceTakenToday } from "./lib/stores/stores";
  import StudentAttendance from "./lib/components/student-attendance.svelte";
  import HelpPopup from "./lib/components/help-popup.svelte";
  import StudentList from "./lib/components/student-list.svelte";
  import StudentForm from "./lib/components/student-form.svelte";
  import MultipleStudentsForm from "./lib/components/multiple-students-form.svelte";
  import CourseSelector from "./lib/components/course-selector.svelte";

  // UI state variables
  let isAttendanceOpen: boolean = false;
  let isHelpOpen: boolean = false;
  let takingAttendance: boolean = false;

  // Derived values from stores
  let course: string;
  courseStore.subscribe((value) => (course = value));

  onMount(async () => {
    const storedLastAttendanceDate = localStorage.getItem(
      "last-attendance-date",
    );
    let lastAttendanceDate = Date.now();
    if (storedLastAttendanceDate) {
      lastAttendanceDate = JSON.parse(storedLastAttendanceDate);
    }
    const hourDelta: number = Math.abs(lastAttendanceDate - Date.now()) * 36e5;
    if (hourDelta < 18) {
      $attendanceTakenToday = true;
    }
  });
</script>

<StudentAttendance bind:isAttendanceOpen bind:takingAttendance />

<HelpPopup bind:isHelpOpen />

<main>
  <div class="nav">
    <h1>MATH SI Attendance</h1>
    <div class="right">
      <button class="help-btn" on:click={() => (isHelpOpen = true)}>
        <img src="/help.svg" alt="Help Icon" />
      </button>
      <a
        href="https://github.com/tomasohCHOM/math-si-attendance"
        target="_blank"
      >
        <img src="/github.svg" alt="GitHub Icon" />
      </a>
    </div>
  </div>

  <p>A website to make Math SI Attendance a little more bearable.</p>

  <CourseSelector />

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

    <StudentList />
    <StudentForm />
    <MultipleStudentsForm />
  {/if}
</main>

<style>
  main {
    max-width: 768px;
    margin-inline: auto;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav > .right {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .help-btn {
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
  }
</style>
