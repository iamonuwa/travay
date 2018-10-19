<template>
  <vue-grid>
    <vue-grid-row>
      <vue-grid-item>
        <h1>{{ $t('App.getStarted.title' /* Quickly Get Started */) }}</h1>
      </vue-grid-item>
    </vue-grid-row>
    <vue-grid-row>
      <vue-grid-item>
        <h2>{{ $t('App.getStarted.jobWorkersTitle' /* Job Workers */) }}</h2>
        <ol>
          <li>{{ $t('App.getStarted.install' /* Install */) }} <a rel="noopener noreferrer"
                                                                  href="https://play.google.com/store/apps/details?id=org.mozilla.firefox&hl=fr" target="_blank">Firefox</a>
            {{ $t('App.getStarted.browser' /* browser */) }}.
          </li>
          <li>{{ $t('App.getStarted.step2' /* Log into Travay with your Gmail Account. Don't have one? Sign up */) }}
            <a rel="noopener noreferrer"
               href="https://accounts.google.com/signup/v2/webcreateaccount?continue=https%3A%2F%2Faccounts.google.com%2FManageAccount&hl=fr&flowName=GlifWebSignIn&flowEntry=SignUp"
            target="_blank">{{ $t('App.getStarted.here' /* here */) }}</a>.
          </li>
          <li>{{ $t('App.getStarted.install' /* Install */) }} <a rel="noopener noreferrer" href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask"
            target="_blank">MetaMask</a> Firefox {{ $t('App.getStarted.extension' /* extension */) }}.
          </li>
          <li>
            {{ $t('App.getStarted.startJob' /* Pick a job and start work immediately! */) }}
          </li>
        </ol>
      </vue-grid-item>
    </vue-grid-row>
    <br>
    <vue-grid-row>
      <vue-grid-item>
        <h2>{{ $t('App.getStarted.jobPosters' /* Job Posters */) }}</h2>
        <ol>
          <li>{{ $t('App.getStarted.install' /* Install */) }} <a rel="noopener noreferrer"
            href="https://play.google.com/store/apps/details?id=org.mozilla.firefox&hl=fr" target="_blank">Firefox</a>
            {{ $t('App.getStarted.browser' /* browser */) }}.
          </li>
          <li>{{ $t('App.getStarted.install' /* Install */) }} <a rel="noopener noreferrer"
            href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask"
            target="_blank">MetaMask</a> Firefox {{ $t('App.getStarted.extension' /* extension */) }}.
          </li>
          <li>{{ $t('App.getStarted.step2' /* Log into Travay with your Gmail Account. Don't have one? Sign up */) }}
            <a rel="noopener noreferrer"
            href="https://accounts.google.com/signup/v2/webcreateaccount?continue=https%3A%2F%2Faccounts.google.com%2FManageAccount&hl=fr&flowName=GlifWebSignIn&flowEntry=SignUp"
            target="_blank">{{ $t('App.getStarted.here' /* here */) }}</a>.
          </li>
          <li>
            {{ $t('App.getStarted.fundMetaMask' /* Fund your MetaMask account with DAI by clicking */) }} <a rel="noopener noreferrer"
            href="https://kyber.network/swap/eth_dai" target="_blank">
            {{ $t('App.getStarted.here' /* here */) }}</a>.
          </li>
          <p>{{ $t('App.getStarted.note' /* Note: Travay is only available with Android and Firefox. */) }}</p>
        </ol>

      </vue-grid-item>
    </vue-grid-row>
    <br>
    <vue-grid-row>
      <vue-grid-item>
        <h2>{{ $t('App.getStarted.thingsToRememberTitle' /* Things to Remember */) }}</h2>
        <p>{{ $t('App.getStarted.thingsToRememberText' /* You have to use Firefox browser in order for MetaMask to work.
          MetaMask is your secure identity vault,
          providing a user interface to manage your identities on different sites and sign blockchain transactions.
          Remember to NEVER share or loose your password or seed phrase from Metamask. */) }}</p>
      </vue-grid-item>
    </vue-grid-row>
  </vue-grid>
</template>

<script>
  export default {
    name: "get-started"
  }
</script>

<style scoped>

</style>
