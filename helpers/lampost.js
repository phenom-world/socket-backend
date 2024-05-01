const dayjs = require('dayjs');
const { LampPostModel } = require('../models/LampPost');

const saveLampPost = async (data) => {
  const newLampPost = new LampPostModel({
    post_id: data.post_id,
    led_unit: data.led_unit,
    average_intensity: data.average_intensity,
    forcing_intensity: data.forcing_intensity,
    theoretical_energy_consumption: data.theoretical_energy_consumption,
    average_energy_consumption: data.average_energy_consumption,
    uptime: data.uptime,
  });
  newLampPost
    .save()
    .then((savedLampPost) => {
      console.log('LampPost saved:', savedLampPost);
    })
    .catch((error) => {
      console.error('Error saving LampPost:', error);
    });

  return newLampPost;
};
const lamPostSavedinPastHour = async (post_id) => {
  const lampPost = await LampPostModel.findOne({
    post_id: post_id,
    createdAt: {
      $gte: dayjs().subtract(1, 'hour').toDate(),
      $lt: new Date(),
    },
  });
  return lampPost;
};
module.exports = { saveLampPost, lamPostSavedinPastHour };
