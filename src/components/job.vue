<template>
  <div class="loading-parent" :class="$style.job">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage">
    </loading>
    <vue-grid v-if="job">

      <vue-grid-row>
        <vue-grid-item fill>
          <h1>{{ $t('App.job.pageHeader' /* Job */) }}</h1>
        </vue-grid-item>
      </vue-grid-row>

      <sponsor-modal
        :job="job"
        :show.sync="showSponsoredModal"
        @sponsorSubmit="amount => sponsorSubmit({
          amount,
          taskId: this.job.taskId,
          task: this.job.task,
          job: this.job
        })"></sponsor-modal>

      <vue-grid-row>
        <vue-grid-item>
          <vue-panel>
            <vue-panel-header>
              <router-link :key="`/job/${job.taskId}`">{{ job.task }}</router-link>
            </vue-panel-header>

            <vue-panel-body>
              <p v-if="'status' in job && job.status.state === 'cancelled'">This job has been cancelled</p>

              <p v-if="job.role && userId && ('status' in job && job.status.state !== 'cancelled')">
                <a v-if="job.role['0'] === userId" @click.prevent.stop="e => {}">
                  <i class="fa edit-icon" :class="isEditingJobDetails ? 'fa-times' : 'fa-edit'"
                     @click="isEditingJobDetails = !isEditingJobDetails"></i>
                  {{ $t('App.job.editJobIcon' /* Edit */) }}
                </a>
              </p>

              <ul>
                <li v-if="job.salary">
                  <h1>{{job.task}}</h1><br>

                  <template v-if="isEditingJobDetails">

                    <p><em>{{ $t('App.job.isEditingInstructions' /* After a job is posted you can only update the
                      Description and Requirements. */) }}</em></p><br>

                    <strong>{{ $t('App.job.jobDescription' /* Description */) }}</strong>:<br>

                    <input
                      id="job-description"
                      type="text"
                      v-model="job.brief"/> <br><br>

                    <strong>{{ $t('App.job.jobRequirements' /* Requirements */) }}</strong>:<br>

                    <em>{{ $t('App.job.requirementInstructions' /* Add one requirement, then click Add Requirement, to
                      add additional requirements. */) }}</em><br/>

                    <vue-grid-item>
                      <vue-input
                        name="deliverable"
                        id="deliverable"
                        placeholder="Requirement for Job to be Complete"
                        validation="required"
                        v-model="requirement"
                        required/>
                      <button accent @click="addRequirement">
                        {{ $t('App.job.addRequirement' /* Add Requirement */) }}
                      </button>
                      <br>
                    </vue-grid-item>
                    <br>
                    <br>
                    <vue-grid-item>
                      <p v-for="(req, i) in job.deliverable" :key="i">
                        <vue-badge accent>{{req}} -</vue-badge>
                        <span @click="removeRequirement(i)">
                          X
                        </span>
                        <br>
                        <br>
                      </p>
                    </vue-grid-item>
                  </template>

                  <template v-else>
                    <strong>{{ $t('App.job.jobDescription' /* Description */) }}:</strong> {{job.brief}}<br><br>

                    <strong>{{ $t('App.job.jobDomain' /* Domain */) }}:</strong> {{job.domain}}<br><br>

                    <strong>{{ $t('App.job.jobSkill' /* Desired Skill */) }}:</strong> {{job.skill}}<br><br>

                    <strong>{{ $t('App.job.jobSalary' /* Salary (USD) */) }}:</strong>
                    ${{job.salary['full-time-rate']}}<br><br>

                    <strong>{{ $t('App.job.jobSponsoredAmount' /* Sponsored Amount */) }}:</strong> ${{
                    job.sponsoredAmount }}<br><br>

                    <!--{{ $t('App.job.jobPayFrequency' /* Pay Frequency */) }}: {{job.salary['pay-frequency'].label}}<br>-->

                    <strong>{{ $t('App.job.termOfEmployment' /* Terms of Employment (Months) */) }}:</strong> {{
                    job.termOfEmployment }}<br><br>

                    <strong>{{ $t('App.job.cityOfWork' /* City of Work */) }}:</strong> {{ job.cityOfWork }}
                    <br><br>

                    <strong>{{ $t('App.job.countryOfWork' /* Country of Work */) }}:</strong> {{ job.country }}
                    <br><br>

                    <strong>{{ $t('App.job.requirements' /* Requirements */) }}:</strong><br><br>
                    <p v-for="(item, index) in job.deliverable" :key="index">
                      + {{item}}
                    </p>
                  </template>
                  <br>
                  <strong>{{ $t('App.job.datePosted' /* Date Posted */) }}:</strong> {{ job['date-posted'] | moment
                  }}<br>
                </li>
              </ul>
            </vue-panel-body>
            <vue-panel-footer>
              <template v-if="isEditingJobDetails">
                <vue-grid-row>
                  <vue-grid-item>
                    <vue-button primary
                                @click.prevent.stop="e => postEditedJob(job.id)">
                      {{ $t('App.job.postChangesButton' /* Post Changes */) }}
                    </vue-button>
                  </vue-grid-item>

                  <br>
                  <br>
                  <br>

                  <vue-grid-item>
                    <vue-button warn
                                @click="cancelJob()">
                      {{ $t('App.job.cancelJob' /* Cancel Job */) }}
                    </vue-button>
                  </vue-grid-item>
                </vue-grid-row>
              </template>
            </vue-panel-footer>
          </vue-panel>
        </vue-grid-item>
      </vue-grid-row>

      <vue-grid-row>
        <vue-grid-item>
          <vue-panel>
            <vue-panel-body>

              <h3>{{ $t('App.job.claimTitle' /* Claim */) }}</h3>

              <vue-grid-item>
                {{ $t('App.job.claimDescription' /* Claiming a job is as simply as clicking the button Claim. The button
                will only be visible if the job is not claimed by anyone and an individual is logged in. */) }}<br><br>
              </vue-grid-item>

              <template v-if="!claimed">
                <vue-grid-item v-userRole.signedIn.canClaim="{role: job.role}">
                  <vue-checkbox
                    name="acceptTerms"
                    id="acceptTerms"
                    v-model="form.acceptTerms"
                    label=""
                    validation="required"/>
                  {{ $t('App.job.claimDisclaimer' /* Claiming this position is to accept the job requirements, and terms
                  and conditions, and code of conduct of Travay. */) }}
                </vue-grid-item>
                <br>

                <vue-grid-item>
                  <vue-button v-userRole.signedIn.canClaim="{role: job.role}"
                              primary @click.prevent="claimJob(job.id)">
                    {{ $t('App.job.claim' /* Claim */) }}
                  </vue-button>
                  <br>
                  <br>
                  <vue-button v-userRole.signedIn.worker="{role: job.role}"
                              primary @click.prevent.stop="e => claimPayout(job.id)">
                    {{ $t('App.job.claimPayout' /* Claim Payout */) }}
                  </vue-button>
                </vue-grid-item>
              </template>

            </vue-panel-body>
            <vue-panel-footer>

            </vue-panel-footer>
          </vue-panel>
        </vue-grid-item>
      </vue-grid-row>

      <vue-grid-row>
        <vue-grid-item>
          <vue-grid-row>
            <vue-grid-item>
              <vue-panel>
                <vue-panel-body>
                  <h3>{{ $t('App.job.sponsorJobButton' /* Sponsor Job */) }}</h3>

                  <vue-grid-item>
                    <p>{{ $t('App.job.sponsorDescription' /* Job sponsorship is where anyone in the world can donate and
                      contribute to the workplace ecosystem. Choosing to sponsor ensures transparency in funds donated
                      and incentives job workers to continue to perform and accept jobs. */) }}</p>
                  </vue-grid-item>

                </vue-panel-body>
                <vue-panel-footer>
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
            </vue-grid-item>
          </vue-grid-row>
        </vue-grid-item>
      </vue-grid-row>

      <vue-grid-row>
        <vue-grid-item>
          <vue-grid-row>
            <vue-grid-item>
              <vue-panel>
                <vue-panel-body>

                  <h3>{{ $t('App.job.proofOfWorkTitle' /* Proof of Work */) }}</h3>

                  <vue-grid-item>
                    <p>{{ $t('App.job.proofOfWorkDescription' /* Based on the requirements of a job, the Job Manager may
                      request proof that work was completed. For example, a picture of a planted tree. If the worker has
                      provided proof it will be shown below. */)
                      }}
                    </p>
                    <br>
                    <div class="job-images">
                      <div
                        v-for="(img, index) in this.job.images"
                        :key="index"
                        class="job-image-block">
                        <img :src="img.url" :alt="img.name"/>
                      </div>
                    </div>
                  </vue-grid-item>

                  <!--<vue-grid-item v-if="job.role" v-userRole.signedIn.worker="{cb: uploadFile, role: job.role}">-->
                  <vue-grid-item v-userRole.worker="{role: job.role}">
                    <div v-for="(image, index) in this.images" :key="index">
                      <a @click.prevent="removeImage(index)">X</a>
                      <img :src="image"/>
                    </div>
                    <!-- THE CHOOSE IMAGE BUTTON -->
                    <h5>{{ $t('App.job.uploadProofOfWorkTitle' /* Upload Proof of Work */) }}</h5>
                    <span class="input-group-text btn btn-primary btn-file" id="basic-addon2">
                        <input type="file" v-on:change="fileUploaded" accept="image/png, image/jpeg, image/gif"
                               name="input-file-preview" multiple/>
                      </span>

                    <div>
                      <p>{{ loadingText }}</p>
                    </div>
                  </vue-grid-item>

                </vue-panel-body>
                <!--<vue-panel-footer v-if="job.role">-->
                <!-- UPLOAD IMAGE BUTTON -->
                <vue-panel-footer>
                  <vue-button v-userRole.worker="{cb: uploadFile, role: job.role}" accent>
                    <a @click.prevent="uploadProofOfWork()" style="color: white;">
                      {{ $t('App.job.uploadFileButton' /* Save Uploaded Images */) }}
                    </a>
                  </vue-button>
                  <br><br>
                  <!--<vue-button v-userRole.worker="{role: job.role}" accent>-->
                  <!--<a @click.prevent="uploadProofOfWork()" style="color: white;">-->
                  <!--{{ $t('App.job.uploadProofOfWorkButton' /* Upload Files */) }}-->
                  <!--</a>-->
                  <!--</vue-button>-->
                  <br><br>
                  <a v-userRole.worker="{role: job.role}" @click="markJobComplete" style="color: white;">
                    <vue-button warn>
                      {{ $t('App.job.markJobComplete' /* Job is Done */) }}
                    </vue-button>
                  </a>
                  <br><br>
                  <h3>{{ $t('App.job.evaluation' /* Evaluation */) }}</h3>
                  <br>
                  <p>{{ $t('App.job.evaluationDescription' /* After a job is claimed an evaluator must be assigned. An
                    evaluator confirms the completion of work. If assigned as an evaluator the below area will show
                    additional information. */)
                    }}</p>
                  <br>
                  <a v-userRole.signedIn.canBecomeEvaluator="{role: job.role}" @click="setEvaluator()"
                     style="color: white;">
                    <vue-button primary>
                      {{ $t('App.job.becomeEvaluatorForJob' /* Become the Evaluator */) }}
                    </vue-button>
                  </a>
                  <br><br>
                  <a @click="evaluateJobAsCompletedSucessfully()" v-userRole.signedIn.evaluator="{role: job.role}"
                     style="color: white;">
                    <vue-button primary>
                      {{ $t('App.job.evaluateJobAsSuccess' /* Approve Work */) }}
                    </vue-button>
                  </a>
                  <!--<vue-button v-userRole.evaluator="{role: job.role}" warn>-->
                  <!--<a @click="evaluateJobAsCompletedUnsucessfully()" style="color: white;">-->
                  <!--{{ $t('App.job.evaluateJobAsUnsuccessful' /* Disapprove Work */) }}-->
                  <!--</a>-->
                  <!--</vue-button>-->
                </vue-panel-footer>
              </vue-panel>
            </vue-grid-item>
          </vue-grid-row>
        </vue-grid-item>
      </vue-grid-row>

      <vue-grid-row>
        <vue-grid-item>
          <vue-grid-row>
            <vue-grid-item>
              <vue-panel>
                <vue-panel-body v-userRole.manager="{role: job.role}">
                  <h3>{{ $t('App.job.approveWork' /* Approve Work */) }}</h3>

                  <vue-grid-item>
                    <p>{{ $t('App.job.approveWorkDescription' /* Approval history will be shown here. Once a job is
                      approved, the job is marked complete and the worker receives their salary. This is not reversible.
                      */) }}</p>
                  </vue-grid-item>
                </vue-panel-body>
                <vue-panel-footer v-userRole.manager="{role: job.role}">
                  <vue-grid-item>
                    <vue-button primary style="color: white;"
                                @click.prevent.stop="e => payoutJob(job.id)">
                      {{ $t('App.job.payoutJobButton' /* Payout Job */) }}
                    </vue-button>
                  </vue-grid-item>

                </vue-panel-footer>
              </vue-panel>
            </vue-grid-item>
          </vue-grid-row>
        </vue-grid-item>
      </vue-grid-row>

    </vue-grid>
  </div>
