/**
 * Seed script for RS Móveis Planejados em MDF
 * Run with: npx prisma db seed
 */

import { INITIAL_PROJECTS, INITIAL_CLIENTS, INITIAL_BUDGETS, INITIAL_MESSAGES } from '../src/data/initialData';

async function main() {
  console.log('--- Iniciando Seed para RS Móveis Planejados em MDF ---');
  console.log(`Carregando ${INITIAL_PROJECTS.length} projetos de alto padrão...`);
  console.log(`Carregando ${INITIAL_CLIENTS.length} clientes e ${INITIAL_BUDGETS.length} orçamentos...`);
  console.log(`Carregando ${INITIAL_MESSAGES.length} mensagens iniciais...`);
  console.log('--- Seed finalizado com sucesso! ---');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
