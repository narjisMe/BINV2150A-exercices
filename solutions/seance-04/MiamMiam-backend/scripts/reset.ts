import { clear } from "./clear";
import { seed } from "./seed";

async function reset(): Promise<void> {
  clear();
  await seed();
}

reset().catch((error) => {
  console.error("Échec de la réinitialisation :", error);
  process.exitCode = 1;
});