</template>

<script>
import { store } from "../store/";
import * as types from "../store/types";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { NETWORKS } from "../util/constants/networks";
import axios from "axios";
import firebase from "firebase";
import db from "../firebaseinit";
import SponsorModal from "../services/SponsorModal.vue";
import { uuid } from "vue-uuid";
import moment from "moment";
import { sponsorSubmitMixin } from "../mixins/sponsorSubmitMixin";
import truffleContract from "truffle-contract";
import EscrowContract from "../../contracts/build/contracts/Escrow.json";
import DAIContract from "../../contracts/build/contracts/DAI.json";
import Loading from "vue-loading-overlay";

const firebaseStorage = firebase.storage();

export default {
  mixins: [sponsorSubmitMixin],
  metaInfo: {
    title: "Job",
    meta: [
      {
        name: "Details of a job",
        content: "Details of a job in Travay."
      }
    ]
  },
  name: "job",
  $_veeValidate: {
    validator: "new"
  },
  components: {
    SponsorModal,
    Loading
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      job: {},
      posted: "",
      taskId: "",
      form: {
        acceptTerms: false,
        newsletter: false
      },
      showSponsoredModal: false,
      isEditingJobDetails: false,
      file: "",
      fileName: "",
      image: "",
      imagePreview: "",
      loadingText: "",
      sponsoredAmount: 0,
      images: [],
      requirement: "",
      requirements: [],
      claimed: false,
      termOfEmployment: 0
    };
  },
  created() {
    const taskId = this.$route.params.id;
    db.collection("jobs")
      .where("taskId", "==", taskId)
      .get()
      .then(snapshot => {
        const jobs = [];
        const jobsId = [];
        snapshot.forEach(job => {
          let jobData = job.data();
          let jobId = job.id;
          jobs.push(jobData);
          jobsId.push(jobId);
        });
        this.job = jobs[0];
        this.job.id = jobsId[0];
      })
      .catch(error => {
        console.error("Error while trying to get the job", error);
      });
  },
  filters: {
    moment: function(date) {
      return moment(date).format("Do MMMM YYYY");
    }
  },
  computed: {
    ...mapGetters({
      userId: types.GET_USER_ID
    }),
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      let hasEmptyField = false;
      Object.keys(this.form).forEach(key => {
        if (
          key !== "newsletter" &&
          (this.form[key] === "" || this.form[key] === false)
        ) {
          hasEmptyField = true;
        }
      });
      return hasEmptyField;
    },
    isSubmitDisabled() {
      return this.hasErrors || this.hasEmptyFields;
    }
  },
  methods: {
    //...mapActions("signInModal", ["openLoginModal", "closeLoginModal"]),
    ...mapActions({
      openLoginModal: types.OPEN_LOGIN_MODAL,
      closeLoginModal: types.CLOSE_LOGIN_MODAL,
      openNetworkModal: types.OPEN_NETWORK_MODAL
    }),
    removeImage(i) {
      this.images = this.images.filter((img, index) => index !== i);
    },
    addRequirement() {
      if (this.requirement) {
        if (Reflect.has(this.job, "deliverable")) {
          this.job.deliverable.push(this.requirement);
        } else {
          this.job.deliverable = [this.requirement];
        }
      }
      this.requirement = "";
    },
    removeRequirement(index) {
      this.job.deliverable.splice(index, 1);
    },
    cancelJob() {
      if (this.$store.state.web3.networkId !== "1") {
        this.openNetworkModal();
        return;
      }

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Canceled Job",
        label: "Cancel Job",
        value: ""
      });

      this.isLoading = true;

      const jobId = this.job.taskId;

      this.cancelJobInEscrow()
        .then(JobID => {
          console.log("job is being canceled");
          const job = db.collection("jobs").doc(jobId);
          const update = job.update({
            status: {
              state: "cancelled",
              dateCanceled: new Date()
            }
          });
          // this.job.status.state = "cancelled";
          this.isEditingJobDetails = false;

          EventBus.$emit("notification.add", {
            id: 1,
            title: this.$t(
              "App.job.jobCanceledNotificationTitle" /* Success! */
            ),
            text: this.$t(
              "App.job.jobCanceledNotificationText" /* This job has been cancelled. */
            )
          });
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    setEvaluator() {
      if (this.$store.state.web3.networkId !== "1") {
        this.openNetworkModal();
        return;
      }

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Set Evaluator",
        label: "Set Evaluator",
        value: ""
      });

      this.isLoading = true;

      // TODO evaluator's ID is not being stored in Firebase
      this.setEvaluatorInEscrow().then(JobID => {
        try {
          db.collection("jobs")
            .doc(docId)
            .update({
              "role.1": this.userId
            });
          const result = db
            .collection("users")
            .where("uid", "==", this.userId)
            .get()
            .then(snapshots => {
              const doc = snapshots.docs[0];
              const userData = doc.data();
              const obj = { doc, user: userData, evaluatingJobs: [] };
              if (Reflect.has(userData, "evaluatingJobs")) {
                obj.evaluatingJobs = userData.evaluatingJobs;
              }
              return obj;
            })
            .then(({ doc, user, evaluatingJobs }) => {
              doc.ref.update({
                evaluatingJobs: [...evaluatingJobs, this.job.taskId]
              });
            });
          this.$nextTick(() => {
            setTimeout(() => {
              this.isLoading = false;

              EventBus.$emit("notification.add", {
                id: 1,
                title: this.$t(
                  "App.job.jobEvaluatorNotificationTitle" /* Thank you! */
                ),
                text: this.$t(
                  "App.job.jobEvaluatorNotificationText"
                  /* You are now the evaluator for this job. */
                )
              });
            }, 700);
          });
        } catch (error) {
          this.isLoading = false;
          console.log("error when adding job in firebase", error);
        }
      });
    },
    markJobComplete() {
      if (this.$store.state.web3.networkId !== "1") {
        this.openNetworkModal();
        return;
      }

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Mark Job Complete",
        label: "Mark Job Complete",
        value: ""
      });

      const jobId = this.job.taskId;

      this.isLoading = true;

      this.proofOfWorkToEscrow()
        .then(JobID => {
          const job = db.collection("jobs").doc(jobId);
          const update = job.update({
            // TODO solve undefined error
            // workerMilestonesCompleted: [...workerMilestoneCompleted, new Date()]
          });

          this.job.status.state = "complete";
          this.isLoading = false;

          EventBus.$emit("notification.add", {
            id: 1,
            title: this.$t(
              "App.job.jobCompletedNotificationTitle" /* Success! */
            ),
            text: this.$t(
              "App.job.jobCompleteNotificationText" /* This job has been marked completed. Your Job Manager will review the work and send payment after confirming. */
            )
          });
        })
        .catch(error => {
          this.isLoading = false;
          console.log(error);
        });
    },
    evaluateJobAsCompletedSucessfully() {
      if (this.$store.state.web3.networkId !== "1") {
        this.openNetworkModal();
        return;
      }

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Evaluate Job As Completed Successfully",
        label: "Evaluate Job As Completed Successfully",
        value: ""
      });

      this.isLoading = true;

      const jobId = this.job.taskId;

      this.evaluateJobToEscrow()
        .then(JobID => {
          const job = db.collection("jobs").doc(jobId);

          const update = job.update({
            status: {
              milestoneCompletedSuccessfully: new Date(),
              state: "incomplete"
            }
          });
          EventBus.$emit("notification.add", {
            id: 1,
            title: this.$t(
              "App.job.jobCompletedNotificationTitle" /* Success! */
            ),
            text: this.$t(
              "App.job.jobCompleteNotificationText" /* This job has been marked completed. Your Job Manager will review the work and send payment after confirming. */
            )
          });
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          console.log(error);
        });
    },
    async evaluateJobAsCompletedUnsucessfully() {
      // const jobId = this.job.taskId;

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Evaluate Job As Completed Unsuccessfully",
        label: "Evaluate Job As Completed Unsuccessfully",
        value: ""
      });

      //  this.isLoading = true;
      //
      // try {
      //   const job = await db.collection("jobs").doc(jobId);
      //   const update = await job.update({
      //     status: {
      //       successfullyCompleted: "false"
      //     }
      //   });
      //   this.isEditingJobDetails = false;
      //
      //   // TODO update toaster and determine how to handle this
      //   EventBus.$emit('notification.add', {
      //     id: 1,
      //     title: this.$t("App.job.jobUnCompletedNotificationTitle" /* Update Complete */),
      //     text: this.$t("App.job.jobUnCompleteNotificationText"
      //       /* This job has been marked as not completed successfully.. */)
      //   });
      //   this.isLoading = false;
      // } catch (error) {
      //   console.log(error)
      // }
    },
    claimPayout() {
      if (this.$store.state.web3.networkId !== "1") {
        this.openNetworkModal();
        return;
      }

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Claim Payout",
        label: "Claim Payout",
        value: ""
      });

      this.isLoading = true;

      this.workerClaimPayoutInEscrow().then(JobID => {
        // TODO updating payouts array in Firebase not working
        try {
          db.collection("jobs")
            .doc(docId)
            .update({
              payouts: new Date()
            });
          const result = db
            .collection("users")
            .where("uid", "==", this.userId)
            .get()
            .then(snapshots => {
              const doc = snapshots.docs[0];
              const userData = doc.data();
              const obj = { doc, user: userData, claimedPayouts: [] };
              if (Reflect.has(userData, "claimedPayouts")) {
                obj.claimedPayouts = userData.claimedPayouts;
              }
              return obj;
            })
            .then(({ doc, user, claimedPayouts }) => {
              doc.ref.update({
                claimedPayouts: [...claimedPayouts, new Date()]
              });
            });
          this.$nextTick(() => {
            setTimeout(() => {
              this.isLoading = false;

              EventBus.$emit("notification.add", {
                id: 1,
                title: this.$t(
                  "App.job.workerClaimedPayoutNotificationTitle" /* Success! */
                ),
                text: this.$t(
                  "App.job.workerClaimedPayoutNotificationText"
                  /* You will see your salary in your MetaMask account soon. */
                )
              });
            }, 700);
          });
        } catch (error) {
          this.isLoading = false;
          console.log("error when adding job in firebase", error);
        }
      });
    },
    sponsorJob(taskId) {
      if (this.$store.state.web3.networkId !== "1") {
        this.openNetworkModal();
        return;
      }

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Sponsor Job from Job Page",
        label: "Sponsor Job from Job Page",
        value: ""
      });

      if (!this.userId) {
        this.openLoginModal();
        return;
      }
      this.selectedJobToSponsorId = taskId;
      this.showSponsoredModal = true;
    },
    getJob() {
      axios.get("/jobs.json").then(response => {
        const job = response.data.jobs.filter(
          job => job.taskId === this.$route.params.taskId
        );
        if (job.length > 0) {
          this.job = job[0];
        }
      });
    },
    claimJob(docId) {
      if (this.$store.state.web3.networkId !== "1") {
        this.openNetworkModal();
        return;
      }

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Claim Job Click",
        label: "Claim Job",
        value: ""
      });

      this.isLoading = true;

      // TODO: fix the checkbox field for approving the terms when claiming a job
      if (this.hasEmptyFields) {
        EventBus.$emit("notification.add", {
          id: 1,
          title: this.$t("App.job.jobEmptyFieldNotificationTitle" /* Oops */),
          text: this.$t(
            "App.job.jobEmptyFieldNotificationText" /* Please complete all fields. */
          )
        });

        return false;
      }

      this.claimJobInEscrowContract()
        .then(response => {
          try {
            db.collection("jobs")
              .doc(docId)
              .update({
                "role.2": this.userId
              });
            const result = db
              .collection("users")
              .where("uid", "==", this.userId)
              .get()
              .then(snapshots => {
                const doc = snapshots.docs[0];
                const userData = doc.data();
                const obj = { doc, user: userData, claimedJobs: [] };
                if (Reflect.has(userData, "claimedJobs")) {
                  obj.claimedJobs = userData.claimedJobs;
                }
                return obj
              })
              .then(({ doc, user, claimedJobs }) => {
                doc.ref.update({
                  claimedJobs: [...claimedJobs, this.job.taskId]
                });
              });
            this.$nextTick(() => {
              setTimeout(() => {
                this.isLoading = false;

                EventBus.$emit("notification.add", {
                  id: 1,
                  title: this.$t(
                    "App.job.jobClaimedNotificationTitle" /* Yay! */
                  ),
                  text: this.$t(
                    "App.job.jobClaimedNotificationText" /* Job confirmed successfully! You can start work immediately. */
                  )
                });
              }, 700);
            });
          } catch (error) {
            this.isLoading = false;
            console.log("error when adding job in firebase", error);
          }
        })
        .catch(error => {
          this.isLoading = false;
          console.log("bad", error);
        });
    },
    payoutJob(docId) {
      if (this.$store.state.web3.networkId !== "1") {
        this.openNetworkModal();
        return;
      }

      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Payout Job",
        label: "Payout Job",
        value: ""
      });

      const taskId = this.$route.params.id;

      this.isLoading = true;

      this.managerApprovesPaymentInEscrow().then(JobID => {
        db.collection("jobs")
          .doc(docId)
          .get()
          .then(snapshots => {
            const doc = snapshots;
            const jobData = doc.data();
            const obj = { doc, user: jobData, payOutsToWorker: [] };
            if (Reflect.has(jobData, "payOutsToWorker")) {
              obj.payOutsToWorker = jobData.payOutsToWorker;
            }
            return obj;
          })
          .then(({ doc, payOutsToWorker }) => {
            doc.ref.update({
              payOutsToWorker: [...payOutsToWorker, new Date()]
            });
          })
          .catch(error => console.log(error));
        this.$nextTick(() => {
          EventBus.$emit("notification.add", {
            id: 1,
            title: this.$t(
              "App.job.jobPayoutNotificationTitle" /* Your worker thanks you! */
            ),
            text: this.$t(
              "App.job.jobPayoutNotificationTitleText" /* Payout Complete. Your account is being debited. */
            )
          });
          this.isLoading = false;
        });
      });
    },
    async postEditedJob() {
      this.isLoading = true;

      const jobData = {
        description: this.job.brief,
        deliverable: this.job.deliverable
      };
      const jobRef = await db
        .collection("jobs")
        .doc(this.job.taskId)
        .get();
      jobRef.ref
        .update({
          ...jobData
        })
        .then(function() {
          console.log("Record successfully updated!");
        })
        .catch(function(error) {
          console.error("Error updating record: ", error);
        });

      this.$nextTick(() => {
        setTimeout(() => {
          this.isLoading = false;

          EventBus.$emit("notification.add", {
            id: 1,
            title: this.$t(
              "App.job.jobUpdatedNotificationTitle" /* Success! */
            ),
            text: this.$t(
              "App.job.jobUpdatedNotificationText" /* Job updated successfully! */
            )
          });
        }, 700);
      });
      this.isEditingJobDetails = false;
    },
    uploadProofOfWork() {
      // Add Analytics event
      this.$ma.trackEvent({
        category: "Click",
        action: "Upload Proof of Work",
        label: "Upload Proof of Work",
        value: ""
      });

      this.isLoading = true;
      this.uploadImages().then(res => {
        console.log("Im done running both funcs");
      });
    },
    async uploadImages() {
      const self = this;
      const results = this.images.map(async file => {
        const imageUrl = await this.uploadFile(file, self.job.taskId);
        return { name: file.name, url: imageUrl };
      });

      Promise.all(results).then(async imageUrls => {
        if (!Reflect.has(this.job, "images")) this.job.images = [];
        const images = [...this.job.images, ...imageUrls];
        const result = await db
          .collection("jobs")
          .doc(this.job.taskId)
          .set({ images }, { merge: true })
          .then(docRef => {
            console.log("updated!", docRef);
          });
      });
    },
    uploadFile(file, jobId) {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        const self = this;
        const storageRef = firebaseStorage
          .ref()
          .child("jobs/" + jobId + "/" + file.name + "-" + uuid.v1());
        let uploadTask = storageRef.put(file);
        uploadTask.on(
          "state_changed",
          function(snapshot) {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // TODO fix on screen loading percentage of image upload
            // self.loadingText =
            //   this.$t('App.job.uploadedPhotoProgress' /* Upload is */) +
            //   progress +
            //   this.$t(
            //     'App.job.uploadedPhotoProgress2' /* % done. Processing post. */);
            // this.upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
            // console.log(this.upload.progress);
          },
          function(error) {
            reject(error);
          },
          async function() {
            const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
            resolve(downloadUrl);
          }
        );
        this.isLoading = false;
      });
    },
    async fileUploaded(event) {
      const image = event.target.files[0];
      this.images.push(image);
    },
    async claimJobInEscrowContract() {
      return new Promise(async (resolve, reject) => {
        const Escrow = truffleContract(EscrowContract);
        const DAI = truffleContract(DAIContract);

        window.Escrow = Escrow;
        Escrow.setProvider(
          this.$store.state.web3.web3Instance().currentProvider
        );
        Escrow.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });
        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

        const EscrowInstance = await Escrow.deployed();
        const DAIInstance = await DAI.deployed();

        window.EscrowInstance = EscrowInstance;
        const pool = EscrowInstance.address;

        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
        DAI.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });

        const JobID = this.job.taskId;

        web3.eth.getAccounts(async (error, accounts) => {
          const worker = accounts[0]; // account that is logged into MetaMask

          if (error) {
            throw new {
              name: "Exception",
              message: "Accounts are not found"
            }();
          }

          try {
            const result = await EscrowInstance.claimJob(JobID, {
              from: worker
            });
            console.log(result);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    async cancelJobInEscrow() {
      return new Promise(async (resolve, reject) => {
        const Escrow = truffleContract(EscrowContract);
        const DAI = truffleContract(DAIContract);

        window.Escrow = Escrow;
        Escrow.setProvider(
          this.$store.state.web3.web3Instance().currentProvider
        );
        Escrow.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });
        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

        const EscrowInstance = await Escrow.deployed();
        const DAIInstance = await DAI.deployed();

        window.EscrowInstance = EscrowInstance;
        const pool = EscrowInstance.address;

        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
        DAI.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });

        const JobID = this.job.taskId;

        web3.eth.getAccounts(async (error, accounts) => {
          const manager = accounts[0];

          try {
            console.log("JobID", JobID);
            console.log(typeof JobID);

            const result = await EscrowInstance.cancelJob(JobID, {
              from: manager
            });
            resolve(result.logs[0].args.JobID);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    async setEvaluatorInEscrow() {
      return new Promise(async (resolve, reject) => {
        const Escrow = truffleContract(EscrowContract);
        const DAI = truffleContract(DAIContract);

        window.Escrow = Escrow;
        Escrow.setProvider(
          this.$store.state.web3.web3Instance().currentProvider
        );
        Escrow.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });
        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

        const EscrowInstance = await Escrow.deployed();
        const DAIInstance = await DAI.deployed();

        window.EscrowInstance = EscrowInstance;
        const pool = EscrowInstance.address;

        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
        DAI.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });

        const JobID = this.job.taskId;

        web3.eth.getAccounts(async (error, accounts) => {
          const evaluator = accounts[0]; // account that is logged into MetaMask

          if (error) {
            throw new {
              name: "Exception",
              message: "Accounts are not found"
            }();
          }

          try {
            await EscrowInstance.setEvaluator(JobID, { from: evaluator });
            resolve(JobID);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    async proofOfWorkToEscrow() {
      return new Promise(async (resolve, reject) => {
        const Escrow = truffleContract(EscrowContract);
        const DAI = truffleContract(DAIContract);

        window.Escrow = Escrow;
        Escrow.setProvider(
          this.$store.state.web3.web3Instance().currentProvider
        );
        Escrow.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });
        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

        const EscrowInstance = await Escrow.deployed();
        const DAIInstance = await DAI.deployed();

        window.EscrowInstance = EscrowInstance;
        const pool = EscrowInstance.address;

        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
        DAI.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });

        web3.eth.getAccounts(async (err, accounts) => {
          const worker = accounts[0];
          const JobID = this.job.taskId;

          try {
            const result = await EscrowInstance.provideProofOfWork(JobID, {
              from: worker
            });
            resolve(JobID);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    async evaluateJobToEscrow() {
      return new Promise(async (resolve, reject) => {
        const Escrow = truffleContract(EscrowContract);
        const DAI = truffleContract(DAIContract);

        window.Escrow = Escrow;
        Escrow.setProvider(
          this.$store.state.web3.web3Instance().currentProvider
        );
        Escrow.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });
        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

        const EscrowInstance = await Escrow.deployed();
        const DAIInstance = await DAI.deployed();

        window.EscrowInstance = EscrowInstance;
        const pool = EscrowInstance.address;

        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
        DAI.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });

        web3.eth.getAccounts(async (err, accounts) => {
          const JobID = this.job.taskId;
          const evaluator = accounts[0]; // Person logged into MetaMask

          try {
            console.log("JobID", JobID);
            console.log(typeof JobID);

            const result = await EscrowInstance.confirmProofOfWork(JobID, {
              from: evaluator
            });
            resolve(JobID);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    async managerApprovesPaymentInEscrow() {
      return new Promise(async (resolve, reject) => {
        const Escrow = truffleContract(EscrowContract);
        const DAI = truffleContract(DAIContract);

        window.Escrow = Escrow;
        Escrow.setProvider(
          this.$store.state.web3.web3Instance().currentProvider
        );
        Escrow.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });
        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

        const EscrowInstance = await Escrow.deployed();
        const DAIInstance = await DAI.deployed();

        window.EscrowInstance = EscrowInstance;
        const pool = EscrowInstance.address;

        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
        DAI.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });

        const JobID = this.job.taskId;

        web3.eth.getAccounts(async (err, accounts) => {
          const manager = accounts[0];

          try {
            const result = await EscrowInstance.approvePayment(JobID, {
              from: manager
            });
            resolve(JobID);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    async workerClaimPayoutInEscrow() {
      return new Promise(async (resolve, reject) => {
        const Escrow = truffleContract(EscrowContract);
        const DAI = truffleContract(DAIContract);

        window.Escrow = Escrow;
        Escrow.setProvider(
          this.$store.state.web3.web3Instance().currentProvider
        );
        Escrow.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });
        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

        const EscrowInstance = await Escrow.deployed();
        const DAIInstance = await DAI.deployed();

        window.EscrowInstance = EscrowInstance;
        const pool = EscrowInstance.address;

        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
        DAI.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });

        web3.eth.getAccounts(async (error, accounts) => {
          const worker = accounts[0];
          const JobID = this.job.taskId;

          console.log(JobID);

          try {
            const Job = await EscrowInstance.getJob(JobID);

            const result = await EscrowInstance.claimPayment(JobID, {
              from: worker
            });

            resolve(JobID);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" module>
  .loading-parent {
    position: relative;
  }
</style>
