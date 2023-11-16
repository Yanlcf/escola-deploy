const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./db');
const Student = require('./Student');

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Rotas para manipulação dos estudantes

// Cria um estudante
app.post('/students', async (req, res) => {
    const { nome, matricula, telefone, curso, professor_id, responsavel_id } = req.body;

    if (!nome || !matricula || !telefone || !curso) {
        res.status(422).json({ message: "Preencha todos os campos obrigatórios!" });
        return;
    }

    const studentData = {
        nome,
        matricula,
        telefone,
        curso,
        professor_id,
        responsavel_id
    };

    try {
        await Student.createStudent(studentData);
        res.status(201).json({ message: "Estudante criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao criar o estudante!", err });
    }
});

// Obtém todos os estudantes
app.get('/students', async (req, res) => {
    try {
        const students = await Student.getAllStudents();
        res.status(200).json({ message: "Estudantes: ", students });
    } catch (err) {
        res.status(500).json({ message: "Erro ao listar estudantes!" });
    }
});

// Obtém um estudante por ID
app.get('/students/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const student = await Student.getStudentById(id);
        res.status(200).json({ message: `Estudante sob id ${id}`, student });
    } catch (err) {
        res.status(500).json({ message: "Erro ao pegar o estudante!" });
    }
});

// Atualiza um estudante por ID
app.put('/students/:id', async (req, res) => {
    const id = req.params.id;
    const { nome, matricula, telefone, curso } = req.body;

    if (!nome || !matricula || !telefone || !curso) {
        res.status(422).json({ message: "Preencha todos os campos obrigatórios!" });
        return;
    }

    const updateStudent = {
        nome,
        matricula,
        telefone,
        curso
    };

    try {
        await Student.updateStudentById(id, updateStudent);
        res.status(200).json({ message: "Estudante atualizado!" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao atualizar o estudante!" });
    }
});

// Deleta um estudante por ID
app.delete('/students/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Student.deleteStudentById(id);
        res.status(200).json({ message: "Estudante deletado" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao deletar estudante" });
    }
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});