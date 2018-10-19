<template>
  <div class="loading-parent">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage">
    </loading>
    <vue-grid>

      <div :class="$style.header">
        <vue-grid>
          <vue-grid-row>
            <vue-grid-item class="vueGridItem">
              <h1>{{ $t('App.nav.createJob' /* Create Job */) }}</h1>
              <h5>{{ $t('App.createJob.pricing1' /* Learn more about pricing */) }}
                <router-link to="pricing">{{
                  $t('App.createJob.pricing2' /* here */) }}
                </router-link>
                .
              </h5>
              <!--<p>-->
              <!--{{ $t('App.createJob.pageDescription' /* Use the form below to create a 6-month or 12-month job. */) }}-->
              <!--</p>-->
            </vue-grid-item>
          </vue-grid-row>
        </vue-grid>
      </div>
      <br>

      <vue-grid>
        <vue-grid-row>
          <form @submit.prevent="createJob()">

            <vue-grid-row>
              <vue-grid-item>
                <vue-input
                  name="task"
                  id="task"
                  :placeholder="$t('App.createJob.JobTitleInForm')"
                  v-model="form.task"
                  required/>
              </vue-grid-item>
            </vue-grid-row>

            <vue-grid-row>
              <vue-grid-item>
                <vue-input
                  name="brief"
                  id="brief"
                  :placeholder="$t('App.createJob.JobDescriptionInForm')"
                  v-model="form.brief"
                  required/>
              </vue-grid-item>
            </vue-grid-row>

            <vue-grid-row>
              <vue-grid-item>
                {{ $t('App.createJob.requirementInstructions' /* Please add your requirements in order for the job to
                be considered as complete. Add one requirement, then click Add Requirement, to add additional
                requirements. */) }}
              </vue-grid-item>

              <vue-grid-item>
                <vue-input
                  name="deliverable"
                  id="deliverable"
                  :placeholder="$t('App.createJob.requirementInForm')"
                  v-model="requirement"
                  required/>
                <button accent @click="addRequirement">{{ $t('App.createJob.requirementButton' /* Add Requirement */) }}
                </button>
                <br>
              </vue-grid-item>
              <br>
              <br>
              <vue-grid-item>
                <p v-for="(req, i) in form.deliverable" :key="i">
                  <vue-badge accent>{{req}} -</vue-badge>
                  <span @click="removeRequirement(i)">
              X
            </span>
                  <br>
                  <br>
                </p>
              </vue-grid-item>
            </vue-grid-row>
            <br>
            <br>

            <!--<vue-grid-row>-->
            <!--<vue-grid-item>-->
            <!--<vue-input-->
            <!--name="payoutEvaluator"-->
            <!--id="payoutEvaluator"-->
            <!--required-->
            <!--placeholder="Job Reviewer"-->
            <!--v-model="form.payoutEvaluator"/>-->
            <!--</vue-grid-item>-->
            <!--</vue-grid-row>-->

            <vue-grid-row>
              <vue-grid-item>
                <vue-input
                  name="termOfEmployment"
                  id="termOfEmployment"
                  type="number"
                  :placeholder="$t('App.createJob.nrMonthsInForm')"
                  v-model="form.termOfEmployment"
                  required/>
                <div>{{ $t('App.createJob.termOfEmploymentExplanation' /* Months of work is also referenced as
                  milestones. The total amount you fund for this job will be divided by the number of milestones or
                  total months of employment. */) }}
                </div>
              </vue-grid-item>
            </vue-grid-row>


            <!--<vue-grid-row>-->
            <!--<vue-grid-item>-->
            <!--<vue-select-->
            <!--name="payFrequency"-->
            <!--id="payFrequency"-->
            <!--:options="payFrequency"-->
            <!--:value="form.selectedPayFrequency"-->
            <!--@input="val => selectChange(val, 'selectedPayFrequency')"-->
            <!--</vue-grid-item>-->
            <!--</vue-grid-row>-->
            <br>
            <br>
            <vue-grid-row>
              <vue-grid-item>
                <vue-input
                  name="salary"
                  id="salary"
                  type="number"
                  :placeholder="$t('App.createJob.totalFoundingInForm')"
                  v-model="form.salary"
                  required/>
                <div>{{ $t('App.createJob.salaryPayoutDisclaimer' /* Remember: (1) The salary you list above will be
                  deducted and paid to the worker evenly based on the total months you have typed above.
                  (2) We collect 2% of the total salary amount. Based on the salary you have entered above the worker in
                  total will receive approximately: */) }} <strong>${{ estimatedWorkerPayout }}</strong>.
                </div>
              </vue-grid-item>
            </vue-grid-row>
            <br>
            <br>
            <vue-grid-row>
              <vue-grid-item>
                <vue-input
                  name="setEvaluatorCreateJob"
                  id="setEvaluatorCreateJob"
                  :placeholder="$t('App.createJob.evaluatorEthAddress')"
                  v-model="form.setEvaluatorCreateJob" />
                <div>{{ $t('App.createJob.setEvaluatorExplanation' /* Each job requires an evaluator. This
                  individual can be supervisor of the job worker and cannot be the same person that created the job. If
                  you leave this blank anyone can become the evaluator of a job. For example, if the job is trash
                  pick up and disposal and the job worker shares pictures of the work done and with the geo location.
                  Than the evaluator can be anywhere in the world can can mark the task complete.
                  */) }}
                </div>
              </vue-grid-item>
            </vue-grid-row>
            <br>
            <br>
            <vue-grid-row>
              <vue-grid-item>
                <vue-select
                  name=" "
                  id="domain"
                  placeholder="Job Category"
                  v-model="form.domain"
                  :options="$t('domainOptions')"
                  :key="locale"
                  required/>
              </vue-grid-item>
              <vue-grid-item>
                <vue-select
                  name="skill"
                  id="skill"
                  placeholder="Top Desired Skill"
                  v-model="form.skill"
                  :options="$t('skillOptions')"
                  :key="locale"
                  required/>
              </vue-grid-item>
            </vue-grid-row>

            <vue-grid-row>
              <vue-grid-item>
                <vue-select
                  name="country"
                  id="country"
                  v-model="form.country"
                  :options="$t('countryOptions')"
                  :key="locale"
                  required/>
              </vue-grid-item>
            </vue-grid-row>

            <vue-grid-row>
              <vue-grid-item>
                <vue-input
                  name="cityOfWork"
                  id="cityOfWork"
                  :placeholder="$t('App.job.cityOfWork')"
                  v-model="form.cityOfWork"
                  required/>
              </vue-grid-item>
            </vue-grid-row>

            <vue-grid-row>
              <vue-grid-item>
                <vue-checkbox
                  name="acceptTerms"
                  id="acceptTerms"
                  v-model="form.acceptTerms"
                  :label="$t('App.createJob.acceptTerms'
                    /* I accept the Terms, Privacy Policy and Code of Conduct. */)"
                  :key="locale"
                  required/>
              </vue-grid-item>
            </vue-grid-row>

            <br/>
            <vue-button warn
                        @click.prevent.stop="createJob">
              {{ $t('App.createJob.submitPostAJob' /* Submit Job Posting */) }}
            </vue-button>
          </form>

        </vue-grid-row>
      </vue-grid>

    </vue-grid>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';
  import {NETWORKS} from "../util/constants/networks";
  import {uuid} from 'vue-uuid';
  import firebase from 'firebase';
  import db from '../firebaseinit';
  import {any} from 'bluebird';
  import {store} from '../store';
  import * as types from '../store/types'
  import truffleContract from 'truffle-contract'
  import EscrowContract from '../../contracts/build/contracts/Escrow.json'
  import DAIContract from '../../contracts/build/contracts/DAI.json'
  import Loading from 'vue-loading-overlay'

  const state = {
    date1: new Date()
  }

  export default {
    metaInfo: {
      title: 'Post a Job',
      meta: [
        {
          name: 'Post a Job',
          content: 'Posting a job in Travay.'
        }
      ]
    },
    name: 'createJob',
    $_veeValidate: {
      validator: 'new'
    },
    components: {
      Loading
    },
    data () {
      return {
        fullPage: true,
        locale: '',
        form: {
          taskId: 0,
          task: '',
          brief: '',
          payouts: [],
          deliverable: [],
          datePosted: '',
          // payoutEvaluator: '',
          salary: '',
          setEvaluatorCreateJob: '',
          termOfEmployment: '',
          cityOfWork: '',
          isTaskIdDisabled: true,
          state: state,
          isDatePostedDisabled: true,
          acceptTerms: false
        },
        isLoading: false,
        requirement: '',
        status: {}
      }
    },
    methods: {
      ...mapActions({
        openNetworkModal: types.OPEN_NETWORK_MODAL
      }),
      calendarChange (value) {
        this.$set(this.form, 'closingDate', value)
      },
      addRequirement () {
        if (this.requirement) this.form.deliverable.push(this.requirement)
        this.requirement = ''
      },
      removeRequirement (i) {
        this.form.deliverable.splice(i, 1)
      },
      createJob () {

        if (this.$store.state.web3.networkId !== "1") {
          this.openNetworkModal();
          return;
        }

        // Add Analytics event
        this.$ma.trackEvent({category: 'Click', action: 'Create Job Click', label: 'Create Job', value: ''});

        this.isLoading = true
        const {form} = this

        // if (this.hasEmptyFields) {
        //   this.isLoading = false;
        //   EventBus.$emit('notification.add', {
        //     id: 1,
        //     title: this.$t("App.createJob.emptyFieldsTitle" /* Oops! */),
        //     text: this.$t("App.createJob.emptyFieldsText" /* Please fill in all fields. */)
        //   });
        //   return false;
        // }

        this.createJobInEscrow()
          .then(JobID => {

            const self = this

            // const jobId = uuid.v1()
            const jobId = JobID.toString();

            let jobData = {
              salary: {
                'full-time-rate': form.salary
              },
              brief: form.brief,
              'date-posted': new Date(),
              deliverable: form.deliverable,
              payouts: [],
              skill: form.skill,
              domain: form.domain,
              termOfEmployment: form.termOfEmployment,
              // payouts: {
              //   evaluator: 0,
              //   manager: 0,
              //   worker: 0
              // },
              role: {
                '0': this.userId,
                '1': [this.form.setEvaluatorCreateJob,],
                '2': '',
                '3': []
              },
              sponsoredAmount: 0,
              task: form.task,
              cityOfWork: form.cityOfWork,
              taskId: jobId,
              country: form.country,
              status: {
                state: 'incomplete'
              }
            }
            db
              .collection('jobs')
              .doc(jobId)
              .set(jobData)
              .then(function (docref) {
                self.clearForm()
              })
              .catch(function (error) {
                this.isLoading = false
                console.error('Error adding new job: ', error)
              })
            if (this.hasEmptyFields) {
              this.$nextTick(() => {
                setTimeout(() => {
                  EventBus.$emit('notification.add', {
                    id: 1,
                    title: this.$t('App.createJob.jobPostedTitle' /* Yay! */),
                    text: this.$t('App.createJob.jobPostedText' /* Your job is now posted! Click here to see the job. */),
                    link: `/job/${jobId}`
                  })
                  this.isLoading = false
                }, 750)
              })
            }
          })
          .catch(error => {
            this.isLoading = false
            console.log(error)
          })
      },
      clearForm () {
        Object.keys(this.form).forEach(key => {
          this.form[key] = ''
        })
      },
      async createJobInEscrow () {

        return new Promise(async (resolve, reject) => {

          const Escrow = truffleContract(EscrowContract);
          const DAI = truffleContract(DAIContract);

          window.Escrow = Escrow;
          Escrow.setProvider(this.$store.state.web3.web3Instance().currentProvider);
          Escrow.defaults({from: this.$store.state.web3.web3Instance().eth.coinbase});
          DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

          const EscrowInstance = await Escrow.deployed();
          const DAIInstance = await DAI.deployed();

          window.EscrowInstance = EscrowInstance;
          const pool = EscrowInstance.address;

          DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
          DAI.defaults({from: this.$store.state.web3.web3Instance().eth.coinbase});

          const description = this.form.task;
          const salary = this.form.salary * (10 ** 18);
          const noOfTotalPayments = this.form.termOfEmployment;
          const evaluator = this.form.setEvaluatorCreateJob;

          web3.eth.getAccounts(async (error, accounts) => {

            console.log('create job escrow is doing something')

            const manager = accounts[0];

            console.log(EscrowInstance.address, DAIInstance.address);

            try {
              await DAIInstance.approve(EscrowInstance.address, salary, {
                from: manager
              });
              console.log('in create job')
              const result = await EscrowInstance.createJob(description, salary, noOfTotalPayments, evaluator, {
                from: manager
              });
              console.log(result);

              const job = await EscrowInstance.getJob(
                result.logs[0].args.JobID.toNumber()
              );
              resolve(result.logs[0].args.JobID.toNumber())

            } catch (error) {
              reject(error);
            }
          })
        })
      }
    },
    computed: {
      ...mapGetters({
        userId: types.GET_USER_ID
      }),
      estimatedWorkerPayout: function () {
        return this.form.salary - this.form.salary * 0.02
      },
      hasErrors () {
        return this.errors && this.errors.items.length > 0
      },
      hasEmptyFields () {
        let hasEmptyField

        Object.keys(this.form).forEach((key) => {
          if (
            (key !== 'taskId' &&
              key !== 'datePosted' &&
              (this.form[key] === '' || this.form[key] === false)) ||
            (Array.isArray(this.form[key]) && this.form[key].length === 0)
          ) {
            hasEmptyField = true
          }
        })
        return hasEmptyField
      },
      isSubmitDisabled () {
        this.x
        return this.hasErrors || this.hasEmptyFields
      }
    }
  }
</script>

<style lang="scss" module>
  .loading-parent {
    position: relative;
  }
</style>
