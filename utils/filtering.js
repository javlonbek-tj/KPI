import { Op } from 'sequelize';
import Sequelize from 'sequelize';

export default function filtering(departmentId, fullname, from, to) {
  let filtering = {};

  if (departmentId && fullname && from && to) {
    filtering = {
      departmentId,
      [Op.and]: Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('firstname'),
          ' ',
          Sequelize.col('secondname'),
          ' ',
          Sequelize.col('lastname'),
        ),
        { [Op.like]: `%${fullname}%` },
      ),
      '$dates.date$': {
        [Op.gte]: from,
        [Op.lte]: to,
      },
    };
  } else if (departmentId && !fullname && !from && !to) {
    filtering = {
      departmentId,
    };
  } else if (departmentId && fullname && !from && !to) {
    filtering = {
      departmentId,
      [Op.and]: Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('firstname'),
          ' ',
          Sequelize.col('secondname'),
          ' ',
          Sequelize.col('lastname'),
        ),
        { [Op.like]: `%${fullname}%` },
      ),
    };
  } else if (departmentId && fullname && from && !to) {
    filtering = {
      departmentId,
      [Op.and]: Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('firstname'),
          ' ',
          Sequelize.col('secondname'),
          ' ',
          Sequelize.col('lastname'),
        ),
        { [Op.like]: `%${fullname}%` },
      ),
      '$dates.date$': {
        [Op.gte]: from,
      },
    };
  } else if (departmentId && !fullname && from && to) {
    filtering = {
      departmentId,
      '$dates.date$': {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  } else if (departmentId && !fullname && !from && to) {
    filtering = {
      departmentId,
      '$dates.date$': {
        [Op.lte]: to,
      },
    };
  } else if (departmentId && !fullname && from && !to) {
    filtering = {
      departmentId,
      '$dates.date$': {
        [Op.lte]: to,
      },
    };
  } else if (!departmentId && fullname && from && to) {
    filtering = {
      [Op.and]: Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('firstname'),
          ' ',
          Sequelize.col('secondname'),
          ' ',
          Sequelize.col('lastname'),
        ),
        { [Op.like]: `%${fullname}%` },
      ),
      '$dates.date$': {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  } else if (!departmentId && fullname && from && !to) {
    filtering = {
      [Op.and]: Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('firstname'),
          ' ',
          Sequelize.col('secondname'),
          ' ',
          Sequelize.col('lastname'),
        ),
        { [Op.like]: `%${fullname}%` },
      ),
      '$dates.date$': {
        [Op.gte]: from,
      },
    };
  } else if (!departmentId && fullname && !from && to) {
    filtering = {
      [Op.and]: Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('firstname'),
          ' ',
          Sequelize.col('secondname'),
          ' ',
          Sequelize.col('lastname'),
        ),
        { [Op.like]: `%${fullname}%` },
      ),
      '$dates.date$': {
        [Op.lte]: to,
      },
    };
  } else if (!departmentId && !fullname && from && to) {
    filtering = {
      '$dates.date$': {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  } else if (!departmentId && fullname && !from && !to) {
    filtering = {
      [Op.and]: Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('firstname'),
          ' ',
          Sequelize.col('secondname'),
          ' ',
          Sequelize.col('lastname'),
        ),
        { [Op.like]: `%${fullname}%` },
      ),
    };
  } else if (!departmentId && !fullname && from && !to) {
    filtering = {
      '$dates.date$': {
        [Op.gte]: from,
      },
    };
  } else if (!departmentId && !fullname && from && to) {
    filtering = {
      '$dates.date$': {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  } else if (!departmentId && !fullname && !from && to) {
    filtering = {
      '$dates.date$': {
        [Op.lte]: to,
      },
    };
  }

  return filtering;
}
