import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subYears,
  setMilliseconds,
  setSeconds,
  setMinutes,
  setHours,
} from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';

class DashboardController {
  async index(req, res) {
    try {
      const { userId } = req;
      const user = await User.findOne({
        where: { id: userId },
        attributes: ['roules'],
      });
      const whereStatement = {
        canceled_at: null,
        date: {
          [Op.between]: [startOfMonth(new Date()), endOfMonth(new Date())],
        },
      };

      let appointments = null;
      let schedule = 0;

      if (user.roules !== 'ADMIN') {
        whereStatement.provider_id = userId;

        schedule = await Appointment.count({
          where: {
            provider_id: userId,
            canceled_at: null,
            date: {
              [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
            },
          },
        });
      }

      const { count, rows } = await Appointment.findAndCountAll({
        attributes: ['value', 'provider_value'],
        where: whereStatement,
      });

      const total = rows.reduce((totalSum, appointment) => {
        return Number(totalSum) + Number(appointment.value);
      }, 0);
      const expense = rows.reduce((totalSum, appointment) => {
        return Number(totalSum) + Number(appointment.provider_value);
      }, 0);

      appointments = {
        quantity: count,
        schedule: {
          text: schedule,
        },
        total: {
          text: total,
        },
        expense: {
          text: expense,
        },
        profit: {
          text: total - expense,
        },
      };

      const model = {
        appointments,
      };

      return res.json(model);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' });
    }
  }

  async getAppointmentsGraph(req, res) {
    const { userId } = req;
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['roules'],
    });
    const whereStatement = {
      canceled_at: null,
      createdAt: {
        [Op.between]: [subYears(new Date(), 1), endOfMonth(new Date())],
      },
    };

    if (user.roules !== 'ADMIN') {
      whereStatement.provider_id = userId;
    }

    const rows = await Appointment.findAll({
      attributes: ['value', 'provider_value', 'date'],
      order: [['date', 'ASC']],
      where: whereStatement,
    });

    const appoitments = rows.map(appointment => {
      const date = setMilliseconds(
        setSeconds(setMinutes(setHours(appointment.date, 0), 0), 0),
        0
      );
      return {
        value: appointment.value,
        date,
      };
    });

    const result = [];
    appoitments.reduce((acc, value) => {
      if (!acc[value.date]) {
        acc[value.date] = { date: value.date, value: 0 };
        result.push(acc[value.date]);
      }
      acc[value.date].value += Number(value.value);
      return acc;
    }, {});

    return res.json(result);
  }
}
export default new DashboardController();
