const UvModel = require('../models/UV');

class UV {
    // [POST] /
    async send(req, res) {
        try {
            const {uid, totalTime, amp} = req.body;
            const power = await UvModel.create({uid, totalTime, amp});
            res.status(201).json({message: 'success', power: power});
        } catch (error) {
            res
                .status(400)
                .json({message: 'Send data fail', error: error.messages});
        }
    }

    async deleteAll(req, res) {
        try {
            await UvModel.deleteMany();
            res.status(201).json({message: 'success'});
        } catch (error) {
            res
                .status(400)
                .json({message: 'Send data fail', error: error.messages});
        }
    }

    async getAll(req, res) {
        try {
            const resp = await UvModel.find(
                {
                    amp: {$ne: null},
                },
                {},
                {sort: {createdAt: -1}}
            ).lean();
            res.status(200).json({resp: 'a'});
        } catch (error) {
            res.status(400).json({message: 'Get data fail', error: error.message});
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
