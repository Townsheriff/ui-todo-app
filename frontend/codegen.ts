import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  debug: true,
  verbose: true,
  schema: "http://localhost:5000/graphql",
  documents: ["./src/store/gql-*/**/*.graphql"],
  generates: {
    "./src/store/schema.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
