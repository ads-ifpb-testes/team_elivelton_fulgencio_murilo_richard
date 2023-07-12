const Responsavel = require('../../models/Responsaveis');

describe('Serviço de responsaveis', () => {
  test('Deve ser possível criar um responsável', async () => {
    const responsavel = {
      nome: 'Dr. Hans Chucrute',
      funcao: 'Veterinário',
      telefone: '309293848',
      senha: '12345',
      email: 'doctorRey@gmail.com',
    };

    const responsaveisAntes = await Responsavel.readAll(true);
    const qntResponsaveisAntes = responsaveisAntes.length;

    await Responsavel.create(responsavel, true);

    const responsaveisDepois = await Responsavel.readAll(true);
    const qntResponsaveisDepois = responsaveisDepois.length;

    expect(qntResponsaveisDepois).toBe(qntResponsaveisAntes + 1);
  });

  test('Deve ser possível encontrar um responsável pelo id', async () => {
    //procurando id cadastrado pelo banco no teste de criação de responsável
    const responsaveis = await Responsavel.readAll(true);
    const indice = responsaveis.length - 1;
    const id = responsaveis[indice].id;

    const responsavel = await Responsavel.readById(id, true);

    expect(responsavel).toBeDefined();
    expect(responsavel.id).toBe(id);
  });

  test('Deve ser possível encontrar responsável pelo email', async () => {
    //procurando email cadastrado no teste de criação de responsável
    const email = 'doctorRey@gmail.com';
    const responsavel = await Responsavel.readByEmail(email, true);
    expect(responsavel).toBeDefined();
  });

  test('Deve ser possível encontrar responsável pelo nome pelo nome', async () => {
    //procurando nome cadastrado no teste de criação de responsável
    const nome = 'Dr. Hans Chucrute';
    const responsavel = await Responsavel.readByName(nome, true);
    expect(responsavel).toBeDefined();
    expect(responsavel.some((responsavel) => responsavel.nome === nome)).toBe(true);
  });

  test('Deve ser possível deletar um responsável', async () => {
    //ultilizando de exemplo o último responsável criado pelo teste
    const responsaveis = await Responsavel.readAll(true);
    const indice = responsaveis.length - 1;
    const id = responsaveis[indice].id;

    const destroy = await Responsavel.destroy(id, true);

    expect(destroy).toBe(0);
  });

  test('Não deve ser possível criar um responsavel com um Id que já está no banco', async () => {
    const responsavel1 = {
      nome: 'nomeExemplo',
      funcao: 'funcaoExemplo',
      telefone: 'telefoneExemplo',
      senha: '12345',
      email: 'emailExemplo@gmail.com',
    };

    const responsavelCriado1 = await Responsavel.create(responsavel1, true);

    const responsavel2 = {
      nome: 'nomeExemplo2',
      funcao: 'funcaoExemplo2',
      telefone: 'telefoneExemplo2',
      senha: '123452',
      email: 'emailExemplo2@gmail.com',
      id: responsavelCriado1,
    };

    try {
      await Responsavel.create(responsavel2, true);
    } catch (e) {
      expect(e).toMatchObject({ code: 'SQLITE_CONSTRAINT' });
    }
    const deleteResponsavel1 = await Responsavel.readByEmail('emailExemplo@gmail.com', true);

    await Responsavel.destroy(deleteResponsavel1.id, true);
  });

  test('Não deve ser possível criar um responsavel com um Email que já está no banco', async () => {
    const responsavel1 = {
      nome: 'nomeExemplo',
      funcao: 'funcaoExemplo',
      telefone: 'telefoneExemplo',
      senha: '12345',
      email: 'emailExemplo@gmail.com',
    };

    await Responsavel.create(responsavel1, true);

    const responsavel2 = {
      nome: 'nomeExemplo2',
      funcao: 'funcaoExemplo2',
      telefone: 'telefoneExemplo2',
      senha: '123452',
      email: responsavel1.email,
    };

    try {
      await Responsavel.create(responsavel2, true);
    } catch (e) {
      expect(e).toMatchObject({ code: 'SQLITE_CONSTRAINT' });
    }

    const deleteResponsavel1 = await Responsavel.readByEmail('emailExemplo@gmail.com', true);

    await Responsavel.destroy(deleteResponsavel1.id, true);
  });

  test('Deve ser possível atualizar o responsável com o ID fornecido', async () => {
    const responsavel = {
      nome: 'nomeExemplo',
      funcao: 'funcaoExemplo',
      telefone: 'telefoneExemplo',
      senha: '12345',
      email: 'emailExemplo@gmail.com',
    };

    const responsavelCriado = await Responsavel.create(responsavel, true);

    const data = {
      nome: 'Fulano Atualizado',
      funcao: 'Gerente',
      telefone: '123456789',
      email: 'emailExemplo2@gmail.com',
      senha: '123456',
    };

    const result = await Responsavel.update(responsavelCriado, data, true);

    expect(result).toBe(1);

    await Responsavel.destroy(responsavelCriado, true);
  });

  test('Não deve ser possível criar um responsável com um dos campos vazios', async () => {
    const responsavel = {
      nome: 'nomeExemplo',
      funcao: '',
      telefone: 'telefoneExemplo',
      senha: '12345',
      email: 'emailExemplo@gmail.com',
    };

    const responsavelCriado = await Responsavel.create(responsavel, true);

    expect(responsavelCriado).toBe(-1);
  });
});
