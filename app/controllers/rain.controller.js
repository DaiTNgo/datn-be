const nodemailer = require('nodemailer');
const RainModel = require('../models/Rain');
const STATUS = require('../utils/rain.constant');
const {google} = require('googleapis');
const groupBy = require('../utils/groupBy');

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token in Account Info and set the environment variables.
// See http://twil.io/secure
const accountSid = 'ACf8ecfd9487715d47b7fc01703af88581';
const authToken = 'e212bb9ed2dc353eaf959e6fc99a13f4';
const client = require('twilio')(accountSid, authToken);

function sendMsg() {
  client.messages.create(
      {body: 'Hi there', from: '+12055480343', to: '+84935625571'}).
      then(message => console.log(message.sid));

}

const init = 0;
const cache = {
  numOfBefore: init,
  timeStart: init,
  numOfMinuteWarning: init,
};
const MESSAGE = {
  Start: {message: '<h1>Thời tiết đang có mưa. ⛈️</h1>', status: 'info'},
  End: {message: '<h1>Mưa đã tạm ngưng. 🌥️</h1>', status: 'info'},
  Warning_1: {
    message: 'Lượng mưa 5 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
  Warning_2: {
    message: 'Lượng mưa 10 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
  Warning_3: {
    message: 'Lượng mưa 15 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
  Warning_4: {
    message: 'Lượng mưa 20 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
  Warning_5: {
    message: 'Lượng mưa 25 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
  Warning_6: {
    message: 'Lượng mưa 30 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
  Warning_7: {
    message: 'Lượng mưa 35 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
  Warning_8: {
    message: 'Lượng mưa 45 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
  Warning_9: {
    message: 'Lượng mưa 50 phút qua đang tăng cao, vui lòng chuẩn bị ứng phó.',
    status: 'warning',
  },
};

const CLIENT_ID =
    '714276805248-bfdoc9llt0t33k7geqvk4vg6jr0jjffc.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
    '1//04CT28FLUfbs6CgYIARAAGAQSNwF-L9IrZzXi9aAsyjN9nDDzyqivmBXBC4aqkRnQYN9zFjqP_TJLf_udrPLyQDmG7V8bU_UpX2U';

const oAhth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);

oAhth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

async function sendMail({message, status}) {
  try {
    const accessToken = await oAhth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'daingo7211@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: '"Station Weather 🪐" <daingo7211@gmail.com>', // sender address
      to: 'dnt7200@gmail.com',
      subject: `Station Weather ${status === 'warning' ? '⚠' : ''} ${
          status === 'info' ? 'ℹ️' : ''
      }️️`,
      html: `
                <div>
                    ${message}
                </div>
            `,
    };
    const info = await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}

class Rain {
  async getValue(req, res) {
    try {
      const {time, type} = req.query;
      console.log({time, type});

      if (!time) {
        const resp = await RainModel.find(
            {
              count: {$ne: null},
            },
            {},
            {sort: {createdAt: -1}},
        ).lean();

        return res.status(200).json({resp});

      }

      const year = new Date(+time).getFullYear();
      const month = new Date(+time).getMonth() + 1;
      const date = new Date(+time).getDate();
      console.log({year, month, date});
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

      let resp = await RainModel.aggregate([
        {
          $project: {
            rain: 1,
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
            minute: {
              $minute: '$createdAt',
            },
          },
        },
        match,
      ]).sort({createdAt: -1});

      if (type === 'month') {
        const temp = [];
        resp = groupBy(resp, 'date');
        for (const [key, value] of Object.entries(resp)) {
          const t = value.reduce((total, i) => {
            return +total + +i.rain;
          }, 0);
          temp.push({
            date: key,
            value: t,
          });
        }
        resp = temp;
      }

      res.status(200).json({resp});
    } catch (error) {
      res.status(400).json({message: 'Get data fail', error: error.message});
    }
  }

  // [POST] /
  async send(req, res) {
    try {
      const {count, status, timeEnd, createdAt} = req.body;
      if (status === STATUS.Start) {
        cache.timeStart = createdAt;
        sendMail(MESSAGE.Start);
      }

      if (status === STATUS.End) {
        sendMail(MESSAGE.End);

        const _timeEnd = new Date().getTime();

        const rain = await RainModel.create({
          count,
          timeStart: (cache.timeStart),
          timeEnd: timeEnd || _timeEnd,
          totalTime: (timeEnd || _timeEnd) - cache.timeStart,
        });
        console.log({rain, timeEnd});
        cache.timeStart = init;
        cache.numOfBefore = init;
        cache.numOfMinuteWarning = init;

        return res.status(201).json({message: 'success', rain, cache});
      }
      if (status === STATUS.InProgress) {
        sendMail(MESSAGE.Warning_1);
      }
      cache.numOfBefore = count;
      res.status(201).json({message: 'success'});

    } catch (error) {
      res.status(400).json({message: 'Send data fail', error: error.messages});

    }
  }

  async deleteAll(req, res) {
    try {
      // await RainModel.deleteMany({
      //   createdAt: {
      //     $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      //     $gt: new Date(new Date().setHours(0, 0, 0, 0)),
      //   },
      // });

      await RainModel.deleteMany();
      res.status(201).json({message: 'success'});
    } catch (error) {
      res.status(400).json({message: 'Send data fail', error: error.messages});
    }
  }

  // // ------------------------------------
  // // [GET] /api/time {dev}
  // async receive(req, res) {
  //   //Find
  //   const data = await RainModel.find(
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
  //   await RainModel.deleteMany({
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
  //   await RainModel.findOneAndDelete({
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
  //     const data = await RainModel.find(
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
  //     const data = await RainModel.find(
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
  //     const data = await RainModel.find(
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
  //     const data = await RainModel.findOne(
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

module.exports = new Rain();
