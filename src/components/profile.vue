<template>
  <div>

    <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <h1>{{ $t('App.profile.pageTitle' /* Profile */) }}</h1>
        </vue-grid-item>
      </vue-grid-row>

      <vue-grid-row>
        <vue-grid-item>
          <vue-panel>

            <vue-panel-body
              v-for="user in users"
              :key="user.uid">
              <p>{{ user.name || user.displayName }}</p>
              <p>{{ user.email || null }}</p>
              <p>{{ $t('App.profile.numberTitleWhatsapp' /* Whatsapp Number */) }}: {{ user.phoneWhatsapp || null }}</p>
              <p>{{ $t('App.profile.numberTitleMobile') /* Mobile Number */ }}: {{ user.phone || null }}</p>
              <!--<p>{{ user.address || null }}</p>-->
              <p>{{ user.country || null }}</p>
              <br>

              <p>
                <a @click.prevent.stop="e => {}">
                  <i class="fa edit-icon" :class="isEditingProfile ? 'fa-times' : 'fa-edit'"
                     @click="isEditingProfile = !isEditingProfile"><br><br>{{ !isEditingProfile ?
                    $t('App.job.notEditingProfileIcon' /* Edit Profile */) :
                    $t('App.job.editProfileIcon' /* Editing Profile */)}}</i>
                </a>
              </p>
              <br>

              <template v-if="isEditingProfile">

                <p>{{ $t('App.profile.updateProfile' /* Update your profile. */) }}</p><br>

                <form @submit.prevent="updateProfile()">

                  <!--<vue-grid-row>-->
                  <!--<vue-grid-item>-->
                  <!--<vue-tags-input-->
                  <!--name="tags"-->
                  <!--v-model="tag"-->
                  <!--:tags="tags"-->
                  <!--:autocomplete-items="autocompleteItems"-->
                  <!--:add-only-from-autocomplete="true"-->
                  <!--@tags-changed="updateSkills()">-->
                  <!--</vue-tags-input>-->
                  <!--</vue-grid-item>-->
                  <!--</vue-grid-row>-->
                  <!--<br>-->
                  <!--<br>-->

                  <vue-grid-row>
                    <vue-grid-item>
                      <!--<vue-input type="text" name="country" id="country" :placeholder="$t('App.profile.countryCodeTitle')" readonly-->
                      <!--v-model="form.country"/>-->
                      <vue-select
                        name="countryCodeWhatsapp"
                        id="countryCodeWhatsapp"
                        v-model="form.countryCodeWhatsapp"
                        :options="$t('countryCodesWhatsapp')"
                        :key="locale"
                        required/>
                    </vue-grid-item>

                    <vue-grid-item>
                      <vue-input type="text" name="number" id="number"
                                 :placeholder="$t('App.profile.numberTitleWhatsapp') /* Whatsapp Number */"
                                 required
                                 v-model="form.numberWhatsapp"/>
                    </vue-grid-item>
                  </vue-grid-row>

                  <vue-grid-row>
                    <vue-grid-item>
                      <!--<vue-input type="text" name="country" id="country" :placeholder="$t('App.profile.countryCodeTitle')" readonly-->
                      <!--v-model="form.country"/>-->
                      <vue-select
                        name="countryCodeMobile"
                        id="countryCodeMobile"
                        v-model="form.countryCodeMobile"
                        :options="$t('countryCodesMobile')"
                        :key="locale"
                        required/>
                    </vue-grid-item>
                    <vue-grid-item>
                      <vue-input type="text" name="number" id="number"
                                 :placeholder="$t('App.profile.numberTitleMobile') /* Mobile Number */"
                                 required
                                 v-model="form.number"/>
                    </vue-grid-item>
                  </vue-grid-row>

                  <vue-grid-row>
                    <vue-grid-item>
                      <vue-checkbox
                        name="optInWhatsappMessages"
                        id="optInWhatsappMessages"
                        v-model="form.optInWhatsappMessages"
                        :label="$t('App.profile.optInWhatsappMessages'
                        /* I want to receive Whatsapp messages when there are new jobs. */)"/>
                    </vue-grid-item>
                  </vue-grid-row>

                  <vue-grid-row>
                    <vue-grid-item>
                      <vue-checkbox
                        name="subscribeToMailingList"
                        id="subscribeToMailingList"
                        v-model="form.subscribeToMailingList"
                        :label="$t('App.profile.subscribeToMailingList'
                        /* I want to receive emails when there are new jobs. */)"/>
                    </vue-grid-item>
                  </vue-grid-row>

                  <vue-grid-row>
                    <vue-grid-item>
                      <vue-checkbox
                        name="optInTexts"
                        id="optInTexts"
                        v-model="form.optInTexts"
                        :label="$t('App.profile.optInTexts' /* I want to receive text messages when there are new jobs. */)"/>
                    </vue-grid-item>
                  </vue-grid-row>
                  <br>
                  <vue-button primary
                              :loading="isLoading">
                    {{ $t('App.profile.updateProfileButton' /* Update Profile */) }}
                  </vue-button>
                </form>
              </template>

            </vue-panel-body>
          </vue-panel>
        </vue-grid-item>
      </vue-grid-row>

      <vue-grid-row>
        <vue-grid-item>
          <vue-accordion multiple>
            <vue-accordion-item :title="$t('App.profile.incompleteJobsTitle')">
              {{ $t('App.profile.incompleteJobs' /* List of all jobs that are still open. */) }}
              <div
                v-for="(item, index) in incompleteJobs"
                :key="item.taskId + index">
                <p>{{item.task}}</p>
              </div>
            </vue-accordion-item>

            <vue-accordion-item :title="$t('App.profile.completedJobsTitle')">
              {{ $t('App.profile.completedJobs' /* List of all jobs that have all been completed and closed. */) }}
              <div
                v-for="(item, index) in completedJobs"
                :key="item.taskId + index">
                <p>{{item.task}}</p>
              </div>
            </vue-accordion-item>

            <vue-accordion-item :title="$t('App.profile.canceledJobsTitle')">
              {{ $t('App.profile.canceledJobs' /* List of all jobs that have all been canceled. */) }}
              <div
                v-for="(item, index) in canceledJobs"
                :key="item.taskId + index">
                <p>{{item.task}}</p>
              </div>
            </vue-accordion-item>

            <vue-accordion-item :title="$t('App.profile.managingJobsTitle')">
              {{ $t('App.profile.managingJobs' /* List of all jobs you are managing. */) }}
              <div
                v-for="(item, index) in managingJobs"
                :key="item.taskId + index">
                <p>{{item.task}}</p>
              </div>
            </vue-accordion-item>

            <vue-accordion-item :title="$t('App.profile.evaluatingJobsTitle')">
              {{ $t('App.profile.evaluatingJobs' /* List of all jobs you are listed as the Evaluator. */) }}
              <div
                v-for="(item, index) in evaluatingJobs"
                :key="item.taskId + index">
                <p>{{item.task}}</p>
              </div>
              <template>

              </template>
            </vue-accordion-item>

            <vue-accordion-item :title="$t('App.profile.sponsoringJobsTitle')">
              {{ $t('App.profile.sponsoringJobs' /* List of all jobs you've sponsored. */) }}
              <div
                v-for="(item, index) in sponsored"
                :key="item.sponsoredId + index">
                <p>{{item.task}}</p>
              </div>
            </vue-accordion-item>

          </vue-accordion>
        </vue-grid-item>
      </vue-grid-row>

    </vue-grid>

  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';
  import firebase from 'firebase';
  import db from '../firebaseinit';
  import * as types from '../store/types'
  import {store} from '../store';
  import SignInModal from '../services/SignInModal';
  import VueTagsInput from '@johmun/vue-tags-input';
  import axios from 'axios';

  export default {
    metaInfo: {
      title: "Your Profile in Travay",
      meta: [
        {
          name: "Profile",
          content: "Your Profile in Travay"
        }
      ]
    },
    components: {
      VueTagsInput,
    },
    name: "Profile",
    $_veeValidate: {
      validator: 'new'
    },
    data() {
      return {
        locale: '',
        isLoading: false,
        sponsored: false,
        isEditingProfile: false,
        job: {},
        jobs: {},
        users: {},
        incompleteJobs: [],
        completedJobs: [],
        evaluatingJobs: [],
        managingJobs: [],
        canceledJobs: [],
        tag: '',
        tags: [],
        autocompleteItems: [],
        debounce: null,
        form: {
          countryCodeWhatsapp: '',
          countryCodeMobile: '',
          numberWhatsapp: '',
          number: '',
          optInTexts: false,
          optInWhatsappMessages: true,
          subscribeToMailingList: true,
          tag: '',
          tags: [],
        },
      };
    },
    computed: {
      ...mapGetters({
        userId: types.GET_USER_ID
      })
    },
    watch: {
      'tag': 'initItems',
    },
    methods: {
      ...mapActions({
        saveUserInStorage: types.SAVE_USER_IN_STORAGE
      }),
      updateSkills(newTags) {
        this.autocompleteItems = [];
        this.form.tags = newTags;

        if (this.tag) this.form.tag.push(this.tag);
        this.tag = '';
        console.log('tag', this.form.tag)
      },
      initItems() {
        if (this.tag.length === 0) return;

        const skillOptions = `https://itunes.apple.com/search?term=
        ${this.tag}&entity=allArtist&attribute=allArtistTerm&limit=6`;

        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          axios.get(skillOptions).then(response => {
            this.autocompleteItems = response.data.results.map(a => {
              return {text: a.artistName};
            });
          }).catch(() => console.warn('Oh. Something went wrong'));
        }, 600);
      },
      concatenateToE164Whatsapp() {
        // const phone = this.form.country + this.form.number;
        const phoneWhatsapp = this.form.countryCodeWhatsapp + this.form.numberWhatsapp;
        return `+${phoneWhatsapp}`
      },
      concatenateToE164() {
        // const phone = this.form.country + this.form.number;
        const phone = this.form.countryCodeMobile + this.form.number;
        return `+${phone}`
      },
      async updateProfile() {
        this.isLoading = true;

        const e164Whatsapp = this.concatenateToE164Whatsapp();
        const e164 = this.concatenateToE164();

        const data = {
          optInTexts: this.form.optInTexts,
          optInWhatsappMessages: this.form.optInWhatsappMessages,
          subscribeToMailingList: this.form.subscribeToMailingList,
          phoneWhatsapp: e164Whatsapp,
          phone: e164,
          tags: this.form.tag
        };

        const user = await db.collection('users')
          .where("uid", "==", this.userId)
          .get()
          .then(snapshot => {
            snapshot.forEach(function (doc) {
              db.collection("users").doc(doc.id).update(data);
            });
            console.log(snapshot);
            this.isEditingProfile = false;
            this.isLoading = false;
          });

        this.$nextTick(() => {
          setTimeout(() => {
            this.isLoading = false;

            EventBus.$emit('notification.add', {
              id: 1,
              title: this.$t("App.profile.updateProfileTitle" /* Success! */),
              text: this.$t("App.profile.updateProfileText" /* Your profile has been update! */)
            });
          }, 700);
        });
      },
      getJobs() {
        return db
          .collection("jobs")
          .where("role.0", "==", this.userId)
          .get()
          .then(snapshot => {
            const jobs = [];
            const incompleteJobs = [];
            const completedJobs = [];
            const evaluatingJobs = [];
            const managingJobs = [];
            const canceledJobs = [];
            snapshot.forEach(item => {
              const job = item.data();

              if (job.status.state === "completed") {
                completedJobs.push(job);
              } else if (job.status.state === "cancelled") {
                canceledJobs.push(job);
              } else {
                incompleteJobs.push(job);
              }

              if (job.role[0] === this.userId) {
                managingJobs.push(job);
              }

              if (job.role[1] === this.userId) {
                evaluatingJobs.push(job);
              }
            });
            this.incompleteJobs = incompleteJobs;
            this.completedJobs = completedJobs;
            this.evaluatingJobs = evaluatingJobs;
            this.managingJobs = managingJobs;
            this.canceledJobs = canceledJobs;
            Promise.resolve(true);
          });
      },
      getUser() {
        return db
          .collection("users")
          .where("uid", "==", this.userId)
          .get()
          .then(snapshot => {
            const users = [];
            snapshot.forEach(item => {
              users.push(item.data());
            });
            this.users = users;
            Promise.resolve(true);
          });
      },
      getSponsored() {
        return db
          .collection("sponsored")
          .where("userId", "==", this.userId)
          .get()
          .then(snapshot => {
            const sponsored = [];
            snapshot.forEach(item => {
              sponsored.push(item.data());
            });
            this.sponsored = sponsored;
            Promise.resolve(true);
          });
      },
      async prepareData() {
        this.isLoading = true;
        try {
          await Promise.all([
            this.getUser(),
            this.getJobs(),
            this.getSponsored()
          ]);
        } catch (error) {
          console.error(error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    created() {
      this.prepareData();
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          this.saveUserInStorage(JSON.parse(userData));
        }
      } catch (error) {
        console.log('err when trying to get user data from storage', error);
      }
    }
  };
</script>
