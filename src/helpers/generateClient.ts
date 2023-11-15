import type { generateCrudTypes } from "~/helpers/generateCrudTypes";
import type { generateModel } from "~/helpers/generateModel";
import { normalizeCase } from "~/utils/normalizeCase";
import type { Config } from "~/utils/validateConfig";


export const generateClient = (models: Array<ReturnType<typeof generateModel>>, cruds: ReturnType<typeof generateCrudTypes>, config: Config) => {
  const allTables = [];

  for (const { typeName, tableName } of models) {
    const tabName = normalizeCase(tableName, config);
    const modelTemplate = `
    const ${tabName} = {
      select<Columns extends keyof ${typeName}>(
        selections: ReadonlyArray<Columns>
      ) {
        return client.selectFrom("${tabName}").select(selections) as unknown as SelectQueryBuilder<DB, keyof DB, Pick<${typeName}, Columns>>;
      },
      selectAll: () => client.selectFrom("${tabName}").selectAll(),
      insert: (data: New${typeName}) => {
        return client.insertInto("${tabName}").values(data).returningAll();
      },
      update: (data: Update${typeName}) => {
        return client.updateTable("${tabName}").set(data).returningAll();
      },
      delete: () => {
        return client.deleteFrom("${tabName}").returningAll();
      },
    };
`;

    allTables.push(modelTemplate);
  }

  const returnStmt = models.map(({ tableName }) => normalizeCase(tableName, config)).join(', ');
  const crudImports = cruds.map((t) => `${t.name.escapedText}`).filter((imp) => !imp.includes("Select"));
  const imports = [...crudImports, ...models.map(({ typeName }) => typeName)].map((i) => `  ${i}`).sort(compareByLength).join(',\n');

  const clientTemplate = `
import { type Dialect, Kysely, type SelectQueryBuilder } from "kysely";
import type { \n  DB,\n${imports} 
} from './types';

export const KyselyClient = {
  init(dialect: Dialect) {
    const client = new Kysely<DB>({
      dialect,
    });
${allTables.join('')}
    return { client, ${returnStmt} };
  }
};

export type KyselyClient = ReturnType<typeof KyselyClient.init>;
`;

  return clientTemplate;
};


const compareByLength = (a: string, b: string) => a.length - b.length;