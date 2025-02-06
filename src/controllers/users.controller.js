import { hash } from "bcryptjs";

import User from "../models/users/User.js";
import UsersRepository from "../models/users/UsersRepository.js";

const UsersRepository = new UsersRepository();

export const getUsers = (req, res) => {
    const users = UsersRepository.getUsers();

    if(!users) {
        return res.status(404).send({ message: "Não há usuários cadastrados"});
        }
            return res.status(200).send({ totalUsers: users.length, users});
    }

    export const getUserById = (req, res) => {
        const { id } = req.params
    
        const user = UsersRepository.getUserById(id);

        if(!user) {
            return res.status(404).send({ message: "Usuário não encontrado"});
        }

        return res.status(200).send({ message: "Usuário encontrado", user}); 
    };

    export const createUser = async (req, res) => {
        const { name, email, password } = req.body;

        const userAlreadyExists = UsersRepository.getUserByEmail(email);

        if (userAlreadyExists) {
            return res.status(409).send({ message: "Usuário já cadastrado"});
        }

        const passwordHash = await hash(password, 8);

        const user = new User(name, email, passwordHash);

        UsersRepository.createUser(user);
        
        return res.status(201).send({ message: "Usuário criado com sucesso", user });
    };

    export const updateUser = async (req, res) =>  {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const userById = UsersRepository.getUserById(id);
        const userByEmail = UsersRepository.getUserByEmail(email);

        if (!userById) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        if (userByEmail && userByEmail.id !== id) {
            return res.status(409).send({ message: "Email já cadastrado" });
        }

        const passwordHash = await hash(password, 8);

        const user = UsersRepository.updateUser(id, name, email, passwordHash);

        return res
        .status(200)
        .send({ message: "Usuário atualizado com sucesso", user});
    };

    export const deleteUser = (req, res) => {
        const { id } = req.params

        const user = UsersRepository.getUserById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        UsersRepository.deleteUser(id);

        return res.status(204).send({ message: 'Usuário deletado com sucesso' });
    }