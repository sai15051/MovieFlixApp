
import Joi from 'joi';

export const validateSearchQuery = (req, res, next) => {
  const schema = Joi.object({
    search: Joi.string().min(2).required(),
    page: Joi.number().integer().min(1).default(1)
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ 
      success: false,
      message: error.details[0].message 
    });
  }
  next();
};

export const validateMovieId = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ 
      success: false,
      message: error.details[0].message 
    });
  }
  next();
};