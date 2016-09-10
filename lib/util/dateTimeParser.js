'use strict';

const Promise = require('bluebird');
const moment = require('moment');

//09/03/2016 12:30 - 09/03/2016 12:30
const dateTimeRangeExp = /(^[0-9]{1,2})([\/])([0-9]{1,2})([\/])([0-9]{4,4})([\s]{1,1})([0-9]{1,2})([:])([0-9]{1,2})([\s]+)([\-])([\s]+)([0-9]{1,2})([\/])([0-9]{1,2})([\/])([0-9]{4,4})([\s]{1,1})([0-9]{1,2})([:])([0-9]{1,2})$/;
///
const plusMinusTimeExp = '(^[\+\-][0-9]*)([hm])$'; //+91m or -91h validaion.
const timeRangeExp = /(^[\+\-][0-9]*)([hm])([\s]*)([\-])([\s]*)([\+\-][0-9]+)([hm])$/; //-45m - +45h
const singleDateExp = /(^[0-9]{1,2})([\/])([0-9]{1,2})([\/])([0-9]{4,4})$/;
const singleDateTimeExp = /(^[0-9]{1,2})([\/])([0-9]{1,2})([\/])([0-9]{4,4})([\s]+)([0-9]{1,2})([:])([0-9]{1,2})$/; //09/03/2016 15:01
const dateRangeExp = /(^[0-9]{1,2})([\/])([0-9]{1,2})([\/])([0-9]{4,4})([\s]+)([\-])([\s]+)([0-9]{1,2})([\/])([0-9]{1,2})([\/])([0-9]{4,4})$/; //09/03/2016 - 09/03/2016

var util = {};

function checkPlusMinusTimeExp(queryString, query){
  let match = queryString.match(plusMinusTimeExp);
  if(match){
    let time = parseInt(match[1]);
    let horm = match[2];
    let startDate;
    let endDate;
    if(time >= 0){
      startDate = moment().utc().toDate();
      if(horm === 'h'){
        endDate = moment().utc().add(time,'hours').toDate();
      } else if(horm === 'm'){
        endDate = moment().utc().add(time,'minutes').toDate();
      }

    } else {
      time = (-1) * time;
      if(horm === 'h'){
        startDate = moment().utc().subtract(time,'hours').toDate();
      }else if(horm === 'm'){
        startDate = moment().utc().subtract(time,'minutes').toDate();
      }
      endDate = moment().utc().toDate();
    }
    query.log_timestamp = {
      $gte : startDate,
      $lt : endDate
    }
    return query;
  }
  return null;
}

function checkTimeRangeExp(queryString, query) {
  let match;
  if ((match = timeRangeExp.exec(queryString)) !== null) {
    if (match.index === timeRangeExp.lastIndex) {
      timeRangeExp.lastIndex++;
    }
    // View your result using match
  }
  if(match){
    let time1 = parseInt(match[1]);
    let horm1 = match[2];
    let time2 = parseInt(match[6]);
    let horm2 = match[7];

    let startDate;
    let endDate;
    //startDate.
    if(time1 >= 0){
      if(horm1 === 'h'){
        startDate = moment().utc().add(time1,'hours').toDate();
      } else if(horm1 === 'm'){
        startDate = moment().utc().add(time1,'minutes').toDate();
      }
    } else {
      time1 = (-1) * time1;
      if(horm1 === 'h'){
        startDate = moment().utc().subtract(time1,'hours').toDate();
      }else if(horm1 === 'm'){
        startDate = moment().utc().subtract(time1,'minutes').toDate();
      }
    }
    //endDate.
    if(time2 >= 0){
      if(horm2 === 'h'){
        endDate = moment().utc().add(time2,'hours').toDate();
      } else if(horm2 === 'm'){
        endDate = moment().utc().add(time2,'minutes').toDate();
      }
    } else {
      time2 = (-1) * time2;
      if(horm2 === 'h'){
        endDate = moment().utc().subtract(time2,'hours').toDate();
      }else if(horm2 === 'm'){
        endDate = moment().utc().subtract(time2,'minutes').toDate();
      }
    }
    query.log_timestamp = {
      $gte : startDate,
      $lt : endDate
    }
    return query;
  }
  return null;
}

