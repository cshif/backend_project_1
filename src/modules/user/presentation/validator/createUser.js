import inspect from '../../../../devtools/inspect.js';
import { checkSchema, checkExact, validationResult } from 'express-validator';
import joi from 'joi';
import roles from '../../../../constants/roles.js';
import { AppError } from '../../../../common/classes/index.js';

const createUserValidatorByExpressValidator = async (req, res, next) => {
  await checkExact(
    checkSchema(
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
              if (!value.startsWith('A'))
                throw new Error('should start with A');
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
    ),
    {
      locations: ['body'],
      message: ([field]) => {
        return `Unknown field ${field.path} in ${field.location} with value ${field.value}`;
      },
    }
  ).run(req);

  const { errors } = validationResult(req);

  if (errors.filter((error) => error.type === 'unknown_fields').length) {
    inspect(errors);
    return next(AppError.unauthorized('do not send unknown fields'));
  } else if (errors.filter((error) => error.type !== 'unknown_fields').length) {
    inspect(errors);
    return next(AppError.unauthorized());
  }
  return next();
};

const createUserValidatorByJoi = async (req, res, next) => {
  const schema = joi
    .object({
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
    })
    .unknown(false);

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    inspect(error);
    return next(AppError.unauthorized());
  }
};

export default {
  createUserValidatorByExpressValidator,
  createUserValidatorByJoi,
};
