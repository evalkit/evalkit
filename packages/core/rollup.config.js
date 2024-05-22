import pkg from "./package.json";
import { createRollupConfig } from "../../utils/shared-rollup.config";

export default createRollupConfig("core", {
  packageJson: pkg,
});
