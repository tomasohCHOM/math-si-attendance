<script lang="ts">
  import Popup from "./popup.svelte";

  export let isHelpOpen: boolean;
</script>

<Popup bind:isOpen={isHelpOpen}>
  <h2>How To Utilize This App</h2>
  <div class="main-section">
    <p>
      Math SI Attendance is a website to help Math SI Leaders sign in students
      to TitanNet in an automatic fashion. It leverages Justin Stitt's <a
        href="https://github.com/JustinStitt/si-attendance"
        target="_blank">si-attendance</a
      > backend by providing users with an UI that signs in students who attend SI
      Sessions .
    </p>
  </div>
</Popup>

<style>
  h2 {
    margin-block: 0;
  }

  .main-section {
    margin-top: 2rem;
    font-size: 1.125rem;
  }

  a {
    color: white;
    text-underline-offset: 2px;
  }
</style>
