const Pet = require('../../models/Pet');

describe('Serviço de pets', () => {
  test('Deve ser possível adicionar um pet', async () => {
    const pet = { nome: 'Fuleco', tutor: 'Eli', telefone: '8394584656', endereco: 'Sitio Saco' };

    const petsAntes = await Pet.readAll(true);
    const qntPetsAntes = petsAntes.length;

    await Pet.create(pet, true);

    const petsDepois = await Pet.readAll(true);
    const qntPetsDepois = petsDepois.length;

    expect(qntPetsDepois).toBe(qntPetsAntes + 1);
  });

  test('Deve ser possível pesquisar um pet pelo nome', async () => {
    const nome = 'Fuleco';
    const pet = await Pet.search(nome, true);

    expect(pet).toBeDefined();
    expect(pet.some((pet) => pet.nome === nome)).toBe(true);
  });

  test('Deve ser possível encontrar um pet pelo id', async () => {
    const pets = await Pet.readAll(true);
    const indice = pets.length - 1;
    const id = pets[indice].id;

    const pet = await Pet.readById(id, true);

    expect(pet).toBeDefined();
    expect(pet.id).toBe(id);
  });

  test('Deve ser possível atualizar um pet através do id', async () => {
    const pets = await Pet.readAll(true);
    const indice = pets.length - 1;
    const id = pets[indice].id;

    const pet = {
      nome: 'Caramelo',
      tutor: 'Shelby',
      telefone: '834545932',
      endereco: 'Terra de Ninguém',
    };

    const update = await Pet.update(id, pet, true);

    expect(update).toBe(1);
  });

  test('Deve ser possível deletar um pet através do id', async () => {
    const pets = await Pet.readAll(true);
    const indice = pets.length - 1;
    const id = pets[indice].id;

    const destroy = await Pet.destroy(id, true);

    expect(destroy).toBe(0);
  });

  test('Devem ser retornados 5 pets ou menos com o comando readByName', async () => {
    const pet1 = { nome: 'Pet1', tutor: 'Tutor1', telefone: 'Telefone1', endereco: 'Endereço1' };
    const pet2 = { nome: 'Pet2', tutor: 'Tutor2', telefone: 'Telefone2', endereco: 'Endereço2' };
    const pet3 = { nome: 'Pet3', tutor: 'Tutor3', telefone: 'Telefone3', endereco: 'Endereço3' };
    const pet4 = { nome: 'Pet4', tutor: 'Tutor4', telefone: 'Telefone4', endereco: 'Endereço4' };
    const pet5 = { nome: 'Pet5', tutor: 'Tutor5', telefone: 'Telefone5', endereco: 'Endereço5' };
    const pet6 = { nome: 'Pet6', tutor: 'Tutor6', telefone: 'Telefone6', endereco: 'Endereço6' };

    const petCriado1 = await Pet.create(pet1, true);
    const petCriado2 = await Pet.create(pet2, true);
    const petCriado3 = await Pet.create(pet3, true);
    const petCriado4 = await Pet.create(pet4, true);
    const petCriado5 = await Pet.create(pet5, true);
    const petCriado6 = await Pet.create(pet6, true);

    const petsLidos = await Pet.readByName('Pet', true);
    const qtdPets = petsLidos.length;

    expect(qtdPets).toBeLessThanOrEqual(5);
  });

  test('Devem ser possível listar até os 5 primeiros pets do banco com readFirst5', async () => {
    const pets = await Pet.readFirst5(true);
    const qtdPets = pets.length;
    expect(qtdPets).toBeLessThanOrEqual(5);
  });

  test('Deve ser possível criar um pet informando o id', async () => {
    const pets = await Pet.readAll(true);
    const indice = pets.length - 1;
    const id = pets[indice].id + 1;

    const pet1 = {
      nome: 'Pet com id',
      tutor: 'João',
      telefone: '1121312',
      endereco: 'IFPB',
      id: id,
    };

    const petsAntes = await Pet.readAll(true);
    const qntPetsAntes = petsAntes.length;

    await Pet.create(pet1, true);

    const petsDepois = await Pet.readAll(true);
    const qntPetsDepois = petsDepois.length;

    expect(qntPetsDepois).toBe(qntPetsAntes + 1);
  });

  test('Não deve ser possível criar um pet com um Id que já está no banco', async () => {
    const pet1 = { nome: 'Pet1', tutor: 'Tutor1', telefone: 'Telefone1', endereco: 'Endereço1' };
    const petCriado1 = await Pet.create(pet1, true);

    const pet2 = {
      nome: 'Pet2',
      tutor: 'Tutor2',
      telefone: 'Telefone2',
      endereco: 'Endereço2',
      id: petCriado1,
    };

    try {
      await Pet.create(pet2, true);
    } catch (e) {
      expect(e).toMatchObject({ code: 'SQLITE_CONSTRAINT' });
    }
  });

  test('Não deve ser possível criar um pet com um campo vazio', async () => {
    const pet1 = { nome: 'Bidu', tutor: '', telefone: '333333', endereco: 'IFPB' };
    const petCriado1 = await Pet.create(pet1, true);

    expect(petCriado1).toBe(-1);
  });
});
