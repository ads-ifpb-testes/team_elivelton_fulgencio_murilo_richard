//Teste de integração
const Pet = require("../../models/Pet");
const Responsavel = require("../../models/Responsaveis");
const Atendimento = require("../../models/Atendimentos");
const AtendimentoTipo = require("../../models/AtendimentoTipo");

describe("Integração com o banco de dados", () => {
  test("Deve ser possível criar um atendimento", async () => {
    const pet = { nome: "Fuleco", tutor: "Eli", telefone: "8394584656", endereco: "Sitio Saco" };
    const responsavel = {
      nome: "Dr. Hans Chucruteee",
      funcao: "Veterinário",
      telefone: "309293848",
      senha: "12345",
      email: "doctorReyaa@gmail.com",
    };

    const petCriado = await Pet.create(pet, true);
    const responsavelCriado = await Responsavel.create(responsavel, true);
    const tipoCriado = await AtendimentoTipo.create({ tipo: "Atendimento teste" }, true);

    const atendimento = {
      tipoAtendimento: "Atendimento teste",
      responsavel: responsavelCriado,
      descricao: "Dar Atendimento teste no pet",
      pet: petCriado,
      date: `${new Date()}`,
    };
    const atendimentoAntes = await Atendimento.readAll(true);
    const qntAtendimentoAntes = atendimentoAntes.length;

    await Atendimento.create(atendimento, true);

    const atendimentoDepois = await Atendimento.readAll(true);
    const qntAtendimentoDepois = atendimentoDepois.length;

    expect(qntAtendimentoDepois).toBe(qntAtendimentoAntes + 1);
    await Responsavel.destroy(responsavelCriado, true);
    await Pet.destroy(petCriado, true);
    await AtendimentoTipo.destroy(tipoCriado, true);
  });

  test("Deve ser possível editar um atendimento", async () => {
    const pet = { nome: "Bidu", tutor: "João", telefone: "664567", endereco: "IFPB" };
    const responsavel1 = {
      nome: "Primeiro médico",
      funcao: "Veterinário",
      telefone: "1919191",
      senha: "12345",
      email: "primeiro@gmail.com",
    };

    const responsavel2 = {
      nome: "Segundo médico",
      funcao: "Veterinário",
      telefone: "1919191",
      senha: "12345",
      email: "segundo@gmail.com",
    };

    const petCriado = await Pet.create(pet, true);
    const responsavelCriado1 = await Responsavel.create(responsavel1, true);
    const responsavelCriado2 = await Responsavel.create(responsavel2, true);
    const tipoCriado = await AtendimentoTipo.create({ tipo: "Atendimento teste" }, true);

    const atendimento = {
      tipoAtendimento: "Atendimento teste",
      responsavel: responsavelCriado1,
      descricao: "Dar Atendimento teste no pet",
      pet: petCriado,
      date: `${new Date()}`,
    };

    const atendimentoCriado = await Atendimento.create(atendimento, true);
    const novoAtendimento = await Atendimento.readById(atendimentoCriado, true);

    expect(novoAtendimento).toBeDefined();

    const atendimentoEditado = {
      tipoAtendimento: "Atendimento teste",
      responsavel: responsavelCriado2,
      descricao: "Atendimento atualizado",
      pet: petCriado,
      date: `${new Date()}`,
    };
    const novoAtendimentoEditado = await Atendimento.update(atendimentoCriado, atendimentoEditado, true);
    const novoAtendimentoEditadoDoBanco = await Atendimento.readById(atendimentoCriado, true);

    expect(novoAtendimentoEditado).toBe(1);
    expect(novoAtendimentoEditadoDoBanco).toMatchObject({
      tipoAtendimento: "Atendimento teste",
      responsavel: "Segundo médico",
      descricao: "Atendimento atualizado",
      pet: "Bidu",
      date: `${new Date()}`,
    })

    await Responsavel.destroy(responsavelCriado1, true);
    await Responsavel.destroy(responsavelCriado2, true);
    await Pet.destroy(petCriado, true);
    await AtendimentoTipo.destroy(tipoCriado, true);
  });

  
  test('Não deve ser possível criar atendimento com um campo vazio', async () => {
    const pet = { nome: 'Macunzá', tutor: 'Eli', telefone: '21321903', endereco: 'Muluguzinho' };
    const responsavel = {
      nome: 'Dr. Who?',
      funcao: 'Tosador',
      telefone: '3920183',
      senha: '12345',
      email: 'emailofwho@gmail.com',
    };

    const petCriado = await Pet.create(pet, true);
    const responsavelCriado = await Responsavel.create(responsavel, true);
    const tipoCriado = await AtendimentoTipo.create({ tipo: 'Atendimento teste'}, true);

    const atendimento = {
      tipoAtendimento: 'Atendimento teste',
      responsavel: responsavelCriado,
      descricao: '',
      pet: petCriado,
      date: `${new Date()}`,
    };

    const atendimentoResultado = await Atendimento.create(atendimento, true);
    
    expect(atendimentoResultado).toBe(-1);
    await Pet.destroy(petCriado, true)
    await AtendimentoTipo.destroy(tipoCriado, true)
    await Responsavel.destroy(responsavelCriado, true)
  })
});
