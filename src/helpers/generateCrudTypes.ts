import ts from "typescript";
import type { generateModel } from "~/helpers/generateModel";

/**
 * Some of Prisma's default values are implemented in
 * JS. These should therefore not be annotated as Generated.
 * See https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#attribute-functions.
 */
export const generateCrudTypes = (models: Array<ReturnType<typeof generateModel>>) => {
  const allTheStmts = [];
  for (const model of models) {

    const selectStmt = ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(`Select${model.typeName}`),
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier("ReadonlyArray"),
        [ts.factory.createTypeOperatorNode(
          ts.SyntaxKind.KeyOfKeyword,
          ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(model.typeName), undefined)
        )]
      )
    );
    const newStmt = ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(`New${model.typeName}`),
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier("Insertable"),
        [ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(model.typeName), undefined)]
      )
    );
    const updateStmt = ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(`Update${model.typeName}`),
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier("Updateable"),
        [ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(model.typeName), undefined)]
      )
    );

    allTheStmts.push(selectStmt);
    allTheStmts.push(newStmt);
    allTheStmts.push(updateStmt);
  }

  return allTheStmts;
};
