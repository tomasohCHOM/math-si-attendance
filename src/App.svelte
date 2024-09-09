<script lang="ts">
  import { onMount } from "svelte";

  type Student = {
    name: string;
    cwid: string;
  };

  let students: Student[] = [
    { name: "Alice Morgan", cwid: "123456789" },
    { name: "John Smith", cwid: "987654321" },
    { name: "Emily Davis", cwid: "456789123" },
    { name: "Michael Johnson", cwid: "321987654" },
    { name: "Sophia Martinez", cwid: "159753486" },
    { name: "Daniel Brown", cwid: "753951284" },
    { name: "Jessica Wilson", cwid: "852369741" },
    { name: "Christopher Garcia", cwid: "369258147" },
    { name: "Amanda Lee", cwid: "741852963" },
    { name: "James Anderson", cwid: "963852741" },
    { name: "Olivia Hernandez", cwid: "258741369" },
    { name: "Benjamin Carter", cwid: "147852369" },
    { name: "Victoria Walker", cwid: "951753486" },
    { name: "Joshua Turner", cwid: "753159486" },
    { name: "Megan Clark", cwid: "369147258" },
    { name: "Alexander Adams", cwid: "159486753" },
    { name: "Samantha Hall", cwid: "852741369" },
    { name: "Andrew Phillips", cwid: "456321789" },
    { name: "Chloe Baker", cwid: "789123456" },
    { name: "Ryan Parker", cwid: "123789456" },
  ];

  function deleteStudent(i: number) {
    students.splice(i, 1);
    students = students;
    localStorage.setItem("students", JSON.stringify(students));
  }

  onMount(async () => {
    localStorage.getItem("students");
  });
</script>

<main>
  <h1>MATH SI Attendance</h1>

  <p>A website to make Math SI Attendance a little more bearable.</p>

  <button class="btn-contrast full-w">New Attendance</button>

  <table class="student-table">
    <thead>
      <tr class="border-b-2 border-foreground-400">
        <th>Name</th>
        <th>CWID</th>
        <th>Options</th>
      </tr>
    </thead>
    <tbody>
      {#each students as student, i}
        <tr>
          <td>{student.name}</td>
          <td>{student.cwid}</td>
          <button class="btn-danger" on:click={() => deleteStudent(i)}>
            Delete Student
          </button>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="add-student-container">
    <input class="input-elem" placeholder="Enter student name" />
    <input class="input-elem" placeholder="Enter student CWID" />
    <button class="btn-contrast">Add Student</button>
  </div>
</main>

<style>
  main {
    max-width: 768px;
    margin-inline: auto;
  }

  .student-table {
    margin-top: 0.5rem;
    padding: 0.25rem;
    border-radius: 0.5rem;
    text-align: left;
    width: 100%;
    background-color: rgb(var(--color-background-500));
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
