import inspect from '../../../../devtools/inspect.js';
import { checkSchema } from 'express-validator';
import joi from 'joi';
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

const createUserValidatorByJoi = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      'string.email': 'Please provide valid email',
    }),
    password: joi
      .string()
      .length(8)
      .custom((value, helpers) => {
        const capital = 'A';
        return value.startsWith(capital)
          ? value
          : helpers.error('custom.startsWith', { capital });
      })
      .required()
      .messages({
        'string.length': 'Please provide valid password',
        'custom.startsWith': 'should start with {#capital}',
      }),
    role: joi
      .string()
      .valid(...Object.values(roles))
      .messages({
        'any.only': `should be one of ${Object.values(roles).join(', ')}`,
      }),
    avatarURL: joi.string().uri(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    inspect(error);
    return next(new AppError('the error messages', 401));
  }
};

export default {
  createUserValidatorByExpressValidator,
  createUserValidatorByJoi,
};