function checkSingleDateExp(queryString, query){
  let match;
  if ((match = singleDateExp.exec(queryString)) !== null) {
    if (match.index === singleDateExp.lastIndex) {
      singleDateExp.lastIndex++;
    }
    // View your result using match
  }
  if(match){
    let d = moment(queryString,'MM/DD/YYYY');
    if(d == null || !d.isValid()){
      return -1;
    }
    let startDate = d.startOf('day').toDate();
    let endDate = d.endOf('day').toDate();
    query.log_timestamp = {
      $gte : startDate,
      $lt : endDate
    }
    return query;
  }
  return null;
}

function checkSingleDateTimeExp(queryString, query){
  let match;
  if ((match = singleDateTimeExp.exec(queryString)) !== null) {
    if (match.index === singleDateTimeExp.lastIndex) {
      singleDateTimeExp.lastIndex++;
    }
    // View your result using match
  }
  if(match){
    let d = moment(queryString,'MM/DD/YYYY HH:mm');
    if(d == null || !d.isValid()){
      return -1;
    }
    let startDate = d.toDate();
    let endDate = d.endOf('day').toDate();
    query.log_timestamp = {
      $gte : startDate,
      $lt : endDate
    }
    return query;
  }
  return null;
}

function checkDateRangeExp(queryString, query){
  let match;
  if ((match = dateRangeExp.exec(queryString)) !== null) {
    if (match.index === dateRangeExp.lastIndex) {
      dateRangeExp.lastIndex++;
    }
    // View your result using match
  }
  if(match){
    const dates = queryString.split('-');
    let d1 = dates[0].trim();
    let d2 = dates[1].trim();
    d1 = moment(d1,'MM/DD/YYYY HH:mm');
    d2 = moment(d2,'MM/DD/YYYY HH:mm');
    if(d1 == null || !d1.isValid() || d2 == null || !d2.isValid()){
      return -1;
    }
    let startDate = d1.startOf('day').toDate();
    let endDate = d2.endOf('day').toDate();
    query.log_timestamp = {
      $gte : startDate,
      $lt : endDate
    }
    return query;
  }
  return null;
}

function checkDateTimeRangeExp(queryString, query){
  let match;
  if ((match = dateTimeRangeExp.exec(queryString)) !== null) {
    if (match.index === dateTimeRangeExp.lastIndex) {
      dateTimeRangeExp.lastIndex++;
    }
    // View your result using match
  }
  if(match){
    const dates = queryString.split('-');
    let d1 = dates[0].trim();
    let d2 = dates[1].trim();
    d1 = moment(d1,'MM/DD/YYYY HH:mm');
    d2 = moment(d2,'MM/DD/YYYY HH:mm');
    if(d1 == null || !d1.isValid() || d2 == null || !d2.isValid()){
      return -1;
    }
    let startDate = d1.toDate();
    let endDate = d2.toDate();
    query.log_timestamp = {
      $gte : startDate,
      $lt : endDate
    }
    return query;
  }
  return null;
}

util.dateQueryParser = function(queryString, query){
  return new Promise(function(resolve, reject){
    if(queryString){
      //first check for plus or minus in time
      let x = checkPlusMinusTimeExp(queryString, query);
      if(x){
        return resolve(x);
      }
      x = checkTimeRangeExp(queryString, query);
      if(x){
        return resolve(x);
      }
      x = checkSingleDateExp(queryString, query);
      if(x){
        if(x === -1) return reject(new Error('Invalid date time format.'));
        return resolve(x);
      }
      x = checkSingleDateTimeExp(queryString, query);
      if(x){
        if(x === -1) return reject(new Error('Invalid date time format.'));
        return resolve(x);
      }
      x = checkDateRangeExp(queryString, query);
      if(x){
        if(x === -1) return reject(new Error('Invalid date time format.'));
        return resolve(x);
      }
      x = checkDateTimeRangeExp(queryString, query);
      if(x){
        if(x === -1) return reject(new Error('Invalid date time format.'));
        return resolve(x);
      }
      return reject(new Error('Invalid date time format.'));
    } else {
      let startDate = moment().utc().toDate();
      let endDate = moment().subtract(30,'days').utc().toDate();
      query.log_timestamp = {
        $gte : endDate,
        $lt : startDate
      }
      return resolve(query);
    }
  });
}

module.exports = util;
