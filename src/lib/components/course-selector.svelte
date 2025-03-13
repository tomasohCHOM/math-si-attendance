<script lang="ts">
  import { courses, courseStore } from "../stores/stores";

  let course: string;
  courseStore.subscribe((value) => (course = value));

  function updateCourse(event: Event) {
    const select = event.target as HTMLSelectElement;
    courseStore.set(select.value);
  }
</script>

<div>
  <select
    name="course-select"
    class="select-box"
    value={course}
    on:change={updateCourse}
  >
    <option value="" selected hidden> SI COURSE </option>
    {#each courses as courseOption}
      <option value={courseOption.value}>{courseOption.label}</option>
    {/each}
  </select>
</div>

<style>
  .select-box {
    padding: 1rem 2rem;
    font-weight: bold;
    border-radius: 0.25rem;
    background-color: rgb(var(--color-background-500));
  }

  .select-box > option {
    font-size: 1.125rem;
  }
</style>
