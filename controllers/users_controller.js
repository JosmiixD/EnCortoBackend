const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const { update } = require('../models/user');

module.exports = {

    async getAll( req, res, next ) {

        try {
            const data = await User.getAll();
            return res.status(200).json(data);
        } catch (error) {
            console.log('Error: ' + error );
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }

    },

    async register( req, res, next ) {

        try {
            
            const user = req.body;
            
            const user_created = await User.create(user);

            await Role.create( user_created.id, 1); //DEFAULT ROLE

            const result = await User.getById( user_created.id );

            const token = jwt.sign({ id: result.id, email: result.email}, keys.secretOrKey, {
            });

            const data = {
                id: result.id,
                name: result.name,
                lastname: result.lastname,
                email: result.email,
                phone: result.phone,
                image: result.image,
                session_token: 'JWT ' + token,
                roles: result.roles
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data
            });

        } catch (error) {
            console.log('Error:' + error );
            return res.status(500).json({
                success: false,
                message: 'Ocurrio un error durante el registro',
                error: error
            });
        }

    },

    async update( req, res, next ) {

        try {

            const user = req.body;
            const user_updated = await User.update( user );
            const result = await User.getById( user_updated.id );
            console.log(result);
            const data = {
                id: result.id,
                name: result.name,
                lastname: result.lastname,
                email: result.email,
                phone: result.phone,
                image: result.image,
                session_token: result.session_token,
                roles: result.roles
            }

            return res.status(200).json({
                success: true,
                message: 'Datos actualizados correctamente',
                data: data
            });
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ocurrio un error durante la actualización',
                error: error
            });
        }

    },

    async login( req, res, next ) {
        try {
            
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findByEmail( email );

            if( !user ) {
                return res.status(401).json({
                    success: false,
                    message: 'Al parecer la información que proporcionaste no se encuentra registrada'
                });
            }

            if( User.isPasswordMatched( password, user.password ) ) {
                const token = jwt.sign({ id: user.id, email: user.email}, keys.secretOrKey, {
                    // expiresIn: ( 60 * 60 * 24)
                });
                const data = {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    phone: user.phone,
                    image: user.image,
                    session_token: `JWT ${token}`,
                    roles: user.roles
                }

                await User.updateToken( user.id, `JWT ${token}`);

                return res.status(200).json({
                    success: true,
                    data: data,
                    message: 'Nos alegra verte por aqui ' + user.name
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Las credenciales que proporciono no coinciden con nuestros registros, intente nuevamente',
                });
            }

        } catch (error) {
            console.log('Error: ' + error);
            return res.status( 500 ).json({
                success: false,
                message: 'Ocurrio un error durante el proceso de inicio de sesión',
                error: error
            });
        }
    }

}