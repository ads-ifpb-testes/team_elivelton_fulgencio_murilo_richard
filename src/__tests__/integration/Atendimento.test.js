//Teste de integração
const Pet = require('../../models/Pet');
const Responsavel = require('../../models/Responsaveis');
const Atendimento = require('../../models/Atendimentos');
const AtendimentoTipo = require('../../models/AtendimentoTipo');

const { conn } = require('../../db');
const { up } = require('../../migrations/index');

describe('Integração com o banco de dados', () => {

  test('Deve ser possível criar um atendimento', async () => {
    const pet = { nome: 'Fuleco', tutor: 'Eli', telefone: '8394584656', endereco: 'Sitio Saco' };
    const responsavel = {
      nome: 'Dr. Hans Chucrute',
      funcao: 'Veterinário',
      telefone: '309293848',
      senha: '12345',
      email: 'doctorRey@gmail.com',
    };

    const petCriado = await Pet.create(pet);
    const responsavelCriado = await Responsavel.create(responsavel);
    await AtendimentoTipo.create('Banho');

    const atendimento = {
      tipoAtendimento: 'Banho',
      responsavel: responsavelCriado,
      descricao: 'Dar banho no pet',
      pet: petCriado,
      date: `${new Date()}`,
    };
    const atendimentoAntes = await Atendimento.readAll();
    const qntAtendimentoAntes = atendimentoAntes.length;

    await Atendimento.create(atendimento);

    const atendimentoDepois = await Atendimento.readAll();
    const qntAtendimentoDepois = atendimentoDepois.length;

    expect(qntAtendimentoDepois).toBe(qntAtendimentoAntes + 1);
  });
});
