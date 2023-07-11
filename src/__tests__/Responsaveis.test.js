const Responsavel = require('../models/Responsaveis');

describe('Serviço de responsaveis', () => {
    test('Deve ser criar um responsável', async () => {
        const responsavel = { nome: 'Dr. Hans Chucrute', funcao: 'Veterinário', telefone: '309293848', senha: '12345', email: 'doctorRey@gmail.com' };

        const responsaveisAntes = await Responsavel.readAll();
        const qntResponsaveisAntes = responsaveisAntes.length;

        await Responsavel.create(responsavel);

        const responsaveisDepois = await Responsavel.readAll();
        const qntResponsaveisDepois = responsaveisDepois.length;

        expect(qntResponsaveisDepois).toBe(qntResponsaveisAntes + 1);
    });

    test('Deve ser possível encontrar responsável pelo email', async () => {
        //procurando email cadastrado no teste de criação de responsável
        const email = 'doctorRey@gmail.com';
        const responsavel = await Responsavel.readByEmail(email)
        expect(responsavel).toBeDefined();
    })

    test('Deve ser possível deletar um responsável', async () => {
        //ultilizando de exemplo o último responsável criado pelo teste
        const responsaveis = await Responsavel.readAll();
        const indice = responsaveis.length - 1;
        const id = responsaveis[indice].id;

        const destroy = await Responsavel.destroy(id);

        expect(destroy).toBe(0);
    })



})