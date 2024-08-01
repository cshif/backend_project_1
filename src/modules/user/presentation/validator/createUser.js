import inspect from '../../../../devtools/inspect.js';
import { checkSchema } from 'express-validator';
import roles from '../../../../constants/roles.js';
import { AppError } from '../../../../common/classes/index.js';

const createUserValidatorByExpressValidator = async (req, res, next) => {
  const result = await checkSchema(
    {
      email: {
        isEmail: { errorMessage: 'Please provide valid email' },
      },
      password: {
        isLength: {
          options: { min: 8 },
          errorMessage: 'Please provide valid password',
        },
        custom: {
          options: async (value) => {
            if (!value.startsWith('A')) throw new Error('should start with A');
            return true;
          },
        },
      },
      role: {
        isIn: {
          options: [Object.values(roles)],
          errorMessage: `should be one of ${Object.values(roles).join(', ')}`,
        },
        optional: true,
      },
      avatarURL: {
        isURL: true,
        optional: true,
      },
    },
    ['body']
  ).run(req);

  const errors = result.reduce((all, field) => [...all, ...field.errors], []);

  if (errors.length) {
    inspect(JSON.parse(JSON.stringify(errors, null, 2)));
    return next(new AppError('the error messages', 401));
  }
  return next();
};

export default { createUserValidatorByExpressValidator };
