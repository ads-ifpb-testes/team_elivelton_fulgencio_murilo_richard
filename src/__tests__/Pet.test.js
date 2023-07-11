const Pet = require('../models/Pet');

describe("Serviço de pets", () => {
    test("Deve ser possível adicionar um pet", async () => {
        const pet = { nome: 'Fuleco', tutor: 'Eli', telefone: '8394584656', endereco: 'Sitio Saco' };

        const petsAntes = await Pet.readAll();
        const qntPetsAntes = petsAntes.length;
        await Pet.create(pet);
        const petsDepois = await Pet.readAll();
        const qntPetsDepois = petsDepois.length;

        expect(qntPetsDepois).toBe(qntPetsAntes+1);
    });

    test('Deve ser possível pesquisar um pet pelo nome', async () => {
      const nome = 'Fuleco';
      const pet = await Pet.search(nome);
      expect(pet).toBeDefined();
      expect(pet.some((pet) => pet.nome === nome)).toBe(true);
    });
});