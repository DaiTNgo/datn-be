const groupBy = (data, prop) => {
  return data.reduce(function(groups, item) {
    const val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};
const getMinMax = (resp, type) => {
  let hum = {
    min: {
      value: 999999,

    }, max: {
      value: -999999,

    },
  };

  let temp = {
    min: {
      value: 999999,

    }, max: {
      value: -999999,

    },
  };
  let _type = '', _time = '';
  if (type == 'date') {
    _type = 'hour';
    _time = 'date';
  }

  if (type == 'month') {
    _type = 'date';
    _time = 'month';
  }
  for (const r of resp) {
    if (!temp.min.value || temp.min.value > r.temperature) {
      temp.min.value = +r.temperature;
      temp.min[_type] = +r[_type];
      temp.min[_time] = +r[_time];
    }
    if (!temp.max.value || temp.max.value < r.temperature) {
      temp.max.value = +r.temperature;
      temp.max[_type] = +r[_type];
      temp.max[_time] = +r[_time];
    }

    if (!hum.min.value || hum.min.value > r.humidity) {
      hum.min.value = +r.humidity;
      hum.min[_type] = +r[_type];
      hum.min[_time] = +r[_time];

    }
    if (!hum.max.value || hum.max.value < r.humidity) {
      hum.max.value = +r.humidity;
      hum.max[_type] = +r[_type];
      hum.max[_time] = +r[_time];
    }
  }

  return {
    hum, temp,
  };
};
module.exports = {groupBy, getMinMax};