import { DMMF } from "@prisma/generator-helper";
import { expect, test } from "vitest";

import { generateImplicitManyToManyModels } from "~/helpers/generateImplicitManyToManyModels";

test("it respects overrides when generating field types", () => {
  const newModels = generateImplicitManyToManyModels([
    {
      name: "Category",
      fields: [
        {
          name: "id",
          type: "String",
          isId: true,
          hasDefaultValue: true,
          isList: false,
          isReadOnly: false,
          isRequired: true,
          isUnique: true,
          kind: "scalar",
        },
        {
          name: "posts",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          type: "Post",
          hasDefaultValue: false,
          relationName: "CategoryToPost",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      dbName: null,
      uniqueFields: [],
      uniqueIndexes: [],
    },
    {
      name: "Post",
      fields: [
        {
          name: "id",
          type: "String",
          isId: true,
          hasDefaultValue: true,
          isList: false,
          isReadOnly: false,
          isRequired: true,
          isUnique: true,
          kind: "scalar",
        },
        {
          name: "categories",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          type: "Category",
          hasDefaultValue: false,
          relationName: "CategoryToPost",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      dbName: null,
      uniqueFields: [],
      uniqueIndexes: [],
    },
  ]);

  expect(newModels).toEqual<DMMF.Model[]>([
    {
      name: "CategoryToPost",
      dbName: "_CategoryToPost",
      fields: [
        {
          hasDefaultValue: false,
          isId: false,
          isList: false,
          isReadOnly: true,
          isRequired: true,
          isUnique: false,
          kind: "scalar",
          name: "A",
          type: "String",
        },
        {
          hasDefaultValue: false,
          isId: false,
          isList: false,
          isReadOnly: true,
          isRequired: true,
          isUnique: false,
          kind: "scalar",
          name: "B",
          type: "String",
        },
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
    },
  ]);
});

test("it filters out many-to-one relations safely", () => {
  const newModels = generateImplicitManyToManyModels([
    {
      name: "Category",
      fields: [
        {
          name: "id",
          type: "String",
          isId: true,
          hasDefaultValue: true,
          isList: false,
          isReadOnly: false,
          isRequired: true,
          isUnique: true,
          kind: "scalar",
        },
        {
          name: "posts",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          type: "Post",
          hasDefaultValue: false,
          relationName: "CategoryToPost",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      dbName: null,
      uniqueFields: [],
      uniqueIndexes: [],
    },
    {
      name: "Post",
      fields: [
        {
          name: "id",
          type: "String",
          isId: true,
          hasDefaultValue: true,
          isList: false,
          isReadOnly: false,
          isRequired: true,
          isUnique: true,
          kind: "scalar",
        },
        {
          name: "categories",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          type: "Category",
          hasDefaultValue: false,
          relationName: "CategoryToPost",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "userId",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "user",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "User",
          relationName: "PostToUser",
          relationFromFields: ["userId"],
          relationToFields: ["id"],
          relationOnDelete: "Cascade",
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      dbName: null,
      uniqueFields: [],
      uniqueIndexes: [],
    },
    {
      name: "User",
      fields: [
        {
          name: "id",
          type: "String",
          isId: true,
          hasDefaultValue: true,
          isList: false,
          isReadOnly: false,
          isRequired: true,
          isUnique: true,
          kind: "scalar",
        },
        {
          name: "posts",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          type: "Post",
          hasDefaultValue: false,
          relationName: "PostToUser",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      dbName: null,
      uniqueFields: [],
      uniqueIndexes: [],
    },
  ]);

  expect(newModels).toEqual<DMMF.Model[]>([
    {
      name: "CategoryToPost",
      dbName: "_CategoryToPost",
      fields: [
        {
          hasDefaultValue: false,
          isId: false,
          isList: false,
          isReadOnly: true,
          isRequired: true,
          isUnique: false,
          kind: "scalar",
          name: "A",
          type: "String",
        },
        {
          hasDefaultValue: false,
          isId: false,
          isList: false,
          isReadOnly: true,
          isRequired: true,
          isUnique: false,
          kind: "scalar",
          name: "B",
          type: "String",
        },
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
    },
  ]);
});
