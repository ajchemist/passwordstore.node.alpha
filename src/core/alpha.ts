import { exec } from 'child_process';
import { promises as fsPromises, mkdtempSync } from 'fs';
import { promisify } from 'util';

const execProm = promisify(exec);

interface ExecResult {
    stdout: string;
    stderr: string;
}

async function shExit(cmd: string): Promise<ExecResult> {
    try {
        const { stdout, stderr } = await execProm(cmd);
        const output = stderr + stdout;
        if (output) {
            console.log(output);
        }
        return { stdout, stderr };
    } catch (err) {
        console.error(err);
        throw new Error('Non-zero exit.');
    }
}

export async function show(passName: string): Promise<string | null> {
    if (typeof passName !== 'string' || !passName.trim()) {
        throw new Error('Invalid pass name');
    }

    try {
        const { stdout, stderr } = await shExit(`pass show ${passName}`);
        const errOutput = stderr.toString();

        if (errOutput.trim()) {
            console.log(errOutput);
            return null;
        }

        if (stdout.includes(`${passName}\n└── `) || stdout.includes(`${passName}\n├── `)) {
            return null;
        }

        if (stdout.match(/content-disposition: attachment;/i)) {
            const tempFilePath = mkdtempSync('pass-copy-');
            await shExit(`gopass fscopy ${passName} ${tempFilePath}`);
            return fsPromises.readFile(tempFilePath, 'utf8');
        }

        return stdout.trim();
    } catch (err: any) {
        console.error(err.message);
        return null;
    }
}