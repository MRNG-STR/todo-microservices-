const Task = require("../model/Task");
const cron = require('node-cron');


cron.schedule('* * * * *',async () => {
  const user = await Task.updateMany({ expiry: { $lte: new Date() }},{$set : {status: 'expired'}},{multi:true});
});