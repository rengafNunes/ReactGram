const {body} = require("express-validator")

const userCreateValidation = () => {
    return[ body("name").isString().withMessage("o nome é obrigatório.").isLength({min: 3}).withMessage("O nome precisa ter no mínimo 3 caracteres."),
    body("email")
        .isString()
        .withMessage("O e-mail é obrigatório.")
        .isEmail("Insira um e-mail válido."),
    body("password")
        .isString()
        .withMessage("A senha é obrigatória.")
        .isLength({ min: 5 })
        .withMessage("A senha precisa ter no mínimo 5 caracteres."),
    body("confirmpassword")
        .isString()
        .withMessage("A confimação de senha é obrigatóra.")
        .custom((value, {req}) => {
            if (value != req.body.password) {
                throw new Error("As senhas não são iguais.");
            }
            return true;
        }),
    ];
}; 

const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório")
            .isEmail()
            .withMessage("Insira um e-mail válido."),
        body("password")
            .isString().withMessage("A senha é obrigatória"),
    ];
};

module.exports = { 
    userCreateValidation,
    loginValidation,
};