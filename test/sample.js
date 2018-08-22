//import * as moment from 'moment';
const moment = require('moment');

let currentDate = moment();
currentDate.month(1).date(28);
console.log('First Date: ' + currentDate.format('DD MMMM YYYY'));

console.log('Date: ' + currentDate.format('DD MMMM YYYY'));
console.log('Date: ' + currentDate.add({
    days: 1
}).format('DD MMMM YYYY'));