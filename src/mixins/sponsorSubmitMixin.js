import { uuid } from 'vue-uuid';
import db from '../firebaseinit';
import * as types from '@/store/types';

export const sponsorSubmitMixin = {
  methods: {
    async sponsorSubmit({ amount, taskId, task, job = {} }) {
      const data = {
        sponsoredId: uuid.v1(),
        userId: this.$store.getters[types.GET_USER_ID],
        amount,
        taskId: taskId,
        task: task,
        date: new Date()
      };
      console.log('data for sponsored', data);
      try {
        const sponsoredResult = await db.collection('sponsored').add(data);
        const totalAmount =
          +(isNaN(job.sponsoredAmount) ? 0 : job.sponsoredAmount) + +amount;
        const updateResult = await db
          .collection('jobs')
          .doc(taskId)
          .update({
            sponsoredAmount: totalAmount,
            'role.3': [...3, this.userId]
          });
        if (Reflect.has(this, 'job')) {
          this.job.sponsoredAmount = totalAmount;
        } else {
          const jobs = this.jobs.map(job => {
            if (job.taskId === taskId) {
              job.sponsoredAmount = totalAmount;
            }
            return job;
          });
          this.jobs = jobs;
        }
      } catch (err) {
        console.error('error when trying to save the data', err);
        alert('There was a problem when trying to insert data!');
      } finally {
        this.showSponsoredModal = false;
      }
    }
  }
};
