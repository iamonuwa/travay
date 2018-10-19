<template>
  <footer id="footer-style">
    &copy; {{ year }} {{ $t('App.footer.company' /* company */) }} <br>
    <a rel="noopener noreferrer" href="https://airtable.com/shrGJhkEk4SphwEXe" target="_blank">{{
      $t('App.footer.getNotified' /* Get Notified of
      New Jobs */) }}</a><br>
    <p>{{ $t('App.footer.contractUs' /* Contact Us */) }}:
      <a rel="noopener noreferrer" href="https://twitter.com/travayht" target="_blank">Twitter</a></p>
  </footer>
</template>

<script>
  export default {
    name: 'travay-footer',
    computed: {
      year: function() {
        return new Date().getFullYear();
      },
      /*year: {
        get() {
          return this.year = new Date().getFullYear();
        },
        set(param) {
          console.log('we are setting a year!', param)
        }
      },*/
    }
  }
</script>

<style scoped>
  #footer-style {
    text-align: center;
  }

  #sticky-footer {
    width: 100%;
    padding: 15px;
    background: rgba(0, 0, 0, .25);
    color: white;
    font-weight: bold;
    font-size: 15px;
    text-align: center;
    position: fixed; /* Here's what sticks it */
    bottom: 0; /* to the bottom of the body */
    left: 0; /* and to the left of the body. */

    /*EFFECTS*/
    transition: .33s linear;
  }
</style>
