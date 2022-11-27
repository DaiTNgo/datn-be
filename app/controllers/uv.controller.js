const UvModel = require('../models/UV');
const {groupBy} = require('../utils/groupBy');

class UV {
  // [POST] /
  async send(req, res) {
    try {
      const {uv, createdAt} = req.body;
      const resp = await UvModel.create({uv, createdAt});
      res.status(201).json({message: 'success', resp});
    } catch (error) {
      res.status(400).
          json({message: 'Send data fail', error: error.messages});
    }
  }

  async deleteAll(req, res) {
    try {
      await UvModel.deleteMany();
      res.status(201).json({message: 'success'});
    } catch (error) {
      res.status(400).
          json({message: 'Send data fail', error: error.messages});
    }
  }

  async getAll(req, res) {
    try {
      const resp = await UvModel.find(
          {
            amp: {$ne: null},
          },
          {},
          {sort: {createdAt: -1}},
      ).lean();
      res.status(200).json({resp: 'a'});
    } catch (error) {
      res.status(400).
          json({message: 'Get data fail', error: error.message});
    }
  }

  async getValue(req, res) {
    try {
      const {time, type} = req.query;
      if (!time) {
        const resp = await UvModel.find(
            {
              uv: {$ne: null},
            },
            {},
            {sort: {createdAt: -1}},
        ).lean();

        return res.status(200).json({resp});
      }

      const year = new Date(+time).getFullYear();
      const month = new Date(+time).getMonth() + 1;
      const date = new Date(+time).getDate();

      let match = {};

      if (type == 'month') {
        match = {
          $match: {
            month,
            year,
          },
        };
      }

      if (type == 'date') {
        match = {
          $match: {
            month,
            year,
            date,
          },
        };
      }

      let resp = await UvModel.aggregate([
        {
          $project: {
            uv: 1,
            year: {$year: '$createdAt'},
            month: {
              $month: '$createdAt',
            },
            date: {
              $dayOfMonth: '$createdAt',
            },
            hour: {
              $hour: '$createdAt',
            },
          },
        },
        match,
      ]).sort({createdAt: -1});

      const getMinMax = (resp, type) => {
        let uv = {
          min: {
            value: 999999,
          },
          max: {
            value: -999999,

          },
        };

        let _type = '',
            _time = '';
        if (type == 'date') {
          _type = 'hour';
          _time = 'date';
        }

        if (type == 'month') {
          _type = 'date';
          _time = 'month';
        }
        for (const r of resp) {
          if (!uv.min.value || uv.min.value > r.uv) {
            uv.min.value = +r.uv;
            uv.min[_type] = +r[_type];
            uv.min[_time] = +r[_time];
          }
          if (!uv.max.value || uv.max.value < r.uv) {
            uv.max.value = +r.uv;
            uv.max[_type] = +r[_type];
            uv.max[_time] = +r[_time];
          }

        }

        return {
          uv,
        };
      };
      let uv;
      if (type == 'date') {
        const r = getMinMax(resp, 'date');
        uv = r.uv;
      }

      if (type === 'month') {
        const tmp = [];
        resp = groupBy(resp, 'date');
        for (const [key, value] of Object.entries(resp)) {
          const t = value.reduce(
              (rs, i) => {
                return {
                  uv: +rs.uv + +i.uv,
                };
              },
              {uv: 0},
          );
          tmp.push({
            date: key,
            month,
            year,
            uv: t.uv / value.length,
          });
        }

        const r = getMinMax(tmp, 'month');
        uv = r.uv;
        resp = tmp;
      }

      res.status(200).json({resp, uv});
    } catch (error) {
      res.status(400).
          json({message: 'Get data fail', error: error.message});
    }
  }

  // // ------------------------------------
  // // [GET] /api/time {dev}
  // async receive(req, res) {
  //   //Find
  //   const data = await UvModel.find(
  //     {
  //       createdAt: {
  //         $gt: new Date('2021-11-07 0:'),
  //         $lt: new Date('2021-12-07 0:'),
  //       },
  //     },
  //     { volt: 1, amp: 1, _id: 0, createdAt: 1 }
  //   ).lean();
  //
  //   return res.json(data);
  // }
  // // [DELETE] data {dev} /api/delete
  // async delete(req, res) {
  //   const { startDay, endDay } = req.body;
  //   await UvModel.deleteMany({
  //     createdAt: {
  //       $gt: new Date(startDay),
  //       $lt: new Date(endDay),
  //     },
  //   });
  //   res.json('OK!');
  // }
  // // [DELETE] /api/delete/date {dev}
  // async deleteDate(req, res) {
  //   const { date } = req.body;
  //
  //   await UvModel.findOneAndDelete({
  //     createdAt: {
  //       $eq: date,
  //     },
  //   });
  //
  //   res.json('OK!');
  // }
  // // ------------------------------------
  //
  // // [POST] /api/date
  // async getDate(req, res) {
  //   try {
  //     const { nextDate, currentDate } = req.body;
  //     const data = await UvModel.find(
  //       {
  //         createdAt: {
  //           $gte: currentDate,
  //           $lt: nextDate,
  //         },
  //       },
  //       { _id: 0, createdAt: 1, volt: 1, amp: 1 }
  //     ).lean();
  //     res.json(data); //if no data then return []
  //   } catch (error) {
  //     res.status(400).json({ message: 'Get data fail', error: error.messages });
  //   }
  // }
  //
  // // [POST] /api/hour
  // async getHour(req, res) {
  //   try {
  //     const { currentHour, nextHour } = req.body;
  //
  //     const data = await UvModel.find(
  //       {
  //         createdAt: {
  //           $gte: currentHour,
  //           $lt: nextHour,
  //         },
  //       },
  //       { _id: 0, createdAt: 1, volt: 1, amp: 1 }
  //     ).lean();
  //     res.json(data);
  //   } catch (error) {
  //     res.status(400).json({ message: 'Get data fail', error: error.messages });
  //   }
  // }
  //
  // // [POST] /api/month
  // async getMonth(req, res) {
  //   try {
  //     const { currentMonth, nextMonth } = req.body;
  //     const data = await UvModel.find(
  //       {
  //         createdAt: {
  //           $gte: new Date(currentMonth).getTime(),
  //           $lt: new Date(nextMonth).getTime(),
  //         },
  //       },
  //       { _id: 0, createdAt: 1, volt: 1, amp: 1 }
  //     ).lean();
  //     res.json(data);
  //   } catch (error) {
  //     res.status(400).json({ message: 'Get data fail', error: error.messages });
  //   }
  // }
  //
  // // [POST] /api/current-time
  // async currentTime(req, res) {
  //   try {
  //     const data = await UvModel.findOne(
  //       {},
  //       { _id: 0, createdAt: 1, volt: 1, amp: 1 },
  //       { sort: { createdAt: -1 } }
  //     ).lean();
  //     res.json(data);
  //   } catch (error) {
  //     res.status(400).json({ message: 'Get data fail', error: error.messages });
  //   }
  // }
}

module.exports = new UV();
