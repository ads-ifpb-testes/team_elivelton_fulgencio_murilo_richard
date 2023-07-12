const AtendimentoTipo = require('../../models/AtendimentoTipo');

describe('Serviços de AtendimentoTipo', () => {
  test('Deve ser possível encontrar um tipo de atendimento pelo nome', async () => {
    const nomeTipo = 'Banho';
    const tipo = await AtendimentoTipo.readByType(nomeTipo);
    expect(tipo).toBeDefined();
  });
});
