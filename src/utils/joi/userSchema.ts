import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    "string.base": "O nome não pode conter números",
    "string.empty": "O nome não pode ficar vazio",
    "string.min": "O nome deve ter pelo menos 2 caracteres",
    "string.max": "O nome deve ter no máximo 20 caracteres",
    "any.required": "O nome é obrigatório",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // garante que seja um email válido
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "O email deve ser um texto",
      "string.empty": "O email não pode ficar vazio",
      "string.email": "O email deve ser válido",
      "string.min": "O email deve ter no mínimo 2 caracteres",
      "string.max": "O email deve ter no máximo 50 caracteres",
      "any.required": "O email é obrigatório",
    }),
  password: Joi.string()
    .min(2) // mínimo 2 caracteres
    .max(20) // máximo 20 caracteres
    .required()
    .messages({
      "string.base": "A senha deve ser válida",
      "string.empty": "A senha não pode ser vazia",
      "string.min": "A senha deve ter no mínimo 2 caracteres",
      "string.max": "A senha deve ter no máximo 20 caracteres",
      "any.required": "A senha é obrigatória",
    }),
});
