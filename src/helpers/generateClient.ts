import { generateCrudTypes } from "~/helpers/generateCrudTypes";
import { generateModel } from "~/helpers/generateModel";
import { createCamelCaseMapper } from "~/utils/camelCase";

const snakeToCamel = createCamelCaseMapper();

export const generateClient = (models: Array<ReturnType<typeof generateModel>>, cruds: ReturnType<typeof generateCrudTypes>) => {
  const allTables = [];
  for (const { typeName, tableName } of models) {
    const modelTemplate = `
    const ${snakeToCamel(tableName)} = {
      update: (data: Update${typeName}) => {
        return client.updateTable("${tableName}").set(data);
      },
      insert: (data: New${typeName}) => {
        return client.insertInto("${tableName}").values(data);
      },
      select: (data: Select${typeName}) => {
        return client.selectFrom("${tableName}").select(data);
      },
      delete: () => {
        return client.deleteFrom("${tableName}");
      },
    };
`;

    allTables.push(modelTemplate);
  }

  const returnStmt = models.map(({ tableName }) => snakeToCamel(tableName)).join(', ');
  const imports = cruds.map((t) => `  ${t.name.escapedText}`).sort(compareByLength).join(',\n');

  const clientTemplate = `
import { Dialect, Kysely } from "kysely";
import { \n  DB,\n${imports} 
} from './types';

export const Database = {
  init(dialect: Dialect) {
    const client = new Kysely<DB>({
      dialect,
    });
${allTables.join('')}
    return { client, ${returnStmt} };
  }
};
`;

  return clientTemplate;
};


const compareByLength = (a: string, b: string) => a.length - b.length;