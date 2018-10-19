<template>
  <vue-grid>
    <vue-grid-row>

      <vue-grid-item>
        <h1>{{$t('App.pricing.pageTitle' /* Always Transparent Pricing */) }}</h1>
      </vue-grid-item>

      <vue-grid-item>
        <br>
        <vue-panel>
          <vue-panel-header :title="$t('App.pricing.2PercentPanelTitle' /* Best Deal */)"
                            :subtitle="$t('App.pricing.2PercentPanelSubtitle' /* You got this. */)"/>
          <vue-panel-body>
            <h2>2%</h2>
            <p>{{$t('App.pricing.2PercentPara1' /* One-Time Percentage Fee of Total Salary in USD. */) }}</p>
            <br>
            <p>{{$t('App.pricing.2PercentPara2' /* You post a job and individuals directly select your job. When you fund a job, 2% of the total amount
              entered for the salary is auto deducted and the worker receives the remaining 98%. We receive the 2%. */) }}</p>
          </vue-panel-body>
          <vue-panel-footer>
            <router-link to="createJob">
              <vue-button accent style="text-decoration: none; color: white;">
                {{$t('App.pricing.getStartedButton' /* Get Started */) }}
              </vue-button>
            </router-link>
          </vue-panel-footer>
        </vue-panel>
        <br>
      </vue-grid-item>

      <vue-grid-item>
        <vue-panel>
          <vue-panel-header :title="$t('App.pricing.30PanelTitle' /* Good Deal */)"
                            :subtitle="$t('App.pricing.30PanelSubtitle' /* We do the work */)"></vue-panel-header>
          <vue-panel-body>
            <h2>$ 30 USD</h2>
            <br>
            <p>{{$t('App.pricing.30Para1' /* We post and recruit for your job position. */) }}</p>
            <br>
            <p>{{$t('App.pricing.30Para2' /* Ready to get started? */) }}</p>
            <br>
            <ol>
              <li><a rel="noopener noreferrer" href="https://www.paypal.me/farahb"
                     target="_blank">{{$t('App.pricing.30bullet1' /* Click here and send a $30 payment with the salary for the job. The 2% fee above still applies on the salary. */) }}</a></li>
              <li><a rel="noopener noreferrer" href="https://airtable.com/shr9JeDUKyfrq6KRr"
                     target="_blank">{{$t('App.pricing.30bullet2' /*
                Click here to complete a form with your job details. */) }}</a></li>
              <li>{{$t('App.pricing.30bullet3' /* We'll notify you when the job is posted and there are candidates
                available for your job. */) }}</li>
            </ol>
            <br>
            <p>{{$t('App.pricing.30Para3' /* Note: the one-time $30 fee is non-refundable. */) }}</p>
          </vue-panel-body>
          <vue-panel-footer>
          </vue-panel-footer>
        </vue-panel>
      </vue-grid-item>

    </vue-grid-row>
  </vue-grid>
</template>

<script>
  export default {
    name: "pricing"
  }
</script>

<style scoped>

</style>
