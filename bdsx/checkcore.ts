
import * as colors from 'colors';
import { cgate } from './core';
import * as nversion from './version-bdsx.json';

if (cgate.bdsxCoreVersion !== nversion) {
    const oversion = cgate.bdsxCoreVersion || '1.0.0.1';
    console.error(colors.red('[BDSX] BDSX Core outdated'));
    console.error(colors.red(`[BDSX] Current version: ${oversion}`));
    console.error(colors.red(`[BDSX] Required version: ${nversion}`));
    console.log("[BDSX] Please run 'npm i' or " + (process.platform === "win32" ? 'update.bat' : 'update.sh') + " to update");
    process.exit(0);
}
