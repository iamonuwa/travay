<template>
  <vue-grid>

    <vue-grid-row>
      <vue-grid-item class="vueGridItem">
        <h1>{{ $t('App.nav.jobs' /* Jobs */) }}</h1>
        <!--<p>-->
        <!--{{ $t('App.jobs.pageSubtitle' /* Here you'll find 6-month and 12-month jobs. */) }}-->
        <!--</p>-->
      </vue-grid-item>
    </vue-grid-row>
    <br>

    <vue-grid-row>
      <vue-grid-item>
        <vue-button
          @click.prevent.stop="e => postAJob()"
          accent>
          <a style="color: white !important;">{{
            $t('App.jobs.postAJobButton' /* Post a Job */) }}</a>
        </vue-button>
      </vue-grid-item>
    </vue-grid-row>

    <br>

    <!--<vue-gird-row>-->
      <!--<vue-grid-item>-->
        <!--<ais-search-box :autofocus="true"></ais-search-box>-->
      <!--</vue-grid-item>-->
    <!--</vue-gird-row>-->

    <sponsor-modal
      :job="jobToSponsor"
      :show.sync="showSponsoredModal"
      @sponsorSubmit="amount => sponsorSubmit({
          amount,
          taskId: this.selectedJobToSponsorId, task: this.jobToSponsor.task,
          task: this.jobToSponsor.task || '',
          job: this.jobToSponsor
          })"></sponsor-modal>


    <vue-grid-row>
      <vue-grid-item>
        <hr>
        <vue-panel v-for="job in filteredJobs" v-bind:key="job.taskId">
          <!-- <vue-panel-header title="Title" subtitle="subtitle"
                            image="https://avatars2.githubusercontent.com/u/1667598?s=460&v=4" /> -->
          <vue-panel-body>
            <ul>
              <li>
                <strong>{{job.task}}</strong><br><br>
                <strong>{{ $t('App.job.jobDescription' /* Description */) }}:</strong> {{job.brief}}<br><br>
                <strong>{{ $t('App.job.jobDomain' /* Domain */) }}:</strong> {{job.domain}}<br><br>
                <strong>{{ $t('App.job.jobSkill' /* Desired Skill */) }}:</strong> {{job.skill}}<br><br>
                <strong>{{ $t('App.job.termOfEmployment' /* Desired Skill */) }}:</strong>
                {{job.termOfEmployment}}<br><br>
                <strong>{{ $t('App.job.cityOfWork' /* City of Work */) }}:</strong> {{ job.cityOfWork }}<br><br>
                <strong>{{ $t('App.job.jobSalary' /* Salary (USD) */) }}:</strong>
                ${{job.salary['full-time-rate']}}<br><br>
                <!--Pay frequency:-->
                <!--<input id="weekly" true-value="weekly" type="checkbox" name="weekly"-->
                <!--v-model="job.salary['pay-frequency'].label" disabled/>-->
                <!--<label for="weekly">Weekly</label>-->
                <!--<input id="bi-weekly" type="checkbox" true-value="bi-weekly" name="bi-weekly"-->
                <!--v-model="job.salary['pay-frequency'].label" disabled/>-->
                <!--<label for="bi-weekly">Bi-weekly</label>-->
                <!--<input id="monthly" true-value="monthly" type="checkbox" name="monthly"-->
                <!--v-model="job.salary['pay-frequency'].label" disabled/>-->
                <!--<label for="monthly">Monthly</label><br>-->
                <!--Term of employment:-->
                <!--<input id="sixmonth" type="checkbox" name="sixmonth" v-model="job['terms-of-employment']"-->
                <!--true-value="6" disabled/>-->
                <!--<label for="sixmonth">6 month</label>-->
                <!--<input id="oneyear" type="checkbox" name="oneyear" v-model="job['terms-of-employment']"-->
                <!--true-value="12" disabled/>-->
                <!--<label for="oneyear">1 year</label>-->
                <strong>{{ $t('App.job.datePosted' /* Date Posted */) }}:</strong> {{ job['date-posted'] | moment
                }}<br>
              </li>
            </ul>
          </vue-panel-body>
          <vue-panel-footer>
            <router-link :to="`/job/${job.taskId}`">
              <vue-button primary>
                {{ $t('App.jobs.learnMoreButton' /* LEARN MORE */) }}
              </vue-button>
            </router-link>
            <br/>
            <br/>
            <div v-if="job.role">
              <a @click.prevent.stop="e => sponsorJob(job.taskId)">
                <vue-button :v-userRole.canSponsor="{role: job.role}"
                            style="color: white !important;"
                            accent>
                  {{ $t('App.job.sponsorJobButton' /* Sponsor This Job */) }}
                </vue-button>
              </a>
            </div>
          </vue-panel-footer>
        </vue-panel>
        <hr>
      </vue-grid-item>

    </vue-grid-row>

  </vue-grid>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import axios from 'axios';
  import firebase from 'firebase';
  import db from '../firebaseinit';
  import SponsorModal from '../services/SponsorModal.vue';
  import {uuid} from 'vue-uuid';
  import moment from 'moment';
  import {sponsorSubmitMixin} from '../mixins/sponsorSubmitMixin';
  import * as types from '@/store/types'
  import truffleContract from "truffle-contract";
  import EscrowContract from "../../contracts/build/contracts/Escrow"
  import {store} from '../store';
  // import InstantSearch from 'vue-instantsearch';

  export default {
    mixins: [sponsorSubmitMixin],
    metaInfo: {
      title: "Jobs",
      meta: [
        {
          name: "Jobs",
          content: "Jobs in Travay."
        }
      ]
    },
    name: 'jobs',
    components: {
      SponsorModal
    },
    data() {
      return {
        jobs: [],
        selectedJobToSponsorId: null,
        showSponsoredModal: false,
        posted: '',
        filterType: 'all',
        endRange: '1000000',
        startRange: '1',
        skill: '',
        domain: '',
        keyword: '',
        isNavigating: false,
        types: [
          {
            id: 'salary',
            title: 'Salary'
          },
          {
            id: 'skill',
            title: 'Skill'
          },
          {
            id: 'domain',
            title: 'Domain'
          }
        ],
        amounts: [
          {
            id: '$1',
            value: '1'
          },
          {
            id: '$200',
            value: '200'
          },
          {
            id: '$400',
            value: '400'
          },
          {
            id: '$600',
            value: '400'
          },
          {
            id: '$800',
            value: '800'
          },
          {
            id: '$1000',
            value: '1000'
          }
        ],
        skills: [
          {
            id: 'labor',
            value: 'Labor'
          },
          {
            id: 'teaching',
            value: 'Teaching'
          },
          {
            id: 'engineering',
            value: 'Engineering'
          }
        ],
        domains: [
          {
            id: 'community',
            value: 'Community'
          },
          {
            id: 'education',
            value: 'Education'
          },
          {
            id: 'environment',
            value: 'Environment'
          }
        ]
      };
    },
    watch: {
      filterType(selectedValue, oldValue) {
        console.log('filter type value changed', selectedValue, oldValue);
        this.filterJobs();
      },
      keyword(keyword) {
        this.filterJobs(keyword);
      },
      domain(domain) {
        this.filterJobs();
      }
    },
    filters: {
      moment: function (date) {
        return moment(date).format('Do MMMM YYYY');
      }
    },
    methods: {
      // ...mapActions('signInModal', ['openLoginModal', 'closeLoginModal']),
      ...mapActions({
        openLoginModal: types.OPEN_LOGIN_MODAL,
        closeLoginModal: types.CLOSE_LOGIN_MODAL,
        openNetworkModal: types.OPEN_NETWORK_MODAL
      }),
      moment: function () {
        return moment();
      },
      postAJob() {
        if (!this.userId) {
          this.openLoginModal();
          return;
        }
        this.$router.push('createJob');
      },
      sponsorJob(taskId) {

        if (this.$store.state.web3.networkId !== "1") {
          this.openNetworkModal();
          return;
        }

        // Add Analytics event
        this.$ma.trackEvent({category: 'Click', action: 'Sponsor Job from Jobs Page', label: 'Sponsor Job from Jobs Page', value:
            ''});

        if (!this.userId) {
          this.openLoginModal();
          return;
        }
        this.selectedJobToSponsorId = taskId;
        this.showSponsoredModal = true;
      },
      sort(jobs) {
        const result = jobs.sort(function (a, b) {
          let date1 = new Date(a['date-posted']);
          let date2 = new Date(b['date-posted']);
          return date1 - date2;
        });
        this.jobs = result;
      },
      filterJobs(keyword) {
        console.log('filtering in filterJobs', keyword);
        if (!Reflect.has(this.$options, 'originalJobs')) return [];
        const jobs = this.$options.originalJobs.reduce((acc, job) => {
          console.log(
            'Checking the domain',
            this.isFilteringByDomain,
            this.domain
          );
          if (this.isFilteringByDomain && this.domain) {
            console.log('Will filter by domain');
            if (job.domain.toLowerCase() !== this.domain.toLowerCase()) {
              console.log('Job should not be added!');
              return acc;
            }
          }
          let keywordSearchRegEx = RegExp(keyword, 'gi');
          let valid =
            keywordSearchRegEx.test(job.brief) &&
            (parseInt(job['salary']['full-time-rate']) <=
              parseInt(this.endRange) &&
              parseInt(job['salary']['full-time-rate']) >=
              parseInt(this.startRange));
          if (valid) acc.push(job);
          return acc;
        }, []);
        this.jobs = jobs;
        if (this.isFilteringByDomain && this.domain) {
          return this.$options.originalJobs.filter(job => {
            console.log('job domain', job.domain, this.domain);
            return job.domain.toLowerCase() === this.domain.toLowerCase();
          });
        }
        this.jobs = this.$options.originalJobs.filter(
          (job, index) => {
            let keywordSearchRegEx = RegExp(keyword, 'gi');
            return (
              keywordSearchRegEx.test(job.brief) &&
              (parseInt(job['salary']['full-time-rate']) <=
                parseInt(this.endRange) &&
                parseInt(job['salary']['full-time-rate']) >=
                parseInt(this.startRange))
            );
          }
        );
      }
    },
    computed: {
      // ...mapGetters('signInModal', ['userId']),
      ...mapGetters({
        userId: types.GET_USER_ID
      }),
      ...mapGetters('jobs', []),
      jobToSponsor() {
        return (
          this.jobs.find(job => job.taskId === this.selectedJobToSponsorId) || {}
        );
      },
      isFilteringBySalary() {
        return this.filterType === 'salary';
      },
      isFilteringBySkill() {
        return this.filterType === 'skill';
      },
      isFilteringByDomain() {
        return this.filterType === 'domain';
      },
      filteredJobs() {
        return this.jobs;
      }
    },
    created() {
      db
        .collection('jobs')
        .where('status.state', '==', 'incomplete')
        .get()
        .then(snapshot => {
          const jobs = [];
          snapshot.forEach(job => {
            jobs.push(job.data());
          });
          this.jobs = jobs;
          this.$options.originalJobs = jobs;
        });
    }
  };
</script>

<style scoped>
</style>
