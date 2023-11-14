import type { generateCrudTypes } from "~/helpers/generateCrudTypes";
import type { generateModel } from "~/helpers/generateModel";
import { normalizeCase } from "~/utils/normalizeCase";
import type { Config } from "~/utils/validateConfig";

export const generateClient = (models: Array<ReturnType<typeof generateModel>>, cruds: ReturnType<typeof generateCrudTypes>, config: Config) => {
  const allTables = [];

  for (const { typeName, tableName } of models) {
    const modelTemplate = `
    const ${normalizeCase(tableName, config)
      } = {
    update: (data: Update${typeName}) => {
      return client.updateTable("${tableName}").set(data);
    },
      insert: (data: New${typeName}) => {
        return client.insertInto("${tableName}").values(data);
      },
        select: client.selectFrom("${tableName}").select,
          selectAll: client.selectFrom("${tableName}").selectAll,
            delete: () => {
              return client.deleteFrom("${tableName}");
            },
    };
  `;

    allTables.push(modelTemplate);
  }

  const returnStmt = models.map(({ tableName }) => normalizeCase(tableName, config)).join(', ');
  const imports = cruds.map((t) => `  ${t.name.escapedText} `).sort(compareByLength).join(',\n');

  const clientTemplate = `
  import { Dialect, Kysely } from "kysely";
  import { \n  DB, \n${imports}
} from './types';

export const Database = {
  init(dialect: Dialect) {
    const client = new Kysely<DB>({
      dialect,
    });
${allTables.join('')}
    return { client, ${returnStmt}
  };
}
};

export type KyselyClient = ReturnType<typeof Database.init>;
`;

  return clientTemplate;
};


const compareByLength = (a: string, b: string) => a.length - b.length;