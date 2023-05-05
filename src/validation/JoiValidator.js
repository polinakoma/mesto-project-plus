import { Joi, celebrate } from 'celebrate';
import testUrl from './customVAlidation';

// валидация юзера
export const signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
});

export const signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).rule({ message: 'Именя должна быть от 2 до 30 символов' }),
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
    about: Joi.string().min(2).max(200).rule({ message: 'Введите от 2 до 30 символов' }),
    avatar: Joi.string().custom(testUrl),
  }),
});

export const getUserByIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

export const getCurrentUserValidator = celebrate({
  body: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

export const editProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const editAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(testUrl),
  }),
});

// валидация карточкек
export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(testUrl),
  }),
});

export const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
