<script lang="ts">
  import Popup from "./popup.svelte";

  export let isHelpOpen: boolean;
</script>

<Popup bind:isOpen={isHelpOpen}>
  <div class="main-section">
    <h2>Math SI Attendance</h2>
    <p>
      Math SI Attendance is a website to help CSUF Math SI Leaders sign in
      students to TitanNet in an automatic fashion. It leverages Justin Stitt's <a
        href="https://github.com/JustinStitt/si-attendance"
        target="_blank">si-attendance</a
      >
      backend by providing users with an UI that signs in students who attend SI
      Sessions.
      <b
        >If you are not a Math SI Leader at CSUF, you should not be using this
        website (and it would not be helpful in any way either!).</b
      >
    </p>
    <h3>Adding SI Students</h3>
    <p>
      Start by selecting your SI course. You can then input students'
      information, including their name and CWID. This will not sign them in
      TitanNet; rather, it will store their info locally so you don't have to do
      it all over again every time.
    </p>
    <p>
      You can add students individually or do multiple at the same time (in the
      textarea) by separating each student with a new line. This process can be
      further automated if you have the list of students organized in an Excel
      sheet. The gif below demonstrates how to add all students at once:
    </p>
    <img src="/help/multiple-students.gif" alt="Adding Multiple Students" />
    <h3>Marking Attendance</h3>
    <p>
      If you want to mark attendance for a specific SI session, click on the
      "New Attendance" button, which will bring a pop up to mark students'
      attendance <i>once</i>. This is where it will actually sign them into
      TitanNet and it will do it for all students that you previously added. You
      would have to do this process for each SI session.
    </p>
    <p>
      If a student misses that particular session, untoggle the "Attended?"
      checkbox associated with that student and they won't be signed into
      TitanNet.
    </p>
    <img src="/help/untoggle-student.png" alt="Untoggle Student" />
    <p>
      Marking attendance for students is an automatic process. It will close the
      pop up once it is done. If an error occurs within the process, it will
      appear as shown below:
    </p>
    <img src="/help/attendance-error.png" alt="Attendance Error" />
    <h3>Acknowledgements</h3>
    <p>
      I hope this tool can be useful to some extent as I know the tedious
      process involved with using TitanNet and inputting each student into the
      portal manually. Once again, thanks to Justin Stitt for providing <a
        href="https://github.com/JustinStitt/si-attendance"
        target="_blank">si-attendance</a
      >, which does the actual BTS of communicating with TitanNet and doing
      student attendance automatically! If you have any suggestions for making
      this website better, feel free to reach out to me (<b>Discord:</b> chomacito).
      Bye! :)
    </p>
  </div>
</Popup>

<style>
  h2 {
    margin-block: 0;
  }

  .main-section {
    margin-top: 1rem;
    font-size: 1.125rem;
  }

  a {
    color: white;
    text-underline-offset: 2px;
  }

  p {
    line-height: 1.5;
  }

  img {
    width: 100%;
  }
</style>
