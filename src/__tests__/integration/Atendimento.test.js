//Teste de integração
const Pet = require('../../models/Pet');
const Responsavel = require('../../models/Responsaveis');
const Atendimento = require('../../models/Atendimentos');
const AtendimentoTipo = require('../../models/AtendimentoTipo');

describe('Integração com o banco de dados', () => {
  test('Deve ser possível criar um atendimento', async () => {
    const pet = { nome: 'Fuleco', tutor: 'Eli', telefone: '8394584656', endereco: 'Sitio Saco' };
    const responsavel = {
      nome: 'Dr. Hans Chucruteee',
      funcao: 'Veterinário',
      telefone: '309293848',
      senha: '12345',
      email: 'doctorReyaa@gmail.com',
    };

    const petCriado = await Pet.create(pet, true);
    const responsavelCriado = await Responsavel.create(responsavel, true);
    const tipoCriado = await AtendimentoTipo.create({ tipo: 'Atendimento teste'}, true);
    
    const atendimento = {
      tipoAtendimento: 'Atendimento teste',
      responsavel: responsavelCriado,
      descricao: 'Dar Atendimento teste no pet',
      pet: petCriado,
      date: `${new Date()}`,
    };
    const atendimentoAntes = await Atendimento.readAll(true);
    const qntAtendimentoAntes = atendimentoAntes.length;
    
    await Atendimento.create(atendimento, true);
    
    const atendimentoDepois = await Atendimento.readAll(true);
    const qntAtendimentoDepois = atendimentoDepois.length;
    
    expect(qntAtendimentoDepois).toBe(qntAtendimentoAntes + 1);
    await Responsavel.destroy(responsavelCriado, true)
    await Pet.destroy(petCriado, true)
    await AtendimentoTipo.destroy(tipoCriado, true)
    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa");
  });
});
